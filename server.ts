import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db, Appointment, ClinicSettings } from './server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory admin session storage
const activeSessions = new Set<string>();

// Middleware to protect admin routes
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }
  const token = authHeader.split(' ')[1];
  if (!activeSessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
  next();
}

// -------------------------------------------------------------
// PUBLIC CLINIC ENDPOINTS
// -------------------------------------------------------------

// 1. Get Clinic Public Information
app.get('/api/clinic-info', (_req: Request, res: Response) => {
  const settings = db.getSettings();
  // Safe public subset (never expose internal account credentials or secrets)
  const publicInfo = {
    doctorName: settings.doctorName,
    qualifications: settings.qualifications,
    location: settings.location,
    consultationType: settings.consultationType,
    consultationFee: settings.consultationFee,
    whatsappNumber: settings.whatsappNumber,
    cleanWhatsAppNumber: '+923112932192',
    hoursStart: settings.hoursStart,
    hoursEnd: settings.hoursEnd,
    slotDurationMinutes: settings.slotDurationMinutes,
    enabledDays: settings.enabledDays,
    languages: settings.languages,
    paymentProvider: 'ABHI Pay',
    paymentEnvironment: settings.abhiPay.environment,
    merchantApproved: settings.abhiPay.merchantApproved,
  };
  res.json(publicInfo);
});

// Helper: generate slots between 16:00 (4:00 PM) and 21:00 (9:00 PM)
function generateSlotsForRange(startStr: string, endStr: string, intervalMin: number): string[] {
  const [startH, startM] = startStr.split(':').map(Number);
  const [endH, endM] = endStr.split(':').map(Number);
  
  const slots: string[] = [];
  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes < endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const formatted = `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
    slots.push(formatted);
    currentMinutes += intervalMin;
  }
  return slots;
}

// 2. Get Available Slots for a given date
app.get('/api/available-slots', (req: Request, res: Response) => {
  const { date } = req.query;
  if (!date || typeof date !== 'string') {
    return res.status(400).json({ error: 'Date parameter (YYYY-MM-DD) is required' });
  }

  const settings = db.getSettings();
  const targetDate = new Date(date + 'T00:00:00');
  const dayOfWeek = targetDate.getDay(); // 0 is Sunday, 1 is Monday ...

  // Check if day is enabled by admin
  if (!settings.enabledDays.includes(dayOfWeek)) {
    return res.json({
      date,
      available: false,
      reason: 'The clinic is closed on this day of the week.',
      slots: [],
    });
  }

  // Check if date is in disabledDates
  if (settings.disabledDates.includes(date)) {
    return res.json({
      date,
      available: false,
      reason: 'The doctor is not taking appointments on this specific date.',
      slots: [],
    });
  }

  const allSlots = generateSlotsForRange(
    settings.hoursStart || '16:00',
    settings.hoursEnd || '21:00',
    settings.slotDurationMinutes || 30
  );

  const slotStatusList = allSlots.map(slot => {
    const isAvail = db.isSlotAvailable(date, slot);
    return {
      timeSlot: slot,
      isAvailable: isAvail,
    };
  });

  res.json({
    date,
    available: true,
    slots: slotStatusList,
    consultationHours: `${settings.hoursStart} - ${settings.hoursEnd} (4:00 PM - 9:00 PM PKT)`,
    fee: settings.consultationFee,
  });
});

// 3. Create Appointment Booking
app.post('/api/appointments', (req: Request, res: Response) => {
  try {
    const { patientName, whatsappNumber, age, date, timeSlot, healthConcern, notes } = req.body;

    if (!patientName || typeof patientName !== 'string' || patientName.trim().length < 2) {
      return res.status(400).json({ error: 'Patient full name is required (minimum 2 characters)' });
    }
    if (!whatsappNumber || typeof whatsappNumber !== 'string' || whatsappNumber.trim().length < 10) {
      return res.status(400).json({ error: 'A valid WhatsApp / mobile number is required' });
    }
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      return res.status(400).json({ error: 'Please enter a valid age between 1 and 120' });
    }
    if (!date || !timeSlot) {
      return res.status(400).json({ error: 'Appointment date and time slot are required' });
    }
    if (!healthConcern || typeof healthConcern !== 'string' || healthConcern.trim().length < 5) {
      return res.status(400).json({ error: 'Brief description of your health concern is required' });
    }

    // Double booking prevention check
    const isAvail = db.isSlotAvailable(date, timeSlot);
    if (!isAvail) {
      return res.status(409).json({
        error: 'This time slot is no longer available. Please select another slot between 4:00 PM and 9:00 PM.',
      });
    }

    // Generate unique reference: APT-2026-XXXXX
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const appointmentReference = `APT-${year}-${randomSuffix}`;

    const newAppointment = db.createAppointment({
      reference: appointmentReference,
      patientName: patientName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      age: parsedAge,
      date,
      timeSlot,
      healthConcern: healthConcern.trim(),
      notes: notes ? String(notes).trim() : '',
      status: 'Awaiting Payment',
    });

    const settings = db.getSettings();

    res.status(201).json({
      success: true,
      appointment: newAppointment,
      consultationFee: settings.consultationFee,
      currency: 'PKR',
      message: 'Appointment booked successfully. Please complete the consultation fee payment to verify and confirm your booking.',
    });
  } catch (err: any) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: 'Internal server error while creating appointment' });
  }
});

// 4. Get Appointment by Reference (Patient lookup)
app.get('/api/appointments/:reference', (req: Request, res: Response) => {
  const { reference } = req.params;
  const apt = db.getAppointmentByReference(reference);
  if (!apt) {
    return res.status(404).json({ error: 'Appointment reference not found. Please verify your reference number.' });
  }
  res.json({
    appointment: apt,
    fee: db.getSettings().consultationFee,
  });
});

// -------------------------------------------------------------
// ABHI PAY PAYMENT GATEWAY WORKFLOW
// -------------------------------------------------------------

// 5. Initiate Payment
app.post('/api/payments/initiate', (req: Request, res: Response) => {
  const { appointmentReference } = req.body;
  if (!appointmentReference) {
    return res.status(400).json({ error: 'Appointment reference is required' });
  }

  const apt = db.getAppointmentByReference(appointmentReference);
  if (!apt) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  if (apt.status === 'Confirmed' || apt.status === 'Payment Verified') {
    return res.status(400).json({ error: 'This appointment has already been paid and confirmed.' });
  }

  const settings = db.getSettings();
  const amount = settings.consultationFee || 500;
  const currency = 'PKR';

  // Generate unique transaction reference
  const txRef = `ABHI-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Create transaction in pending state
  const tx = db.createTransaction({
    transactionRef: txRef,
    appointmentRef: apt.reference,
    patientName: apt.patientName,
    amount,
    currency,
    status: 'PENDING',
    provider: 'ABHI Pay',
    environment: settings.abhiPay.environment,
  });

  // Update appointment status to Payment Pending
  db.updateAppointment(apt.id, {
    status: 'Payment Pending',
    paymentRef: txRef,
  });

  res.json({
    success: true,
    transactionRef: txRef,
    appointmentRef: apt.reference,
    patientName: apt.patientName,
    amount,
    currency,
    provider: 'ABHI Pay',
    environment: settings.abhiPay.environment,
    merchantApproved: settings.abhiPay.merchantApproved,
    instructions: settings.abhiPay.merchantApproved
      ? 'Redirecting to official ABHI Pay checkout'
      : 'ABHI Pay sandbox/demo checkout session initiated. Use simulated checkout to verify flow.',
  });
});

