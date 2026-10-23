import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentInfoPage } from './pages/PaymentInfoPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Language } from './types/clinic';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('nazia_admin_token'));
  });

  // Apply Urdu RTL direction when language is 'ur'
  useEffect(() => {
    if (language === 'ur') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ur';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [language]);

  // Scroll to top on tab change
  const handleSetTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FAFCFA] text-slate-800 ${language === 'ur' ? 'lang-ur' : ''}`}>
      
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleSetTab}
        language={language}
        setLanguage={setLanguage}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage setCurrentTab={handleSetTab} language={language} />
        )}

        {currentTab === 'about' && (
          <AboutPage setCurrentTab={handleSetTab} language={language} />
        )}

        {currentTab === 'consultation' && (
          <ConsultationPage setCurrentTab={handleSetTab} language={language} />
        )}

        {currentTab === 'book' && (
          <BookingPage language={language} />
        )}

        {currentTab === 'track' && (
          <BookingPage language={language} />
        )}

        {currentTab === 'payment' && (
          <PaymentInfoPage setCurrentTab={handleSetTab} language={language} />
        )}

        {currentTab === 'faqs' && (
          <FaqPage setCurrentTab={handleSetTab} language={language} />
        )}

        {currentTab === 'contact' && (
          <ContactPage language={language} />
        )}

        {currentTab === 'privacy' && (
          <PoliciesPage initialSection="privacy" language={language} />
        )}

        {currentTab === 'terms' && (
          <PoliciesPage initialSection="terms" language={language} />
        )}

        {currentTab === 'refund' && (
          <PoliciesPage initialSection="refund" language={language} />
        )}

        {currentTab === 'global' && (
          <PoliciesPage initialSection="global" language={language} />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            language={language}
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setCurrentTab('home');
            }}
          />
        )}
      </main>

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp language={language} />

      {/* Global Footer */}
      <Footer setCurrentTab={handleSetTab} language={language} />

    </div>
  );
}
