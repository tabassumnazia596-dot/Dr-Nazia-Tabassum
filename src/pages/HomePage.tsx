import React from 'react';
import {
  Calendar,
  CreditCard,
  MessageCircle,
  Clock,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  MapPin,
  ArrowRight,
  HeartPulse,
  Leaf,
  FileText,
  UserCheck,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { BotanicalBranch, BotanicalLeafBadge, GoldStripeDivider } from '../components/BotanicalAccents';
import { Language } from '../types/clinic';
import { translations } from '../utils/translations';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  language: Language;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab, language }) => {
  const t = translations[language];
  const doctorPhoto = '/assets/aistudio/7a327339-27d1-4cfd-a18b-b8bab46db18b_2_acd4a0a5.jpg';

  const whatsappUrl = `https://wa.me/923112932192?text=${encodeURIComponent(t.whatsappMessage)}`;

  const focusAreas = [
    {
      title: 'Digestive & Metabolic Wellness',
      desc: 'Individualized constitutional homeopathic support for chronic acidity, IBS symptoms, sluggish metabolism, and recurring bloating.',
      icon: HeartPulse,
    },
    {
      title: 'Skin & Allergic Sensitivities',
      desc: 'Gentle, internal regulation for chronic eczema, recurrent urticaria, seasonal allergies, and inflammatory skin conditions.',
      icon: Leaf,
    },
    {
      title: 'Women’s Holistic Health',
      desc: 'Natural, hormone-friendly homeopathic balancing for menstrual irregularities, PCOS wellness support, and stress-related imbalances.',
      icon: Sparkles,
    },
    {
      title: 'Stress, Anxiety & Sleep Support',
      desc: 'Deep-acting constitutional remedies that address mental fatigue, anxiety, sleep disturbances, and nervous exhaustion without dependency.',
      icon: Activity,
    },
    {
      title: 'Chronic Respiratory & Seasonal Issues',
      desc: 'Constitutional immunity bolstering for recurrent allergic rhinitis, chronic bronchitis symptoms, and sinus sensitivities.',
      icon: ShieldCheck,
    },
    {
      title: 'Pediatric & Family Care',
      desc: 'Non-invasive, pleasant-tasting homeopathic pellets suitable for children’s recurring colds, appetite concerns, and natural growth support.',
      icon: UserCheck,
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-radial from-emerald-50/50 via-white to-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-emerald-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Botanical Trust Kicker - Zero Pill Discipline */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
                <BotanicalBranch className="w-4 h-4 text-emerald-700" />
                <span>Dr. Nazia Tabassum · D.H.M.S, R.H.M.P</span>
                <span aria-hidden="true" className="text-emerald-300">·</span>
                <span className="text-amber-800 font-medium">Karachi, Pakistan</span>
                <span aria-hidden="true" className="text-emerald-300">·</span>
                <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  National & International Patients
                </span>
              </div>

              {/* Exact Required Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15] text-balance">
                “Personalized Homeopathic Consultation, Wherever You Are”
              </h1>

              {/* Exact Required Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-sans">
                “Connect with Dr. Nazia Tabassum for an online consultation. Book an appointment, choose an available time and discuss your health concerns from the comfort of your home.”
              </p>

              {/* Practice Consultation Highlight */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 shadow-xs max-w-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800 block">
                      Consultation Mode
                    </span>
                    <span className="text-xl sm:text-2xl font-serif font-bold text-emerald-950">
                      100% Online Consultations
                    </span>
                  </div>
                  <div className="text-xs text-emerald-800/80 sm:text-right font-medium">
                    <span>Direct WhatsApp Call</span>
                    <span className="block text-slate-500">4:00 PM – 9:00 PM PKT</span>
                  </div>
                </div>
              </div>

              {/* Core Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Button 1: Book an Appointment */}
                <button
                  onClick={() => setCurrentTab('book')}
                  className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-200" />
                  <span>Book an Appointment</span>
                </button>

                {/* Button 2: Chat on WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] active:scale-98 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Consultation Attributes Metadata Line (Clean unboxed typography) */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <strong>4:00 PM to 9:00 PM PKT</strong>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Online Only (National & Worldwide)</span>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Languages: English & Urdu</span>
              </div>

            </div>

            {/* Right Photo Column (5 cols) */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Outer decorative card */}
              <div className="relative w-full max-w-sm sm:max-w-md">
                
                {/* Subtle gold accent frame behind photo */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#C5A059]/30 to-emerald-200/40 rounded-3xl blur-sm -z-10"></div>
                
                <div className="relative bg-white p-3 rounded-2xl shadow-xl border border-emerald-950/10 overflow-hidden">
                  <div className="aspect-4/5 rounded-xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={doctorPhoto}
                      alt="Dr. Nazia Tabassum - Qualified Homeopathic Physician in Karachi"
                      className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Measured Scrim for legibility */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-5 text-white">
                      <p className="font-serif font-bold text-lg leading-tight">Dr. Nazia Tabassum</p>
                      <p className="text-xs text-amber-300 font-medium">D.H.M.S, R.H.M.P · Karachi</p>
                      <p className="text-[11px] text-slate-200 mt-1">
                        Licensed Homeopathic Practitioner · Online Consultations
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quiet credential chip below photo */}
                <div className="mt-3 bg-white/95 backdrop-blur-xs py-2 px-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Official Practice Credentials Verified</span>
                  </div>
                  <span className="font-semibold text-emerald-800">Karachi, PK</span>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. ONLINE CONSULTATION PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <BotanicalBranch className="w-4 h-4 text-emerald-700" />
            <span>Simple & Structured</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            {t.processTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Enjoy structured, unhurried homeopathic care without traveling or waiting in crowded clinic lobbies.
          </p>
          <GoldStripeDivider />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-serif font-bold text-lg border border-emerald-100">
              01
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900">
              {t.processStep1Title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.processStep1Desc}
            </p>
            <div className="text-xs text-emerald-800 font-medium flex items-center gap-1">
              <span>Quick and simple registration</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-7 border border-emerald-200 shadow-xs hover:border-emerald-300 transition-all space-y-4 relative">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-serif font-bold text-lg border border-amber-200">
              02
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900">
              {t.processStep2Title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.processStep2Desc}
            </p>
            <div className="text-xs text-amber-800 font-medium flex items-center gap-1">
              <span>Direct booking confirmation</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-serif font-bold text-lg border border-emerald-100">
              03
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-900">
              {t.processStep3Title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t.processStep3Desc}
            </p>
            <div className="text-xs text-emerald-800 font-medium flex items-center gap-1">
              <span>WhatsApp: 03112932192</span>
            </div>
          </div>

        </div>

        {/* CTA Strip */}
        <div className="mt-10 text-center">
          <button
            onClick={() => setCurrentTab('book')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-sm rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <span>Proceed to Booking System</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 3. DOCTOR INTRODUCTION SECTION */}
      <section className="bg-emerald-900/5 py-16 border-y border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                <img
                  src={doctorPhoto}
                  alt="Dr. Nazia Tabassum"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800">
                  Doctor Introduction
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  Dr. Nazia Tabassum
                </h2>
                <p className="text-sm font-semibold text-amber-800">
                  D.H.M.S, R.H.M.P · Karachi, Pakistan
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Welcome to our online homeopathic practice. Homeopathy is a holistic system of natural medicine that approaches health by assessing the individual as an integrated whole. Rather than merely suppressing acute discomfort, homeopathic consultations look at mental, emotional, and physical constitutions.
              </p>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Operating exclusively as an <strong>online consultation service</strong> from Karachi, our practice provides accessible, compassionate, and personalized care directly to patients across Pakistan and internationally.
              </p>

              {/* Verified Facts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Consultation Hours</span>
                  <span className="text-sm font-semibold text-slate-900">4:00 PM to 9:00 PM (Karachi Time)</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Standard Consultation Fee</span>
                  <span className="text-sm font-semibold text-emerald-800">PKR 500 per appointment</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Consultation Format</span>
                  <span className="text-sm font-semibold text-slate-900">Online only (Audio / Video / WhatsApp)</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Communication Languages</span>
                  <span className="text-sm font-semibold text-slate-900">English & Urdu</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentTab('about')}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Full Professional Background & Practice Ethics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. CLINICAL FOCUS AREAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <BotanicalBranch className="w-4 h-4 text-emerald-700" />
            <span>Gentle & Individualized</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Homeopathic Areas of Focus
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Comprehensive case-taking focused on identifying your unique constitutional remedy.
          </p>
          <GoldStripeDivider />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusAreas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xs transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-slate-900">
                  {area.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {area.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CONSULTATION APPOINTMENT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-300 bg-emerald-800/60 px-3 py-1 rounded-full border border-amber-300/30">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>4:00 PM to 9:00 PM (PKT) · Mon – Sat</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Ready to Schedule Your Consultation?
              </h2>
              <p className="text-sm text-slate-200 leading-relaxed">
                Connect with Dr. Nazia Tabassum for dedicated homeopathic case-taking from anywhere in Pakistan or overseas worldwide. Book your preferred time slot online with instant confirmation.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>National & Overseas Patients</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Audio / Video Call</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Instant Booking Pass</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <button
                onClick={() => setCurrentTab('book')}
                className="w-full py-4 px-6 bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-bold text-sm rounded-xl transition-all shadow-md text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4 text-amber-200" />
                <span>Book Consultation Online</span>
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20BD5A] active:scale-98 text-white font-semibold text-xs rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat Directly on WhatsApp (03112932192)</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 6. ONLINE CONSULTATION FOR NATIONAL & INTERNATIONAL PATIENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white to-emerald-50/70 rounded-3xl p-8 sm:p-12 border border-emerald-200/80 shadow-xs space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <BotanicalBranch className="w-4 h-4 text-emerald-700" />
              <span>Global Accessibility</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              {t.nationalAndInternationalTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {t.nationalAndInternationalSubtitle}
            </p>
            <GoldStripeDivider />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* National Patients Card */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                🇵🇰
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                National Consultations (Pakistan)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Consult with Dr. Nazia Tabassum from any city or province across Pakistan. Direct WhatsApp video and audio sessions in Urdu or English at your scheduled slot between 4:00 PM and 9:00 PM PKT.
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 space-y-1">
                <span className="font-semibold text-slate-800 block">Coverage:</span>
                <span>Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Quetta, Multan, Hyderabad, and all surrounding areas.</span>
              </div>
              <div className="text-xs font-medium text-emerald-800">
                ✓ Pay PKR 500 directly to official ABHI Account: PK13ABHI0000923112932192
              </div>
            </div>

            {/* International Patients Card */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                🌍
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                International & Overseas Patients
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Seamless online consultations for Pakistani expatriates and international individuals worldwide seeking personalized constitutional homeopathic evaluation from the comfort of their home.
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 space-y-1">
                <span className="font-semibold text-slate-800 block">Global Reach:</span>
                <span>UAE, Saudi Arabia, Qatar, Oman, United Kingdom, USA, Canada, Europe, Australia, and worldwide via WhatsApp.</span>
              </div>
              <div className="text-xs font-medium text-emerald-800">
                ✓ Time zone alignment with PKT · International Cards accepted via ABHI Pay
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentTab('book')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Book Online Consultation (National & International)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