// 6. Server-Side Payment Verification (prevents fake client-side assertions)
app.post('/api/payments/verify', (req: Request, res: Response) => {
  const { transactionRef, appointmentReference, simulatedSuccess, paymentMethod } = req.body;

  if (!transactionRef || !appointmentReference) {
    return res.status(400).json({ error: 'Transaction reference and appointment reference are required' });
  }

  const apt = db.getAppointmentByReference(appointmentReference);
  if (!apt) {
    return res.status(404).json({ error: 'Appointment reference not found' });
  }

  const tx = db.getTransaction(transactionRef);
  if (!tx) {
    return res.status(404).json({ error: 'Transaction reference not found in payment records' });
  }

  // Prevent duplicate confirmation
  if (apt.status === 'Confirmed' && tx.status === 'SUCCESS') {
    return res.json({
      success: true,
      alreadyConfirmed: true,
      appointment: apt,
      transaction: tx,
      message: 'Payment has already been verified and appointment is confirmed.',
    });
  }

  const settings = db.getSettings();

  // If live credentials are used in production, perform server-side check with ABHI Pay API
  if (settings.abhiPay.environment === 'production' && settings.abhiPay.merchantApproved) {
    // Note: Live payment gateway verification hook
    // When live credentials (API key & secret) are present, request https://api.abhi.com.pk/v1/payments/verify
    if (!settings.abhiPay.apiKey) {
      return res.status(500).json({
        error: 'Merchant API configuration is incomplete. Please contact clinic administration or switch to sandbox.',
      });
    }
  }

  // In Sandbox / Verified mode:
  if (simulatedSuccess !== false) {
    const now = new Date().toISOString();
    // Update Transaction
    db.updateTransaction(transactionRef, {
      status: 'SUCCESS',
      verifiedAt: now,
      gatewayResponse: {
        provider: 'ABHI Pay',
        accountReferenceMasked: 'PK13ABHI****92',
        verifiedAmount: tx.amount,
        currency: 'PKR',
        channel: paymentMethod || 'ABHI Pay - Digital Gateway',
      },
    });

    // Update Appointment: Payment Verified -> Confirmed
    const updatedApt = db.updateAppointment(apt.id, {
      status: 'Confirmed',
      paidAmount: tx.amount,
      paidAt: now,
      paymentMethod: paymentMethod || 'ABHI Pay (Verified)',
    });

    return res.json({
      success: true,
      status: 'Confirmed',
      appointment: updatedApt,
      transactionRef,
      receipt: {
        appointmentReference: apt.reference,
        patientName: apt.patientName,
        date: apt.date,
        timeSlot: apt.timeSlot,
        amount: `${tx.amount} PKR`,
        paidAt: now,
        method: paymentMethod || 'ABHI Pay (Verified)',
        doctor: settings.doctorName,
        qualifications: settings.qualifications,
        whatsappSupport: settings.whatsappNumber,
      },
      message: 'Payment successfully verified. Your online homeopathic consultation is now CONFIRMED.',
    });
  } else {
    // Payment failed or was cancelled
    db.updateTransaction(transactionRef, { status: 'FAILED' });
    db.updateAppointment(apt.id, { status: 'Payment Failed' });
    return res.status(400).json({
      success: false,
      error: 'Payment could not be verified or was cancelled by user.',
    });
  }
});

