import fs from 'fs';
import path from 'path';

export interface Appointment {
  id: string;
  reference: string; // e.g. APT-2026-7841
  patientName: string;
  whatsappNumber: string;
  age: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "04:30 PM"
  healthConcern: string;
  notes?: string;
  status: 'Awaiting Payment' | 'Payment Pending' | 'Payment Verified' | 'Confirmed' | 'Cancelled' | 'Payment Failed';
  paymentRef?: string;
  paidAmount?: number;
  paidAt?: string;
  paymentMethod?: string;
  doctorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  transactionRef: string; // ABHI-XXXXX
  appointmentRef: string;
  patientName: string;
  amount: number;
  currency: string;
  status: 'INITIATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  provider: 'ABHI Pay';
  environment: 'sandbox' | 'production';
  gatewayResponse?: any;
  createdAt: string;
  verifiedAt?: string;
}

export interface ClinicSettings {
  doctorName: string;
  qualifications: string;
  location: string;
  consultationType: string;
  consultationFee: number;
  whatsappNumber: string;
  hoursStart: string; // "16:00"
  hoursEnd: string; // "21:00"
  slotDurationMinutes: number; // 30
  enabledDays: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat (default Mon-Sat: [1,2,3,4,5,6])
  disabledDates: string[]; // YYYY-MM-DD
  languages: string[];
  abhiPay: {
    environment: 'sandbox' | 'production';
    accountReference: string; // "PK13ABHI0000923112932192"
    merchantApproved: boolean;
    merchantId: string;
    apiKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  adminPasswordHash?: string;
}

interface DatabaseSchema {
  settings: ClinicSettings;
  appointments: Appointment[];
  transactions: PaymentTransaction[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'clinic-store.json');

const DEFAULT_SETTINGS: ClinicSettings = {
  doctorName: 'Dr. Nazia Tabassum',
  qualifications: 'D.H.M.S, R.H.M.P',
  location: 'Karachi, Pakistan',
  consultationType: 'Online only',
  consultationFee: 500,
  whatsappNumber: '03112932192',
  hoursStart: '16:00', // 4:00 PM
  hoursEnd: '21:00',   // 9:00 PM
  slotDurationMinutes: 30,
  enabledDays: [1, 2, 3, 4, 5, 6], // Mon - Sat
  disabledDates: [],
  languages: ['English', 'Urdu'],
  abhiPay: {
    environment: 'sandbox',
    accountReference: 'PK13ABHI0000923112932192',
    merchantApproved: false,
    merchantId: '',
    apiKey: '',
    secretKey: '',
    webhookSecret: '',
  },
  adminPasswordHash: 'doctor123', // Default admin password
};

// Initial seed appointments for demonstration in sandbox
const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-seed-1',
    reference: 'APT-2026-1042',
    patientName: 'Ayesha Khan',
    whatsappNumber: '03001234567',
    age: 32,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '05:00 PM',
    healthConcern: 'Chronic migraine and allergy flare-ups over the past 4 months.',
    notes: 'Prefers audio/video call on WhatsApp.',
    status: 'Confirmed',
    paymentRef: 'ABHI-PAY-8829104',
    paidAmount: 500,
    paidAt: new Date(Date.now() - 3600000).toISOString(),
    paymentMethod: 'ABHI Pay (Sandbox)',
    doctorNotes: 'Initial case-taking scheduled. Requested patient to have medical history notes ready.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'apt-seed-2',
    reference: 'APT-2026-1089',
    patientName: 'Mohammad Usman',
    whatsappNumber: '03219876543',
    age: 45,
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '06:30 PM',
    healthConcern: 'Acid reflux and recurring digestive discomfort after meals.',
    status: 'Awaiting Payment',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    this.ensureDirectory();
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          appointments: parsed.appointments || [],
          transactions: parsed.transactions || [],
        };
      } catch (err) {
        console.error('Failed to parse clinic-store.json, creating fallback', err);
      }
    }

    const initialData: DatabaseSchema = {
      settings: DEFAULT_SETTINGS,
      appointments: DEFAULT_APPOINTMENTS,
      transactions: [
        {
          id: 'tx-seed-1',
          transactionRef: 'ABHI-PAY-8829104',
          appointmentRef: 'APT-2026-1042',
          patientName: 'Ayesha Khan',
          amount: 500,
          currency: 'PKR',
          status: 'SUCCESS',
          provider: 'ABHI Pay',
          environment: 'sandbox',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          verifiedAt: new Date(Date.now() - 3600000).toISOString(),
        }
      ],
    };
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema) {
    this.ensureDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  public getSettings(): ClinicSettings {
    return { ...this.data.settings };
  }

  public updateSettings(updates: Partial<ClinicSettings>): ClinicSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData(this.data);
    return { ...this.data.settings };
  }

  public getAppointments(): Appointment[] {
    return [...this.data.appointments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getAppointmentByReference(ref: string): Appointment | undefined {
    return this.data.appointments.find(a => a.reference.toUpperCase() === ref.trim().toUpperCase());
  }

  public getAppointmentById(id: string): Appointment | undefined {
    return this.data.appointments.find(a => a.id === id);
  }

  public isSlotAvailable(date: string, timeSlot: string, excludeId?: string): boolean {
    const existing = this.data.appointments.find(a => 
      a.date === date && 
      a.timeSlot === timeSlot && 
      a.id !== excludeId &&
      a.status !== 'Cancelled' && 
      a.status !== 'Payment Failed'
    );
    return !existing;
  }

  public createAppointment(apt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment {
    const id = 'apt-' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    const newApt: Appointment = {
      ...apt,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.data.appointments.push(newApt);
    this.saveData(this.data);
    return newApt;
  }

  public updateAppointment(id: string, updates: Partial<Appointment>): Appointment | undefined {
    const index = this.data.appointments.findIndex(a => a.id === id || a.reference === id);
    if (index === -1) return undefined;

    const updated = {
      ...this.data.appointments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.appointments[index] = updated;
    this.saveData(this.data);
    return updated;
  }

  public createTransaction(tx: Omit<PaymentTransaction, 'id' | 'createdAt'>): PaymentTransaction {
    const id = 'tx-' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    const newTx: PaymentTransaction = {
      ...tx,
      id,
      createdAt: now,
    };
    this.data.transactions.push(newTx);
    this.saveData(this.data);
    return newTx;
  }

  public getTransaction(txRef: string): PaymentTransaction | undefined {
    return this.data.transactions.find(t => t.transactionRef === txRef);
  }

  public updateTransaction(txRef: string, updates: Partial<PaymentTransaction>): PaymentTransaction | undefined {
    const index = this.data.transactions.findIndex(t => t.transactionRef === txRef);
    if (index === -1) return undefined;
    const updated = { ...this.data.transactions[index], ...updates };
    this.data.transactions[index] = updated;
    this.saveData(this.data);
    return updated;
  }

  public getTransactions(): PaymentTransaction[] {
    return [...this.data.transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const db = new Database();
