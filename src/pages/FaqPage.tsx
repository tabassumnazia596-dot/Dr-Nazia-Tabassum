import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { BotanicalBranch, GoldStripeDivider } from '../components/BotanicalAccents';
import { Language } from '../types/clinic';
import { translations } from '../utils/translations';

interface FaqPageProps {
  setCurrentTab: (tab: string) => void;
  language: Language;
}

export const FaqPage: React.FC<FaqPageProps> = ({ setCurrentTab, language }) => {
  const t = translations[language];

  const faqs = [
    {
      q: 'How does an online homeopathic consultation with Dr. Nazia Tabassum work?',
      a: 'Online consultation begins by submitting your consultation request on our website. Your appointment is confirmed instantly with a unique reference number. Dr. Nazia Tabassum connects with you directly via WhatsApp audio or video call for an in-depth homeopathic case analysis.',
    },
    {
      q: 'How do I book an appointment?',
      a: 'Simply go to the Book Appointment page, fill in your name, contact details, and basic health concerns, and submit to receive instant confirmation with your booking reference.',
    },
    {
      q: 'What are the clinic’s consultation hours?',
      a: 'Consultation hours are 4:00 PM to 9:00 PM (Pakistan Standard Time), Monday through Saturday, strictly by confirmed appointment.',
    },
    {
      q: 'How do I obtain the recommended homeopathic medicines?',
      a: 'Following your consultation, Dr. Nazia Tabassum sends you a clearly written homeopathic prescription indicating the exact remedy names, potencies, and dosage instructions. Homeopathic medicines can easily be obtained from any licensed homeopathic pharmacy in Karachi or your local area.',
    },
    {
      q: 'Can I reschedule my appointment if something comes up?',
      a: 'Yes. You can reschedule your appointment up to 2 hours prior to your scheduled time either through our website appointment tracking feature or by sending a message to our clinic WhatsApp (03112932192) with your appointment reference number.',
    },
    {
      q: 'Are homeopathic remedies safe for children and pregnant women?',
      a: 'Homeopathic remedies are prepared from natural sources and are exceptionally gentle, non-toxic, and free from conventional chemical side effects when prescribed by a qualified practitioner. Dr. Nazia Tabassum carefully selects remedies tailored specifically to each patient’s stage of life.',
    },
    {
      q: 'Can online homeopathic consultation handle emergency situations?',
      a: 'No. Online consultations are designed exclusively for chronic conditions, lifestyle ailments, and non-emergency health guidance. If you or a family member experience an acute medical emergency, severe breathing difficulty, sudden chest pain, or head trauma, please proceed immediately to the nearest hospital emergency room.',
    },
    {
      q: 'What if I am outside Pakistan or in another city?',
      a: 'Because our practice is exclusively online, you can consult with Dr. Nazia Tabassum from anywhere in Pakistan or abroad. Please ensure your time slot reflects Pakistan Standard Time (PKT, UTC+5).',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <BotanicalBranch className="w-4 h-4 text-emerald-700" />
          <span>Patient Guidance & Clarity</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Find answers to common questions regarding appointments, consultation flow, fees, and homeopathic treatment.
        </p>
        <GoldStripeDivider />
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden"
              >
                <span className="font-serif font-semibold text-slate-900 text-sm sm:text-base">
                  {faq.q}
                </span>
                <span className="p-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Need more help banner */}
      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 text-center space-y-3">
        <h3 className="font-serif font-bold text-slate-900 text-base">
          Have a specific query not covered here?
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Feel free to reach out to Dr. Nazia Tabassum directly via WhatsApp. Our clinic is happy to guide you.
        </p>
        <a
          href={`https://wa.me/923112932192?text=${encodeURIComponent(t.whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-medium text-xs rounded-xl shadow-xs transition-colors"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Chat on WhatsApp: 03112932192</span>
        </a>
      </div>

    </div>
  );
};
