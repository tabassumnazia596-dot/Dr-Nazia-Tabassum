import React, { useState } from 'react';
import {
  MessageCircle,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { BotanicalBranch, GoldStripeDivider } from '../components/BotanicalAccents';
import { Language } from '../types/clinic';
import { translations } from '../utils/translations';

interface ContactPageProps {
  language: Language;
}

export const ContactPage: React.FC<ContactPageProps> = ({ language }) => {
  const t = translations[language];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/923112932192?text=${encodeURIComponent(t.whatsappMessage)}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <BotanicalBranch className="w-4 h-4 text-emerald-700" />
          <span>Direct Clinic Communication</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Contact Dr. Nazia Tabassum
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          We are here to assist you with appointment bookings, consultation inquiries, and session coordination.
        </p>
        <GoldStripeDivider />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Information Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Primary WhatsApp Card */}
          <div className="bg-emerald-900 text-white rounded-3xl p-7 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <MessageCircle className="w-4 h-4" />
              <span>Direct Clinic WhatsApp</span>
            </div>
            <h2 className="text-xl font-serif font-bold">
              Chat Directly with Dr. Nazia
            </h2>
            <p className="text-xs text-emerald-100 leading-relaxed">
              For fastest response regarding appointments, rescheduling, or case follow-ups, connect via WhatsApp.
            </p>
            <div className="pt-2">
              <span className="text-2xl font-mono font-bold tracking-wider block text-white">
                03112932192
              </span>
              <span className="text-xs text-emerald-200">International: +92 311 2932192</span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold rounded-xl transition-all shadow-md mt-2"
            >
              <MessageCircle className="w-4 h-4 fill-current mr-1.5" />
              <span>Open WhatsApp Chat</span>
            </a>
          </div>

          {/* Practice Details Card */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xs space-y-4 text-xs text-slate-700">
            <h3 className="font-serif font-bold text-slate-900 text-base">
              Clinic Consultation Logistics
            </h3>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Consultation Hours:</strong>
                <span>4:00 PM to 9:00 PM (PKT) · Monday to Saturday</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Location:</strong>
                <span>Karachi, Pakistan (Online Consultations Only)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Consultation Fee:</strong>
                <span>PKR 500 per appointment via ABHI Pay</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Languages: English & Urdu
            </div>
          </div>

        </div>

        {/* Right Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs">
          <h2 className="text-xl font-serif font-bold text-slate-900 mb-1">
            Send an Inquiry
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Leave your contact details and questions. We will reply during regular consultation hours (4:00 PM – 9:00 PM).
          </p>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900">
                Inquiry Received
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you, {name}. Dr. Nazia Tabassum will review your message and reply via WhatsApp or phone.
              </p>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setName(''); setPhone(''); setMessage(''); }}
                className="text-xs text-emerald-800 font-semibold hover:underline cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Message / Inquiry *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you regarding your online homeopathic consultation?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 bg-emerald-800 hover:bg-emerald-900 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
