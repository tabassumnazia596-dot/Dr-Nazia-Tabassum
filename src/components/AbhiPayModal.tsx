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
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'card' | 'bank' | 'mobile_account'>('wallet');
  const [accountNumber, setAccountNumber] = useState(appointment.whatsappNumber || '');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [confirmedReceipt, setConfirmedReceipt] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Initiate payment transaction on first render if not already initiated
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
  const handleCompletePayment = async (simulatedSuccess: boolean = true) => {
    setStep('processing');
    setErrorMessage('');

    try {
      // Simulate real gateway response delay
      await new Promise(r => setTimeout(r, 1600));

      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionRef,
          appointmentReference: appointment.reference,
          simulatedSuccess,
          paymentMethod: `ABHI Pay - ${
            selectedMethod === 'wallet'
              ? 'Digital Wallet'
              : selectedMethod === 'card'
              ? 'Debit/Credit Card'
              : selectedMethod === 'bank'
              ? 'Direct Bank Transfer'
              : 'Mobile Account'
          }`,
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

  const copyReference = () => {
    navigator.clipboard.writeText(appointment.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center font-bold text-amber-300">
              A
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">ABHI Pay · Secure Checkout</h3>
              <p className="text-xs text-emerald-200">Dr. Nazia Tabassum Homeopathic Clinic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-md hover:bg-emerald-800/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sandbox Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Gateway Mode: Sandbox / Demo Simulation</span>
          </div>
          <span className="text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
            Subject to ABHI Merchant Approval
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: CHECKOUT */}
          {step === 'checkout' && (
            <div className="space-y-5">
              
              {/* Fee & Reference Summary Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Appointment Ref</span>
                  <button
                    onClick={copyReference}
                    className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-800 hover:text-emerald-800 cursor-pointer"
                  >
                    <span>{appointment.reference}</span>
                    <Copy className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
                {copied && <span className="text-[11px] text-emerald-600 block text-right">Copied to clipboard!</span>}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">Patient</span>
                  <span className="text-xs font-medium text-slate-800">{appointment.patientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Scheduled Date & Time</span>
                  <span className="text-xs font-medium text-slate-800">{appointment.date} · {appointment.timeSlot}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">Consultation Fee</span>
                  <span className="text-lg font-bold text-emerald-800">PKR 500</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select ABHI Pay Channel
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('wallet')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      selectedMethod === 'wallet'
                        ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-700/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-800">ABHI Wallet</span>
                      <span className="text-[11px] text-slate-500">Instant direct debit</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('mobile_account')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      selectedMethod === 'mobile_account'
                        ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-700/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-800">EasyPaisa / JazzCash</span>
                      <span className="text-[11px] text-slate-500">Mobile wallet prompt</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      selectedMethod === 'card'
                        ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-700/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-800">Debit / Credit Card</span>
                      <span className="text-[11px] text-slate-500">Visa, Mastercard, PayPak</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bank')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      selectedMethod === 'bank'
                        ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-700/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-800">Online Banking / Raast</span>
                      <span className="text-[11px] text-slate-500">Interbank funds transfer</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Account Input */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {selectedMethod === 'card'
                    ? 'Cardholder Name / Mobile Number'
                    : 'Account / Registered Mobile Number'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 03112932192"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>

              {/* Security Note */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>256-Bit SSL Encrypted Payment Channel · Server-side Verified</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleCompletePayment(true)}
                  className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Pay PKR 500 via ABHI Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCompletePayment(false)}
                    className="text-rose-600 hover:text-rose-700 underline cursor-pointer"
                  >
                    Simulate Payment Failure
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="hover:text-slate-800 cursor-pointer"
                  >
                    Cancel & Pay Later
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: PROCESSING */}
          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin mx-auto"></div>
              <div>
                <h4 className="text-base font-semibold text-slate-800">Verifying Payment with ABHI Pay...</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Performing server-side inquiry to confirm transaction reference, PKR 500 amount, and settlement status. Please do not close this window.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & CONFIRMATION */}
          {step === 'success' && (
            <div className="space-y-5 py-2">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-serif font-bold text-slate-900">
                  Payment Verified & Appointment Confirmed!
                </h4>
                <p className="text-xs text-slate-600">
                  Your online homeopathic consultation with Dr. Nazia Tabassum is officially scheduled.
                </p>
              </div>

              {/* Verified Receipt Card */}
              <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-200/80 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <span className="font-semibold text-slate-700">Receipt Ref</span>
                  <span className="font-mono font-bold text-emerald-900">{transactionRef || 'ABHI-SUCCESS'}</span>
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
                  <span className="text-slate-500">Appointment Date & Time</span>
                  <span className="font-medium text-slate-900">{appointment.date} at {appointment.timeSlot}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-bold text-emerald-800 text-sm">PKR 500 (Verified)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Consultation Channel</span>
                  <span className="text-slate-900 font-medium">WhatsApp Audio/Video (03112932192)</span>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <strong className="text-slate-800 block">Next Steps:</strong>
                <p>1. Keep your phone with WhatsApp ready at <strong>{appointment.timeSlot}</strong> on <strong>{appointment.date}</strong>.</p>
                <p>2. Dr. Nazia Tabassum will initiate your consultation call.</p>
                <p>3. You can message the clinic WhatsApp anytime with your reference number.</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-2.5 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <a
                  href={`https://wa.me/923112932192?text=${encodeURIComponent(
                    `Assalam-o-Alaikum Dr. Nazia Tabassum. My appointment reference is ${appointment.reference} (Paid PKR 500). Please guide me regarding my session.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-700 pt-1 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}

          {/* STEP 4: FAILED */}
          {step === 'failed' && (
            <div className="space-y-4 py-4 text-center">
              <div className="w-14 h-14 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900">Payment Could Not Be Verified</h4>
                <p className="text-xs text-rose-700 mt-1">{errorMessage}</p>
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your appointment is currently marked as <strong>Payment Failed</strong>. You can retry with another method or contact the clinic via WhatsApp for manual payment guidance.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
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
