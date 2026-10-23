import React from 'react';
import { ShieldCheck, Heart, Clock, MapPin, Globe, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { BotanicalBranch, GoldStripeDivider } from '../components/BotanicalAccents';
import { Language } from '../types/clinic';
import { translations } from '../utils/translations';

interface AboutPageProps {
  setCurrentTab: (tab: string) => void;
  language: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentTab, language }) => {
  const t = translations[language];
  const doctorPhoto = '/assets/aistudio/7a327339-27d1-4cfd-a18b-b8bab46db18b_2_acd4a0a5.jpg';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <BotanicalBranch className="w-4 h-4 text-emerald-700" />
          <span>Professional Background & Clinical Approach</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          About Dr. Nazia Tabassum
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-sans">
          D.H.M.S, R.H.M.P · Practicing Online Homeopathic Medicine from Karachi, Pakistan.
        </p>
        <GoldStripeDivider />
      </div>

      {/* Main Grid: Portrait & Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Doctor Portrait */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-xl border border-emerald-900/10 bg-white p-2">
            <div className="aspect-4/5 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={doctorPhoto}
                alt="Dr. Nazia Tabassum - Homeopathic Physician"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 text-center space-y-1">
              <h2 className="font-serif font-bold text-lg text-slate-900">Dr. Nazia Tabassum</h2>
              <p className="text-xs text-emerald-800 font-semibold tracking-wide">
                D.H.M.S, R.H.M.P
              </p>
              <p className="text-xs text-slate-500">
                Online Consultations · National & International Patients
              </p>
            </div>
          </div>
        </div>

        {/* Biography & Principles */}
        <div className="lg:col-span-7 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-2">
              Holistic, Individualized Homeopathic Care
            </h2>
            <p>
              Dr. Nazia Tabassum is a qualified homeopathic practitioner holding the <strong>D.H.M.S</strong> (Diploma in Homeopathic Medical Science) and registered as an <strong>R.H.M.P</strong> (Registered Homeopathic Medical Practitioner). Based in <strong>Karachi, Pakistan</strong>, she conducts consultations exclusively online for both <strong>national</strong> and <strong>international</strong> patients.
            </p>
          </div>

          <p>
            Homeopathy is rooted in the philosophy that every individual possesses a vital force capable of self-restoration when supported with accurate, gentle, and highly specific natural remedies. Consultations are structured around comprehensive case taking—examining physical symptoms, personal constitution, mental state, and individual health history.
          </p>

          <p>
            By offering consultations exclusively online, Dr. Nazia Tabassum provides structured care to patients across all cities of Pakistan (including Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, Multan, Faisalabad) as well as overseas Pakistani diaspora and international clients worldwide (UAE, Saudi Arabia, Qatar, Oman, UK, USA, Canada, Europe, Australia) from the comfort and privacy of their home.
          </p>

          {/* Practice Principles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-1">
              <strong className="text-xs uppercase tracking-wider text-emerald-800 block">
                Standard Consultation Fee
              </strong>
              <span className="text-lg font-bold text-slate-900">PKR 500</span>
              <span className="text-xs text-slate-500 block">Per scheduled appointment</span>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-1">
              <strong className="text-xs uppercase tracking-wider text-emerald-800 block">
                Consultation Hours
              </strong>
              <span className="text-lg font-bold text-slate-900">4:00 PM – 9:00 PM</span>
              <span className="text-xs text-slate-500 block">Karachi Time (PKT)</span>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-1">
              <strong className="text-xs uppercase tracking-wider text-emerald-800 block">
                Official Channels
              </strong>
              <span className="text-sm font-semibold text-slate-900">WhatsApp & Audio/Video</span>
              <span className="text-xs text-slate-500 block">03112932192</span>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-1">
              <strong className="text-xs uppercase tracking-wider text-emerald-800 block">
                Bilingual Communication
              </strong>
              <span className="text-sm font-semibold text-slate-900">English & Urdu</span>
              <span className="text-xs text-slate-500 block">Clear and comfortable dialogue</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentTab('book')}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Book an Online Appointment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={`https://wa.me/923112932192?text=${encodeURIComponent(t.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Message on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
