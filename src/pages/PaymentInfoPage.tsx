import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Building2,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { BotanicalBranch, GoldStripeDivider } from '../components/BotanicalAccents';
import { AbhiPayModal } from '../components/AbhiPayModal';
import { Appointment, Language } from '../types/clinic';
import { translations } from '../utils/translations';

interface PaymentInfoPageProps {
  setCurrentTab: (tab: string) => void;
  language: Language;
}

export const PaymentInfoPage: React.FC<PaymentInfoPageProps> = ({ setCurrentTab, language }) => {
  const t = translations[language];

  const [appointmentRef, setAppointmentRef] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentRef.trim()) {
      setLookupError('Please enter your appointment reference (e.g. APT-2026-XXXXX).');
      return;
    }

    setLookupLoading(true);
    setLookupError('');
    setSelectedApt(null);

    try {
      const res = await fetch(`/api/appointments/${encodeURIComponent(appointmentRef.trim())}`);
      const data = await res.json();
      if (res.ok && data.appointment) {
        setSelectedApt(data.appointment);
        setShowModal(true);
      } else {
        setLookupError(data.error || 'Appointment reference not found. Please verify the code.');
      }
    } catch (err) {
      setLookupError('Network error connecting to clinic server.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <BotanicalBranch className="w-4 h-4 text-emerald-700" />
          <span>ABHI Pay Integration & Fee Structure</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Payment Information & Guidance
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Online consultation fee: <strong>PKR 500 per appointment</strong>. Payments are processed through our structured integration with <strong>ABHI Pay</strong>.
        </p>
        <GoldStripeDivider />
      </div>

      {/* Hero Fee Card */}
      <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-3xl p-8 border border-emerald-200/80 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs uppercase font-semibold text-emerald-800 tracking-wider">
              Single Transparent Consultation Tariff
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-serif font-bold text-slate-900">PKR 500</span>
              <span className="text-xs text-slate-500">per 30-minute online consultation</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Includes comprehensive case assessment with Dr. Nazia Tabassum, individualized homeopathic prescription, and dietary counsel. All appointments must be paid prior to scheduled session confirmation.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 text-xs shadow-2xs">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Automated Verification</span>
            </div>
            <p className="text-slate-500">
              Payments are verified automatically on the clinic backend. Browser redirects and screenshots are never treated as confirmation.
            </p>
            <div className="pt-1 text-[11px] text-emerald-800 font-medium">
              Provider: ABHI Pay (Subject to merchant approval)
            </div>
          </div>

        </div>
      </div>

      {/* Pay Pending Fee Tool */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="max-w-xl mx-auto text-center space-y-2">
          <h2 className="text-xl font-serif font-bold text-slate-900">
            Pay Consultation Fee for an Existing Booking
          </h2>
          <p className="text-xs text-slate-600">
            If you already made an appointment and received an <code>APT-2026-XXXXX</code> reference, enter it below to launch the secure checkout.
          </p>

          <form onSubmit={handleLookup} className="flex gap-2 pt-2">
            <input
              type="text"
              value={appointmentRef}
              onChange={(e) => setAppointmentRef(e.target.value)}
              placeholder="e.g. APT-2026-1042"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
            <button
              type="submit"
              disabled={lookupLoading}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <CreditCard className="w-4 h-4" />
              <span>{lookupLoading ? 'Checking...' : 'Pay PKR 500'}</span>
            </button>
          </form>

          {lookupError && (
            <p className="text-xs text-rose-700 pt-1 text-left">{lookupError}</p>
          )}
        </div>
      </div>

      {/* ABHI Pay Technical Architecture & Workflow */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-slate-900 text-center">
          Payment Processing Workflow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-semibold text-slate-900">Session Initialization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When an appointment is selected, the backend initiates a session with a unique transaction reference and holds the slot temporarily.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-semibold text-slate-900">Customer Checkout</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Payment is completed through ABHI Pay via Mobile Wallet (EasyPaisa/JazzCash), Bank Cards, or Direct Account transfer.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-semibold text-slate-900">Server Verification & Confirm</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The backend queries ABHI Pay or processes an official webhook, verifying amount, currency, and reference before marking the appointment <strong>Confirmed</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Notice on Supplied Account Reference */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <Info className="w-4 h-4 text-emerald-700" />
          <span>Payment Gateway Notice</span>
        </div>
        <p>
          The clinic's preferred payment gateway provider is <strong>ABHI Pay</strong>, subject to final merchant account approval and integration availability. While merchant credentials undergo verification, the website operates in Sandbox Simulator Mode allowing patients and clinic testing staff to rehearse and verify the entire end-to-end booking and confirmation flow.
        </p>
        <p className="text-slate-500">
          Supplied clinic account reference: <code>PK13ABHI0000923112932192</code> is maintained internally for merchant setup and will not be shared as a raw transfer destination until approved by ABHI.
        </p>
      </div>

      {/* Trigger Modal if opened */}
      {showModal && selectedApt && (
        <AbhiPayModal
          appointment={selectedApt}
          onClose={() => setShowModal(false)}
          onPaymentSuccess={() => {
            setShowModal(false);
            setCurrentTab('track');
          }}
          language={language}
        />
      )}

    </div>
  );
};
