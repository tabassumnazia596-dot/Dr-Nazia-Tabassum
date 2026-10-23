import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Building2,
  Lock,
  ArrowRight,
  Info,
  Copy,
  Check,
  ExternalLink,
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

  const abhiIban = 'PK13ABHI0000923112932192';
  const abhiTitle = 'Dr. Nazia Tabassum';
  const abhiBank = 'ABHI (Abhi Wallet / ABHI Pay)';

  const [appointmentRef, setAppointmentRef] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

  const handleCopyIban = () => {
    navigator.clipboard.writeText(abhiIban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

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
          <span>Official Payment Wallet & Gateway</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Payment Information & ABHI Wallet
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Online consultation fee: <strong>PKR 500 per appointment</strong>. Payments can be transferred directly to Dr. Nazia Tabassum's official <strong>ABHI Account Wallet</strong>.
        </p>
        <GoldStripeDivider />
      </div>

      {/* OFFICIAL ABHI WALLET ACCOUNT CARD */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-300 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Official Verified Payment Destination</span>
          </div>
          <span className="text-xs font-mono bg-emerald-800/80 text-emerald-200 px-3 py-1 rounded-lg">
            Bank Code: ABHI
          </span>
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-slate-300 block mb-1">
            Official ABHI Account / IBAN:
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20">
            <div>
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-white select-all block">
                {abhiIban}
              </span>
              <div className="text-xs text-emerald-200 pt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span>Account Title: <strong className="text-white">{abhiTitle}</strong></span>
                <span>Bank: <strong className="text-white">{abhiBank}</strong></span>
              </div>
            </div>

            <button
              onClick={handleCopyIban}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 ${
                copiedIban
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-95'
              }`}
            >
              {copiedIban ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedIban ? 'Account Copied!' : 'Copy ABHI Account'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-200 border-t border-white/10">
          <div>
            <span className="text-slate-400 block text-[11px]">Consultation Fee:</span>
            <span className="text-base font-bold text-amber-300">PKR 500</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Payment Destination:</span>
            <span className="font-semibold text-white">Official ABHI Account (PK13ABHI0000923112932192)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Confirmation:</span>
            <span>Instant Automatic Backend Verification</span>
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
            Enter your appointment reference (e.g. <code>APT-2026-1042</code>) to launch the checkout or confirm transfer to ABHI Account <strong>{abhiIban}</strong>.
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

      {/* Step-by-Step Payment Instructions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-slate-900 text-center">
          How to Pay PKR 500 to ABHI Account
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Transfer to ABHI Account</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transfer <strong>PKR 500</strong> directly to the clinic's official ABHI Account:
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-900 select-all">
              {abhiIban}
            </div>
            <p className="text-[11px] text-slate-500">
              Account Title: <strong>Dr. Nazia Tabassum</strong> · Bank: <strong>ABHI</strong>
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Note Transaction ID</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upon successful payment, note down the <strong>Transaction ID (TID)</strong> or reference number received on your screen or via confirmation SMS.
            </p>
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
              This unique reference serves as your proof of fee settlement.
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Instant Online Confirmation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your appointment reference and transaction ID to verify automatically, or share your receipt directly with Dr. Nazia on WhatsApp.
            </p>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900">
              WhatsApp: <strong>03112932192</strong> (+92 311 2932192)
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation & WhatsApp Share Strip */}
      <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <strong className="text-slate-900 block font-semibold mb-0.5">Need help or want to send your receipt on WhatsApp?</strong>
          <p className="text-xs text-slate-600">You can also message Dr. Nazia directly on <strong>03112932192</strong> for instant manual verification.</p>
        </div>
        <a
          href={`https://wa.me/923112932192?text=${encodeURIComponent(
            `Assalam-o-Alaikum Dr. Nazia Tabassum. I would like to inquire about payment transfer to your ABHI Account (${abhiIban}) for my consultation.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shrink-0"
        >
          <span>Chat on WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
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
