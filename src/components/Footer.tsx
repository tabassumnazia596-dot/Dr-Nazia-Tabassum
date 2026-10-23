import React from 'react';
import { ShieldCheck, MessageCircle, MapPin, Clock, Stethoscope } from 'lucide-react';
import { Language } from '../types/clinic';
import { translations } from '../utils/translations';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, language }) => {
  const t = translations[language];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Doctor Identity */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-xl font-serif font-bold text-white tracking-tight">
              Dr. Nazia Tabassum
            </h3>
            <p className="text-xs text-emerald-400 font-medium tracking-wider uppercase">
              D.H.M.S · R.H.M.P
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {language === 'ur'
                ? 'کراچی سے آن لائن ہومیوپیتھک مشاورت۔ انفرادی کیس اسکل اور قدرتی شفایابی کے اصولوں پر مبنی علاج۔'
                : 'Personalized online homeopathic consultations based in Karachi, Pakistan. Individualized healing with natural, gentle therapeutics.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300/90 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Online Consultations · National & International Patients</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
              {language === 'ur' ? 'اہم لنکس' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => { setCurrentTab('home'); window.scrollTo(0, 0); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('about'); window.scrollTo(0, 0); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('consultation'); window.scrollTo(0, 0); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.navConsultation}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('book'); window.scrollTo(0, 0); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.navBook}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('payment'); window.scrollTo(0, 0); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.navPayment}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentTab('faqs'); window.scrollTo(0, 0); }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t.navFaqs}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinic Timings & Consultation Fee */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
              {language === 'ur' ? 'اوقات اور فیس' : 'Hours & Fee'}
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-medium">4:00 PM – 9:00 PM PKT</span>
                  <span className="text-xs text-slate-400">By confirmed appointment</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-medium">PKR 500 Consultation Fee</span>
                  <span className="text-xs text-slate-400">Verified via ABHI Pay</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-200 font-medium">Karachi, Pakistan</span>
                  <span className="text-xs text-slate-400">Consultation mode: Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
              {language === 'ur' ? 'براہ راست رابطہ' : 'Direct Support'}
            </h4>
            <p className="text-sm text-slate-400">
              {language === 'ur'
                ? 'اپائنٹمنٹ رہنمائی یا تصدیق کے لیے کلینک کے باضابطہ واٹس ایپ پر رابطہ فرمائیں:'
                : 'For booking guidance or session coordination, message the official clinic WhatsApp:'}
            </p>
            <a
              href={`https://wa.me/923112932192?text=${encodeURIComponent(t.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>03112932192 (+92)</span>
            </a>
            <div className="pt-2 text-xs text-slate-400">
              <span>Languages: English & Urdu</span>
            </div>
          </div>
        </div>

        {/* Global Patient Reach Banner */}
        <div className="mt-8 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="font-medium">
              {language === 'ur'
                ? 'آن لائن ہومیوپیتھک مشاورت: پاکستان بھر کے تمام شہروں اور دنیا بھر میں مقیم بین الاقوامی مریضوں کے لیے'
                : 'Online Homeopathic Consultations: Serving National Patients across Pakistan & International Patients Worldwide'}
            </span>
          </div>
          <span className="text-[11px] text-amber-300 font-mono">
            4:00 PM – 9:00 PM PKT
          </span>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Dr. Nazia Tabassum (D.H.M.S, R.H.M.P). All rights reserved.</p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => { setCurrentTab('privacy'); window.scrollTo(0, 0); }}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => { setCurrentTab('terms'); window.scrollTo(0, 0); }}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => { setCurrentTab('refund'); window.scrollTo(0, 0); }}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Cancellation & Refund Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
