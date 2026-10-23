export interface ClinicInfo {
  doctorName: string;
  qualifications: string;
  location: string;
  consultationType: string;
  consultationFee: number;
  whatsappNumber: string;
  cleanWhatsAppNumber: string;
  hoursStart: string;
  hoursEnd: string;
  slotDurationMinutes: number;
  enabledDays: number[];
  languages: string[];
  paymentProvider: string;
  paymentEnvironment: 'sandbox' | 'production';
  merchantApproved: boolean;
}

export type AppointmentStatus =
  | 'Awaiting Payment'
  | 'Payment Pending'
  | 'Payment Verified'
  | 'Confirmed'
  | 'Cancelled'
  | 'Payment Failed';

export interface Appointment {
  id: string;
  reference: string;
  patientName: string;
  whatsappNumber: string;
  age: number;
  date: string;
  timeSlot: string;
  healthConcern: string;
  notes?: string;
  status: AppointmentStatus;
  paymentRef?: string;
  paidAmount?: number;
  paidAt?: string;
  paymentMethod?: string;
  doctorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SlotAvailability {
  timeSlot: string;
  isAvailable: boolean;
}

export interface PaymentInitiationResult {
  success: boolean;
  transactionRef: string;
  appointmentRef: string;
  patientName: string;
  amount: number;
  currency: string;
  provider: string;
  environment: 'sandbox' | 'production';
  merchantApproved: boolean;
  instructions: string;
}

export type Language = 'en' | 'ur';
