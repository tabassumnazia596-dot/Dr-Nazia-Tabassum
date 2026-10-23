import React, { useState } from 'react';
import { Menu, X, Shield, Calendar, Globe } from 'lucide-react';
import { Language } from '../types/clinic';
import { translations } from '../utils/translations';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const navLinks = [
    { id: 'home', label: t.navHome },
    { id: 'about', label: t.navAbout },
    { id: 'consultation', label: t.navConsultation },
    { id: 'book', label: t.navBook },
    { id: 'payment', label: t.navPayment },
    { id: 'faqs', label: t.navFaqs },
    { id: 'contact', label: t.navContact },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group cursor-pointer focus:outline-hidden"
          >
            <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 block">
              Dr. Nazia Tabassum
            </span>
            <span className="text-xs font-sans text-emerald-800 tracking-wider uppercase block font-medium">
              Homeopathic Clinic · Karachi
            </span>
          </button>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors relative py-1 cursor-pointer ${
                  currentTab === link.id
                    ? 'text-emerald-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-700'
                    : 'hover:text-slate-950 text-slate-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action + Language Switcher + Admin Shortcut */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-800 bg-slate-50 hover:bg-emerald-50/60 rounded-md border border-slate-200 transition-colors cursor-pointer"
              title="Switch Language / زبان تبدیل کریں"
              aria-label="Toggle language between English and Urdu"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'en' ? 'اردو' : 'EN'}</span>
            </button>

            {/* Track Booking Button */}
            <button
              onClick={() => handleNavClick('track')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.navTrack}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('book')}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-98 rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              {language === 'ur' ? 'بکنگ (500 روپے)' : 'Book (PKR 500)'}
            </button>

            {/* Doctor Admin Portal Shortcut */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                currentTab === 'admin' || isAdminLoggedIn
                  ? 'border-emerald-600 text-emerald-800 bg-emerald-50'
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Doctor Portal"
              aria-label="Doctor admin portal"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === link.id
                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('track')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>{t.navTrack}</span>
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-slate-500" />
              <span>{t.navAdmin}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