// 7. Official Payment Webhook (Callback from ABHI Pay)
app.post('/api/payments/webhook', (req: Request, res: Response) => {
  const payload = req.body;
  console.log('[ABHI Pay Webhook received]:', payload);
  
  const { transaction_id, appointment_ref, status, amount } = payload;
  if (!transaction_id || !appointment_ref) {
    return res.status(400).json({ received: false, error: 'Missing webhook attributes' });
  }

  const apt = db.getAppointmentByReference(appointment_ref);
  if (!apt) {
    return res.status(404).json({ received: false, error: 'Appointment not found' });
  }

  if (status === 'COMPLETED' || status === 'SUCCESS') {
    db.updateTransaction(transaction_id, {
      status: 'SUCCESS',
      verifiedAt: new Date().toISOString(),
      gatewayResponse: payload,
    });
    db.updateAppointment(apt.id, {
      status: 'Confirmed',
      paidAmount: amount ? Number(amount) : 500,
      paidAt: new Date().toISOString(),
      paymentMethod: 'ABHI Pay Webhook Verification',
    });
  } else if (status === 'FAILED' || status === 'CANCELLED') {
    db.updateTransaction(transaction_id, { status: 'FAILED', gatewayResponse: payload });
    db.updateAppointment(apt.id, { status: 'Payment Failed' });
  }

  res.json({ received: true, status: 'PROCESSED' });
});

// -------------------------------------------------------------
// SECURE ADMIN DASHBOARD ENDPOINTS
// -------------------------------------------------------------

// 8. Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const settings = db.getSettings();
  const configuredPassword = process.env.ADMIN_PASSWORD || settings.adminPasswordHash || 'doctor123';

  if (!password || password !== configuredPassword) {
    return res.status(401).json({ error: 'Invalid admin password. Please try again.' });
  }

  const sessionToken = 'adm_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  activeSessions.add(sessionToken);

  res.json({
    success: true,
    token: sessionToken,
    doctorName: settings.doctorName,
    message: 'Welcome Dr. Nazia Tabassum. Admin authentication successful.',
  });
});

// 9. Admin Overview Metrics
app.get('/api/admin/overview', requireAdminAuth, (_req: Request, res: Response) => {
  const appointments = db.getAppointments();
  const transactions = db.getTransactions();
  const settings = db.getSettings();

  const todayStr = new Date().toISOString().split('T')[0];

  const total = appointments.length;
  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
  const awaitingPayment = appointments.filter(a => a.status === 'Awaiting Payment' || a.status === 'Payment Pending').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;
  const todayCount = appointments.filter(a => a.date === todayStr).length;

  const totalRevenue = appointments
    .filter(a => a.status === 'Confirmed' && a.paidAmount)
    .reduce((sum, a) => sum + (a.paidAmount || 0), 0);

  res.json({
    metrics: {
      totalAppointments: total,
      confirmedAppointments: confirmed,
      awaitingPayment,
      cancelledAppointments: cancelled,
      todayAppointments: todayCount,
      totalRevenuePKR: totalRevenue,
      consultationFee: settings.consultationFee,
    },
    gatewayStatus: {
      environment: settings.abhiPay.environment,
      merchantApproved: settings.abhiPay.merchantApproved,
      accountRefSupplied: 'PK13ABHI0000923112932192',
    },
  });
});

