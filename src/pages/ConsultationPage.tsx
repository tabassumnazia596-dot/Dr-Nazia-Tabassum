import React from 'react';
import {
  Smartphone,
  Video,
  FileCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  CreditCard,
  MessageCircle,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { BotanicalBranch, GoldStripeDivider } from '../components/BotanicalAccents';
import { Language } from '../types/clinic';
import { translations } from '../utils/translations';

interface ConsultationPageProps {
  setCurrentTab: (tab: string) => void;
  language: Language;
}

export const ConsultationPage: React.FC<ConsultationPageProps> = ({ setCurrentTab, language }) => {
  const t = translations[language];

  const steps = [
    {
      num: '01',
      title: 'Online Slot Reservation',
      desc: 'Select your preferred date and convenient 30-minute time slot between 4:00 PM and 9:00 PM PKT. Input your health symptoms and contact details to receive a unique reference.',
    },
    {
      num: '02',
      title: 'PKR 500 Fee Payment via ABHI Pay',
      desc: 'Settle the consultation fee through the ABHI Pay payment gateway via mobile wallet (EasyPaisa/JazzCash), debit/credit card, or bank transfer for instantaneous backend verification.',
    },
    {
      num: '03',
      title: 'Comprehensive Online Case Taking',
      desc: 'At your scheduled time, Dr. Nazia Tabassum contacts you directly via WhatsApp video or audio call. A detailed, unhurried assessment of your physical, mental, and constitutional factors takes place.',
    },
    {
      num: '04',
      title: 'Individualized Guidance & Prescription',
      desc: 'Following the session, you receive individualized dietary recommendations and clear homeopathic remedy prescriptions with exact potency, dosage, and repetition instructions.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <BotanicalBranch className="w-4 h-4 text-emerald-700" />
          <span>Care From Comfort of Your Home</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          How Online Homeopathic Consultation Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Private, professional medical consultations with Dr. Nazia Tabassum via WhatsApp audio and video, designed around your schedule.
        </p>
        <GoldStripeDivider />
      </div>

      {/* Key Attributes Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <Clock className="w-8 h-8 text-emerald-700 shrink-0" />
          <div>
            <span className="text-xs text-slate-500 block">Consultation Hours</span>
            <span className="text-sm font-semibold text-slate-900">4:00 PM – 9:00 PM PKT</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-emerald-700 shrink-0" />
          <div>
            <span className="text-xs text-slate-500 block">Consultation Fee</span>
            <span className="text-sm font-semibold text-slate-900">PKR 500 (ABHI Pay)</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <Smartphone className="w-8 h-8 text-emerald-700 shrink-0" />
          <div>
            <span className="text-xs text-slate-500 block">Consultation Platform</span>
            <span className="text-sm font-semibold text-slate-900">WhatsApp (03112932192)</span>
          </div>
        </div>
      </div>

      {/* 4 Steps Journey */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-slate-900 text-center">
          The 4-Step Consultation Journey
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((st) => (
            <div key={st.num} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-serif font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Step {st.num}
              </span>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                {st.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* What to Prepare Before Your Consultation */}
      <div className="bg-emerald-50/60 rounded-3xl p-8 border border-emerald-100 space-y-6">
        <h2 className="text-xl font-serif font-bold text-slate-900">
          Preparing for Your Online Session
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p><strong>Timeline of Symptoms:</strong> Note down when your symptoms first began, what makes them better or worse (food, temperature, time of day).</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p><strong>Current Medications:</strong> Keep a record of all current conventional or supplementary medicines you are taking.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p><strong>Previous Lab Reports:</strong> Have any recent blood tests, scans, or diagnostic summaries ready to share over WhatsApp.</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p><strong>Quiet Environment:</strong> Choose a private, well-lit room for your video or audio consultation.</p>
          </div>
        </div>
      </div>

      {/* National & International Patient Guidance */}
      <div className="bg-white p-7 rounded-2xl border border-emerald-200/80 text-xs sm:text-sm text-slate-700 space-y-4">
        <div className="flex items-center gap-2 text-emerald-900 font-semibold">
          <Globe className="w-5 h-5 text-emerald-700" />
          <span className="text-base font-serif">Consulting National & International Patients Online</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-1.5">
            <strong className="text-slate-900 text-xs uppercase tracking-wider block">
              National Patients (Pakistan)
            </strong>
            <p className="text-xs text-slate-600 leading-relaxed">
              Serving patients across Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, and all cities. Direct consultation in Urdu or English. Prescriptions include standard remedy names easily obtainable at any local homeopathic pharmacy. Settle fee via ABHI Pay (EasyPaisa, JazzCash, or bank cards).
            </p>
          </div>
          <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 space-y-1.5">
            <strong className="text-slate-900 text-xs uppercase tracking-wider block">
              International & Overseas Patients
            </strong>
            <p className="text-xs text-slate-600 leading-relaxed">
              Welcoming overseas Pakistanis and international clients worldwide (UAE, Saudi Arabia, Gulf, UK, USA, Canada, Europe, Australia). Sessions conducted on WhatsApp audio or video call aligned with PKT. Online payments processed effortlessly via international debit/credit card through ABHI Pay.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="text-center pt-2">
        <button
          onClick={() => setCurrentTab('book')}
          className="px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Schedule Your Consultation (PKR 500)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
