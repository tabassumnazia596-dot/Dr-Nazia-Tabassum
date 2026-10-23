import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ArrowRight,
  Printer,
  Copy,
  ExternalLink,
  Check,
  Zap,
} from 'lucide-react';
import { Appointment, Language } from '../types/clinic';

interface AbhiPayModalProps {
  appointment: Appointment;
  onClose: () => void;
  onPaymentSuccess: (confirmedApt: Appointment, receiptData: any) => void;
  language: Language;
}

export const AbhiPayModal: React.FC<AbhiPayModalProps> = ({
  appointment,
  onClose,
  onPaymentSuccess,
  language,
}) => {
  const [step, setStep] = useState<'checkout' | 'processing' | 'success' | 'failed'>('checkout');
  
  // Official ABHI Account details
  const abhiIban = 'PK13ABHI0000923112932192';
  const abhiTitle = 'Dr. Nazia Tabassum';
  const abhiBank = 'ABHI';

  // Form State
  const [senderAccount, setSenderAccount] = useState<string>(appointment.whatsappNumber || '');
  const [transferTrxId, setTransferTrxId] = useState<string>('');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [confirmedReceipt, setConfirmedReceipt] = useState<any>(null);
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Initiate payment transaction on mount
  React.useEffect(() => {
    let isMounted = true;
    async function initPayment() {
      try {
        const res = await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointmentReference: appointment.reference }),
        });
        const data = await res.json();
        if (isMounted) {
          if (data.success) {
            setTransactionRef(data.transactionRef);
          } else {
            setErrorMessage(data.error || 'Failed to initialize payment gateway.');
          }
        }
      } catch (err) {
        if (isMounted) setErrorMessage('Network error connecting to payment gateway.');
      }
    }
    initPayment();
    return () => { isMounted = false; };
  }, [appointment.reference]);

  // Handle server-side payment verification
  const handleVerifyPayment = async (simulatedSuccess: boolean = true) => {
    setStep('processing');
    setErrorMessage('');

    try {
      await new Promise(r => setTimeout(r, 1200));

      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionRef,
          appointmentReference: appointment.reference,
          simulatedSuccess,
          paymentMethod: `ABHI Account Transfer (IBAN: ${abhiIban})`,
          senderBank: 'ABHI Account',
          senderAccount,
          transferTrxId: transferTrxId.trim() || `TID-${Date.now().toString().slice(-6)}`,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setConfirmedReceipt(data.receipt);
        setStep('success');
        onPaymentSuccess(data.appointment, data.receipt);
      } else {
        setErrorMessage(data.error || 'Payment verification failed.');
        setStep('failed');
      }
    } catch (err: any) {
      setErrorMessage('Server connection error during payment verification.');
      setStep('failed');
    }
  };

  const copyIban = () => {
    navigator.clipboard.writeText(abhiIban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2500);
  };

  const copyReference = () => {
    navigator.clipboard.writeText(appointment.reference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-xs">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base leading-tight">ABHI Pay · Payment Wallet</h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Verified
                </span>
              </div>
              <p className="text-xs text-emerald-200">Dr. Nazia Tabassum Homeopathic Clinic (Karachi)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          
          {/* STEP 1: CHECKOUT */}
          {step === 'checkout' && (
            <div className="space-y-5">
              
              {/* Fee & Reference Summary Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Appointment Ref</span>
                  <button
                    onClick={copyReference}
                    className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-900 hover:text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer shadow-2xs"
                  >
                    <span>{appointment.reference}</span>
                    {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>
                {copiedRef && <span className="text-[11px] text-emerald-600 block text-right font-medium">Reference copied!</span>}

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Patient Name</span>
                  <span className="font-semibold text-slate-800">{appointment.patientName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Date & Time Slot</span>
                  <span className="font-semibold text-slate-800">{appointment.date} · {appointment.timeSlot}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">Consultation Fee</span>
                  <span className="text-xl font-bold text-emerald-900">PKR 500</span>
                </div>
              </div>

              {/* OFFICIAL ABHI ACCOUNT & IBAN HIGHLIGHT CARD */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 rounded-2xl p-5 border-2 border-emerald-600/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-emerald-800" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                      Official Clinic ABHI Account
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Direct ABHI Transfer
                  </span>
                </div>

                {/* Account IBAN Display Box */}
                <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                      ABHI Account / IBAN Number:
                    </span>
                    <span className="text-base sm:text-lg font-mono font-bold text-slate-950 select-all tracking-wide block">
                      {abhiIban}
                    </span>
                    <div className="text-xs text-slate-700 font-medium">
                      Account Title: <strong className="text-slate-900">{abhiTitle}</strong> · Bank / Wallet: <strong className="text-slate-900">ABHI</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={copyIban}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs ${
                      copiedIban
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-800 hover:bg-emerald-900 text-white active:scale-95'
                    }`}
                  >
                    {copiedIban ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedIban ? 'Account Copied!' : 'Copy ABHI Account'}</span>
                  </button>
                </div>

                {/* Instructions */}
                <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-3 rounded-xl border border-emerald-100">
                  Please transfer <strong>PKR 500</strong> to ABHI Account: <strong className="font-mono text-emerald-950">{abhiIban}</strong> (Title: <strong>{abhiTitle}</strong>). Then enter your transaction details below to verify your booking.
                </p>
              </div>

              {/* VERIFICATION FORM */}
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Sender Mobile / Account Number *
                    </label>
                    <input
                      type="text"
                      value={senderAccount}
                      onChange={(e) => setSenderAccount(e.target.value)}
                      placeholder="e.g. 03112932192"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Transaction ID / Reference (from SMS or receipt)
                    </label>
                    <input
                      type="text"
                      value={transferTrxId}
                      onChange={(e) => setTransferTrxId(e.target.value)}
                      placeholder="e.g. 2938172948 or TID"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <span>Destination: <strong>ABHI Account ({abhiIban})</strong></span>
                  <span className="font-bold text-slate-900">Amount: PKR 500</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleVerifyPayment(true)}
                  className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Confirm ABHI Account Transfer (PKR 500)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Security and Cancel */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>256-Bit Encrypted Transfer Record</span>
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="hover:text-slate-800 underline cursor-pointer"
                >
                  Pay Later
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: PROCESSING */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin mx-auto"></div>
              <div>
                <h4 className="text-base font-semibold text-slate-900">Verifying Payment to ABHI Wallet...</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Validating payment of PKR 500 to {abhiIban} and confirming appointment slot. Please wait a moment.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & CONFIRMATION */}
          {step === 'success' && (
            <div className="space-y-5 py-2 animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-serif font-bold text-slate-900">
                  Payment Verified & Appointment Confirmed!
                </h4>
                <p className="text-xs text-emerald-800 font-medium">
                  Your online homeopathic consultation with Dr. Nazia Tabassum is officially scheduled.
                </p>
              </div>

              {/* Verified Receipt Card */}
              <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <span className="font-semibold text-slate-700">Receipt Transaction ID</span>
                  <span className="font-mono font-bold text-emerald-950">{transferTrxId || transactionRef}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Appointment Reference</span>
                  <span className="font-mono font-bold text-slate-900">{appointment.reference}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Patient Name</span>
                  <span className="font-medium text-slate-900">{appointment.patientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Appointment Date & Slot</span>
                  <span className="font-bold text-slate-900">{appointment.date} at {appointment.timeSlot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Paid to ABHI Wallet</span>
                  <span className="font-mono font-bold text-emerald-900">{abhiIban}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Amount Settled</span>
                  <span className="font-bold text-emerald-800 text-sm">PKR 500 (Confirmed)</span>
                </div>
              </div>

              {/* Direct WhatsApp Share Button */}
              <div className="space-y-2 pt-1">
                <a
                  href={`https://wa.me/923112932192?text=${encodeURIComponent(
                    `Assalam-o-Alaikum Dr. Nazia Tabassum. I have transferred PKR 500 to your ABHI Account (${abhiIban}) for Appointment Reference: ${appointment.reference} (${appointment.date} at ${appointment.timeSlot}). Patient: ${appointment.patientName}. Please confirm my session.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Send Confirmation to Dr. Nazia on WhatsApp (03112932192)</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex-1 py-2.5 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl text-center cursor-pointer transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: FAILED */}
          {step === 'failed' && (
            <div className="space-y-4 py-4 text-center animate-in fade-in">
              <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900">Payment Could Not Be Verified</h4>
                <p className="text-xs text-rose-700 mt-1">{errorMessage}</p>
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You can retry verifying or share your payment screenshot directly to clinic WhatsApp: <strong>03112932192</strong>.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