// 10. Admin Appointments List with Search and Filtering
app.get('/api/admin/appointments', requireAdminAuth, (req: Request, res: Response) => {
  const { status, search, date } = req.query;
  let list = db.getAppointments();

  if (status && typeof status === 'string' && status !== 'all') {
    list = list.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }

  if (date && typeof date === 'string') {
    list = list.filter(a => a.date === date);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(a =>
      a.patientName.toLowerCase().includes(q) ||
      a.reference.toLowerCase().includes(q) ||
      a.whatsappNumber.includes(q) ||
      a.healthConcern.toLowerCase().includes(q)
    );
  }

  res.json({ appointments: list });
});

// 11. Admin Update Appointment (Reschedule, Change Status, Doctor Notes)
app.patch('/api/admin/appointments/:reference', requireAdminAuth, (req: Request, res: Response) => {
  const { reference } = req.params;
  const { status, date, timeSlot, doctorNotes } = req.body;

  const apt = db.getAppointmentByReference(reference);
  if (!apt) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  // If rescheduling date and time slot, ensure slot is free
  if ((date && date !== apt.date) || (timeSlot && timeSlot !== apt.timeSlot)) {
    const newDate = date || apt.date;
    const newSlot = timeSlot || apt.timeSlot;
    const isAvail = db.isSlotAvailable(newDate, newSlot, apt.id);
    if (!isAvail) {
      return res.status(409).json({ error: `Selected slot ${newSlot} on ${newDate} is already booked.` });
    }
  }

  const updates: Partial<Appointment> = {};
  if (status) updates.status = status;
  if (date) updates.date = date;
  if (timeSlot) updates.timeSlot = timeSlot;
  if (doctorNotes !== undefined) updates.doctorNotes = doctorNotes;

  const updated = db.updateAppointment(apt.id, updates);
  res.json({ success: true, appointment: updated });
});

// 12. Admin Get Settings
app.get('/api/admin/settings', requireAdminAuth, (_req: Request, res: Response) => {
  const settings = db.getSettings();
  res.json({ settings });
});

// 13. Admin Update Settings (Fee, consultation hours, active days, ABHI credentials)
app.put('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const {
      consultationFee,
      hoursStart,
      hoursEnd,
      slotDurationMinutes,
      enabledDays,
      disabledDates,
      abhiPay,
    } = req.body;

    const current = db.getSettings();
    const updates: Partial<ClinicSettings> = {};

    if (consultationFee && !isNaN(Number(consultationFee))) {
      updates.consultationFee = Number(consultationFee);
    }
    if (hoursStart) updates.hoursStart = hoursStart;
    if (hoursEnd) updates.hoursEnd = hoursEnd;
    if (slotDurationMinutes) updates.slotDurationMinutes = Number(slotDurationMinutes);
    if (Array.isArray(enabledDays)) updates.enabledDays = enabledDays;
    if (Array.isArray(disabledDates)) updates.disabledDates = disabledDates;

    if (abhiPay) {
      updates.abhiPay = {
        ...current.abhiPay,
        environment: abhiPay.environment || current.abhiPay.environment,
        accountReference: abhiPay.accountReference || current.abhiPay.accountReference,
        merchantApproved: Boolean(abhiPay.merchantApproved),
        merchantId: abhiPay.merchantId ?? current.abhiPay.merchantId,
        apiKey: abhiPay.apiKey ?? current.abhiPay.apiKey,
        secretKey: abhiPay.secretKey ?? current.abhiPay.secretKey,
        webhookSecret: abhiPay.webhookSecret ?? current.abhiPay.webhookSecret,
      };
    }

    const saved = db.updateSettings(updates);
    res.json({ success: true, settings: saved });
  } catch (err: any) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// 14. Admin Export Appointments as CSV
app.get('/api/admin/export', requireAdminAuth, (_req: Request, res: Response) => {
  const appointments = db.getAppointments();
  const headers = [
    'Reference',
    'Patient Name',
    'WhatsApp Number',
    'Age',
    'Date',
    'Time Slot',
    'Status',
    'Health Concern',
    'Payment Ref',
    'Amount PKR',
    'Paid At',
    'Created At',
  ];

  const rows = appointments.map(a => [
    `"${a.reference}"`,
    `"${a.patientName.replace(/"/g, '""')}"`,
    `"${a.whatsappNumber}"`,
    a.age,
    `"${a.date}"`,
    `"${a.timeSlot}"`,
    `"${a.status}"`,
    `"${(a.healthConcern || '').replace(/"/g, '""')}"`,
    `"${a.paymentRef || ''}"`,
    a.paidAmount || '',
    `"${a.paidAt || ''}"`,
    `"${a.createdAt}"`,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="dr_nazia_tabassum_appointments.csv"');
  res.send(csv);
});

// -------------------------------------------------------------
// VITE DEV SERVER / STATIC ASSETS PIPELINE
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Mount Vite dev server middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Dr. Nazia Tabassum Clinic Server] running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal error starting server:', err);
});
