import React, { useState } from 'react';
import {
  User,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Search,
  Printer,
  MessageCircle,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Sparkles,
} from 'lucide-react';
import { BotanicalBranch, GoldStripeDivider } from '../components/BotanicalAccents';
import { Appointment, Language } from '../types/clinic';
import { translations } from '../utils/translations';

interface BookingPageProps {
  language: Language;
}

export const BookingPage: React.FC<BookingPageProps> = ({ language }) => {
  const t = translations[language];

  // Active view: 'new_booking' | 'track_booking'
  const [activeTab, setActiveTab] = useState<'new_booking' | 'track_booking'>('new_booking');

  // Form State (Schedule/slot selection removed)
  const [patientName, setPatientName] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [healthConcern, setHealthConcern] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>('');
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  // Track Booking State
  const [searchReference, setSearchReference] = useState<string>('');
  const [trackedAppointment, setTrackedAppointment] = useState<Appointment | null>(null);
  const [trackLoading, setTrackLoading] = useState<boolean>(false);
  const [trackError, setTrackError] = useState<string>('');

  // Handle Form Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');

    // Client-side validations
    if (!patientName.trim()) {
      setBookingError('Please enter the patient full name.');
      return;
    }
    if (!whatsappNumber.trim()) {
      setBookingError('Please enter a WhatsApp or mobile number.');
      return;
    }
    if (!age || parseInt(age, 10) < 1 || parseInt(age, 10) > 120) {
      setBookingError('Please enter a valid age between 1 and 120.');
      return;
    }
    if (!healthConcern.trim() || healthConcern.trim().length < 5) {
      setBookingError('Please briefly describe your primary health concerns (minimum 5 characters).');
      return;
    }

    setFormSubmitting(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: patientName.trim(),
          whatsappNumber: whatsappNumber.trim(),
          age: parseInt(age, 10),
          healthConcern: healthConcern.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setBookedAppointment(data.appointment);
      } else {
        setBookingError(data.error || 'Failed to submit booking. Please try again.');
      }
    } catch (err: any) {
      setBookingError('Server error while saving appointment. Please check your connection and try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Reset form for a new booking
  const handleResetBooking = () => {
    setBookedAppointment(null);
    setPatientName('');
    setWhatsappNumber('');
    setAge('');
    setHealthConcern('');
    setNotes('');
    setBookingError('');
  };

  // Handle Track Lookup
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchReference.trim()) {
      setTrackError('Please enter your appointment reference (e.g. APT-2026-XXXXX).');
      return;
    }

    setTrackLoading(true);
    setTrackError('');
    setTrackedAppointment(null);

    try {
      const res = await fetch(`/api/appointments/${encodeURIComponent(searchReference.trim())}`);
      const data = await res.json();
      if (res.ok && data.appointment) {
        setTrackedAppointment(data.appointment);
      } else {
        setTrackError(data.error || 'No appointment found with this reference number.');
      }
    } catch (err) {
      setTrackError('Connection error. Could not retrieve appointment status.');
    } finally {
      setTrackLoading(false);
    }
  };

  const copyAppointmentRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title & Tabs */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <BotanicalBranch className="w-4 h-4 text-emerald-700" />
          <span>Online Consultation · National & International Patients</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          {language === 'ur' ? 'آن لائن ہومیوپیتھک کنسلٹیشن بک کریں' : 'Book Online Homeopathic Consultation'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          {language === 'ur'
            ? 'پاکستان اور بیرونِ ملک مقیم تمام مریضوں کے لیے آن لائن مشاورت۔ اپنی بنیادی معلومات درج کر کے باآسانی بکنگ کریں۔'
            : 'Personalized online consultations with Dr. Nazia Tabassum for patients across Pakistan and overseas worldwide via WhatsApp.'}
        </p>
        <GoldStripeDivider />

        {/* Segmented Control */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('new_booking')}
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'new_booking'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'ur' ? 'نئی اپائنٹمنٹ' : 'New Appointment'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track_booking')}
            className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'track_booking'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'ur' ? 'بکنگ چیک کریں' : 'Track Existing Booking'}
          </button>
        </div>
      </div>

      {/* TAB 1: NEW BOOKING */}
      {activeTab === 'new_booking' && (
        <>
          {/* SUCCESS SCREEN: Confirmed Directly */}
          {bookedAppointment ? (
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-lg p-6 sm:p-10 space-y-8 animate-in fade-in max-w-3xl mx-auto">
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {language === 'ur' ? 'اپائنٹمنٹ تصدیق شدہ' : 'Appointment Confirmed'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                  {language === 'ur' ? 'آپ کی اپائنٹمنٹ کامیابی سے بک ہو گئی ہے' : 'Your Consultation is Successfully Booked!'}
                </h2>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                  {language === 'ur'
                    ? 'ڈاکٹر نازیہ تبسم آپ کے واٹس ایپ نمبر پر رابطہ فرمائیں گی۔ براہ کرم اپنا بکنگ ریفرنس محفوظ رکھیں۔'
                    : 'Dr. Nazia Tabassum will connect with you directly via WhatsApp video/audio call. Please keep your booking reference saved.'}
                </p>
              </div>

              {/* Reference & Details Summary Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50/30 rounded-2xl p-6 border border-emerald-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-200/80">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">
                      Booking Reference Number
                    </span>
                    <span className="text-2xl font-mono font-bold text-emerald-950 select-all">
                      {bookedAppointment.reference}
                    </span>
                  </div>
                  <button
                    onClick={() => copyAppointmentRef(bookedAppointment.reference)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white hover:bg-emerald-50 text-emerald-900 border border-slate-300 rounded-xl transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
                  >
                    {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{copiedRef ? 'Copied to Clipboard!' : 'Copy Reference'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-400 block font-medium">Patient Full Name</span>
                    <span className="font-bold text-slate-900 text-sm">{bookedAppointment.patientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Age</span>
                    <span className="font-bold text-slate-900 text-sm">{bookedAppointment.age} Years</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">WhatsApp / Mobile Number</span>
                    <span className="font-bold text-slate-900 text-sm">{bookedAppointment.whatsappNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Consultation Status</span>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900">
                      {bookedAppointment.status}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block font-medium">Consultation Platform</span>
                    <span className="font-semibold text-slate-800">
                      WhatsApp Video / Audio Call with Dr. Nazia Tabassum (03112932192)
                    </span>
                  </div>
                  {bookedAppointment.healthConcern && (
                    <div className="sm:col-span-2 bg-white/80 p-3 rounded-xl border border-emerald-100">
                      <span className="text-slate-400 block font-medium mb-0.5">Recorded Health Concern:</span>
                      <p className="text-slate-700 italic">{bookedAppointment.healthConcern}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/923112932192?text=${encodeURIComponent(
                    `Assalam-o-Alaikum Dr. Nazia Tabassum. I have booked an online consultation. Reference: ${bookedAppointment.reference}. Patient: ${bookedAppointment.patientName} (Age: ${bookedAppointment.age}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-center"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Send Confirmation to Dr. Nazia on WhatsApp (03112932192)</span>
                </a>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>Print Booking Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetBooking}
                    className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Book Another Consultation</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* BOOKING FORM */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden max-w-3xl mx-auto">
              
              {/* Notice Bar */}
              <div className="bg-emerald-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Consultation Timings: <strong>4:00 PM – 9:00 PM (PKT)</strong> · Monday to Saturday</span>
                </div>
                <div className="text-amber-300 font-medium">
                  Karachi · National & Worldwide Patients
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="p-6 sm:p-10 space-y-8">
                
                {bookingError && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* 1. Patient Details */}
                <div className="space-y-4">
                  <h3 className="text-base font-serif font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'ur' ? '۱. مریض کی بنیادی معلومات' : '1. Patient Information'}</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Patient Name */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Fatima Zahra"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                        required
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Age (Years) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 28"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                        required
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Mobile / WhatsApp Number (National or International) *
                      </label>
                      <input
                        type="tel"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="e.g. 03112932192 (Pakistan) or +971... / +44... (International)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                        required
                      />
                      <span className="text-[11px] text-slate-500 block mt-1">
                        National patients enter regular mobile/WhatsApp number (e.g. 03112932192). International patients please include country code with '+' (e.g. +97150..., +447..., +1...). Dr. Nazia will connect via this number.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Medical Concerns & Notes */}
                <div className="space-y-4">
                  <h3 className="text-base font-serif font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'ur' ? '۲. صحت کا مسئلہ اور علامات' : '2. Health Concern Description'}</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Brief Description of Health Concern *
                    </label>
                    <textarea
                      rows={3}
                      value={healthConcern}
                      onChange={(e) => setHealthConcern(e.target.value)}
                      placeholder="Describe your primary symptoms, duration, triggers, or what you would like to address during the consultation..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Optional Additional Notes (Previous medications, allergies, etc.)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any other details Dr. Nazia should be aware of prior to your session..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                    ></textarea>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={formSubmitting || !patientName.trim() || !whatsappNumber.trim() || !age || !healthConcern.trim()}
                  className={`w-full py-4 px-6 text-sm font-semibold text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    formSubmitting || !patientName.trim() || !whatsappNumber.trim() || !age || !healthConcern.trim()
                      ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                      : 'bg-emerald-800 hover:bg-emerald-900 active:scale-98'
                  }`}
                >
                  {formSubmitting ? (
                    <span>Submitting Consultation Request...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                      <span>{language === 'ur' ? 'اپائنٹمنٹ بک کریں' : 'Confirm & Book Consultation'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

            </div>
          )}
        </>
      )}

      {/* TAB 2: TRACK EXISTING BOOKING */}
      {activeTab === 'track_booking' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 max-w-3xl mx-auto">
          <div className="max-w-xl mx-auto space-y-4 text-center">
            <h3 className="text-xl font-serif font-bold text-slate-900">
              {language === 'ur' ? 'اپنی اپائنٹمنٹ چیک کریں' : 'Look Up Your Appointment'}
            </h3>
            <p className="text-xs text-slate-600">
              Enter the unique appointment reference you received when booking (e.g., <code>APT-2026-1042</code>) to check your status, view doctor notes, or print your booking pass.
            </p>

            <form onSubmit={handleTrackSubmit} className="flex gap-2 pt-2">
              <input
                type="text"
                value={searchReference}
                onChange={(e) => setSearchReference(e.target.value)}
                placeholder="Enter Reference (APT-2026-XXXX)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
              <button
                type="submit"
                disabled={trackLoading}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>

            {trackError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg text-left">
                {trackError}
              </div>
            )}
          </div>

          {/* Tracked Appointment Result */}
          {trackedAppointment && (
            <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider block font-medium">Appointment Reference</span>
                  <span className="text-lg font-mono font-bold text-slate-900">{trackedAppointment.reference}</span>
                </div>
                <div>
                  <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {trackedAppointment.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 block">Patient Name</span>
                  <span className="font-semibold text-slate-900 text-sm">{trackedAppointment.patientName} (Age: {trackedAppointment.age})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">WhatsApp Number</span>
                  <span className="font-semibold text-slate-900 text-sm">{trackedAppointment.whatsappNumber}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Consultation Platform</span>
                  <span className="font-semibold text-emerald-900 text-sm">WhatsApp Video / Audio Call with Dr. Nazia Tabassum</span>
                </div>
                {trackedAppointment.healthConcern && (
                  <div className="col-span-2 bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium mb-0.5">Recorded Concern:</span>
                    <p className="text-slate-700">{trackedAppointment.healthConcern}</p>
                  </div>
                )}
              </div>

              {trackedAppointment.doctorNotes && (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong className="text-slate-900 block mb-0.5">Doctor Notes / Instructions:</strong>
                  <p>{trackedAppointment.doctorNotes}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Booking Pass</span>
                </button>

                <a
                  href={`https://wa.me/923112932192?text=${encodeURIComponent(
                    `Assalam-o-Alaikum Dr. Nazia Tabassum. My appointment reference is ${trackedAppointment.reference}. Patient: ${trackedAppointment.patientName}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp (03112932192)</span>
                </a>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
