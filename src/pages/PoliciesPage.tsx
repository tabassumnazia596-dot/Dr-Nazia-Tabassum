import React, { useState } from 'react';
import { ShieldCheck, FileText, RefreshCw, AlertTriangle, Scale } from 'lucide-react';
import { BotanicalBranch, GoldStripeDivider } from '../components/BotanicalAccents';
import { Language } from '../types/clinic';
import { translations } from '../utils/translations';

interface PoliciesPageProps {
  initialSection?: 'privacy' | 'terms' | 'refund' | 'global';
  language: Language;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({
  initialSection = 'privacy',
  language,
}) => {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'refund' | 'global'>(initialSection);
  const t = translations[language];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <BotanicalBranch className="w-4 h-4 text-emerald-700" />
          <span>Clinic Governance & Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Policies & Practice Guidelines
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Clear, ethical, and transparent guidelines governing your online homeopathic consultations with Dr. Nazia Tabassum.
        </p>
        <GoldStripeDivider />

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          <button
            onClick={() => setActivePolicy('privacy')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              activePolicy === 'privacy'
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActivePolicy('terms')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              activePolicy === 'terms'
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => setActivePolicy('refund')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              activePolicy === 'refund'
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Cancellation & Refund Policy
          </button>
          <button
            onClick={() => setActivePolicy('global')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              activePolicy === 'global'
                ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            National & International Practice
          </button>
        </div>
      </div>

      {/* Policy Content Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        
        {/* 1. PRIVACY POLICY */}
        {activePolicy === 'privacy' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center gap-3 text-emerald-900 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
              <h2 className="text-xl font-serif font-bold">Patient Privacy & Health Data Policy</h2>
            </div>

            <p>
              At the online homeopathic practice of <strong>Dr. Nazia Tabassum</strong>, patient privacy and medical confidentiality are paramount. This policy details how we collect, handle, and protect your personal and health information.
            </p>

            <h3 className="font-semibold text-slate-900 text-base">1. Information We Collect</h3>
            <p>
              We collect your name, WhatsApp/mobile number, age, symptoms description, and appointment scheduling details. This information is utilized strictly to conduct your online clinical consultation, verify appointment fee settlement, and maintain case history.
            </p>

            <h3 className="font-semibold text-slate-900 text-base">2. Medical Confidentiality</h3>
            <p>
              All health descriptions, symptoms, laboratory findings, and diagnostic notes shared during your WhatsApp or video consultation are treated under doctor-patient confidentiality. Your records will never be sold, disclosed, or shared with third-party advertisers.
            </p>

            <h3 className="font-semibold text-slate-900 text-base">3. Payment Security</h3>
            <p>
              Online payments are processed through <strong>ABHI Pay</strong>. We do not store your credit card numbers, banking PINs, or wallet passwords on our servers. All financial transactions are secured through 256-bit encryption via the payment gateway.
            </p>
          </div>
        )}

        {/* 2. TERMS & CONDITIONS */}
        {activePolicy === 'terms' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center gap-3 text-emerald-900 pb-3 border-b border-slate-100">
              <Scale className="w-6 h-6 text-emerald-700" />
              <h2 className="text-xl font-serif font-bold">Terms and Conditions of Practice</h2>
            </div>

            <p>
              By accessing this website, scheduling an appointment, or paying the consultation fee, you agree to these Terms and Conditions.
            </p>

            <h3 className="font-semibold text-slate-900 text-base">1. Scope of Online Practice</h3>
            <p>
              Dr. Nazia Tabassum (D.H.M.S, R.H.M.P) provides professional homeopathic evaluations exclusively via online channels (WhatsApp video/audio calls). Online consultations do not encompass physical palpation, emergency triage, or hospital admissions.
            </p>

            <h3 className="font-semibold text-slate-900 text-base">2. Consultation Tariff & Confirmation</h3>
            <p>
              The standard consultation fee is <strong>PKR 500</strong> per scheduled appointment. An appointment is only held in confirmed status once backend verification confirms successful receipt of the payment reference from ABHI Pay.
            </p>

            <h3 className="font-semibold text-slate-900 text-base">3. Punctuality and Availability</h3>
            <p>
              Patients are requested to be online and available on WhatsApp at their reserved time slot between 4:00 PM and 9:00 PM PKT. Delays exceeding 15 minutes without prior notice may require rescheduling.
            </p>
          </div>
        )}

        {/* 3. REFUND & CANCELLATION */}
        {activePolicy === 'refund' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center gap-3 text-emerald-900 pb-3 border-b border-slate-100">
              <RefreshCw className="w-6 h-6 text-emerald-700" />
              <h2 className="text-xl font-serif font-bold">Cancellation & Rescheduling Policy</h2>
            </div>

            <p>
              We understand that unforeseen circumstances may necessitate changes to your schedule. Our cancellation and refund guidelines are structured to be fair and transparent:
            </p>

            <h3 className="font-semibold text-slate-900 text-base">1. Rescheduling Your Appointment</h3>
            <p>
              You may reschedule your consultation without penalty up to <strong>2 hours prior</strong> to your scheduled appointment time. You can coordinate rescheduling through our website or by messaging WhatsApp (03112932192).
            </p>

            <h3 className="font-semibold text-slate-900 text-base">2. Refund Eligibility</h3>
            <p>
              - If you cancel your booking at least 4 hours before the scheduled time, a full refund of PKR 500 will be initiated back to your original payment source via ABHI Pay.<br />
              - In the rare event that the doctor must cancel a scheduled slot due to unforeseen emergency, the patient will be offered an immediate priority reschedule or an immediate 100% refund.<br />
              - Once a consultation has taken place, the professional consultation fee is non-refundable.
            </p>

            <h3 className="font-semibold text-slate-900 text-base">3. Refund Processing Timelines</h3>
            <p>
              Approved refunds are routed through ABHI Pay back to your issuing bank or digital wallet within 3 to 5 business days, subject to standard Pakistani interbank clearing cycles.
            </p>
          </div>
        )}

        {/* 4. NATIONAL & INTERNATIONAL PRACTICE GUIDELINES */}
        {activePolicy === 'global' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center gap-3 text-emerald-900 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
              <h2 className="text-xl font-serif font-bold">National & International Online Consultation Guidelines</h2>
            </div>

            <p>
              Dr. Nazia Tabassum is dedicated to providing high-quality, individualized homeopathic care to patients residing in Pakistan and worldwide.
            </p>

            <h3 className="font-semibold text-slate-900 text-base">1. Service Scope for National Patients (Pakistan)</h3>
            <p>
              Patients from Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, and all other cities can easily book online appointments. Consultations are conducted via WhatsApp in Urdu or English. Prescriptions provide clear generic and Latin homeopathic names with exact potencies, allowing patients to conveniently procure remedies from certified local pharmacies in their hometown.
            </p>

            <h3 className="font-semibold text-slate-900 text-base">2. Service Scope for International & Overseas Patients</h3>
            <p>
              Overseas Pakistanis and international clients worldwide (including the Gulf, Middle East, UK, USA, Canada, Europe, and Australia) are welcome to schedule online sessions. Please ensure your selected appointment slot corresponds to <strong>Pakistan Standard Time (PKT, UTC+5)</strong>.
            </p>

            <h3 className="font-semibold text-slate-900 text-base">3. Global Communication & Follow-up</h3>
            <p>
              All consultations take place on WhatsApp (+92 311 2932192). Follow-up check-ins and dosage adjustments are coordinated directly with Dr. Nazia Tabassum to ensure continuous care regardless of geographic location.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
