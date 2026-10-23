import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Language } from '../types/clinic';
import { translations } from '../utils/translations';

interface FloatingWhatsAppProps {
  language: Language;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ language }) => {
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false);
  const t = translations[language];

  // International format for Pakistan: replace leading 0 with +92 (or 92 for wa.me link)
  const phoneNumber = '923112932192';
  const encodedMessage = encodeURIComponent(t.whatsappMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <aside
      aria-label="WhatsApp Consultation Assistant"
      className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 group"
    >
      {/* Discreet helper tooltip */}
      {!isTooltipDismissed && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-slate-800 text-xs px-3.5 py-2 rounded-xl shadow-lg border border-emerald-100 max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <p className="leading-snug">
            {language === 'ur'
              ? 'ڈاکٹر نازیہ تبسم سے واٹس ایپ پر براہ راست بات کریں (4 سے 9 بجے)'
              : 'Chat with Dr. Nazia on WhatsApp (4 PM – 9 PM)'}
          </p>
          <button
            onClick={() => setIsTooltipDismissed(true)}
            className="text-slate-400 hover:text-slate-600 p-0.5 ml-1 cursor-pointer"
            aria-label="Dismiss helper tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Dr. Nazia Tabassum on WhatsApp"
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-hidden focus:ring-3 focus:ring-[#25D366]/40 cursor-pointer"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white shrink-0" />
        <span className="hidden md:inline-block font-medium text-sm tracking-wide">
          {language === 'ur' ? 'واٹس ایپ پر رابطہ' : 'WhatsApp'}
        </span>
      </a>
    </aside>
  );
};
