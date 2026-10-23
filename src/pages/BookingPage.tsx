import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Search,
  CreditCard,
  Printer,
  Sparkles,
} from 'lucide-react';
import { BotanicalBranch, BotanicalLeafBadge, GoldStripeDivider } from '../components/BotanicalAccents';
import { AbhiPayModal } from '../components/AbhiPayModal';
import { Appointment, Language, SlotAvailability } from '../types/clinic';
import { translations } from '../utils/translations';

interface BookingPageProps {
  language: Language;
}

export const BookingPage: React.FC<BookingPageProps> = ({ language }) => {
  const t = translations[language];

  // Active view: 'new_booking' | 'track_booking'
  const [activeTab, setActiveTab] = useState<'new_booking' | 'track_booking'>('new_booking');

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [availableSlots, setAvailableSlots] = useState<SlotAvailability[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const [patientName, setPatientName] = useState<string>('');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [healthConcern, setHealthConcern] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>('');
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  // Modal State for ABHI Pay
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [activeCheckoutApt, setActiveCheckoutApt] = useState<Appointment | null>(null);

  // Track Booking State
  const [searchReference, setSearchReference] = useState<string>('');
  const [trackedAppointment, setTrackedAppointment] = useState<Appointment | null>(null);
  const [trackLoading, setTrackLoading] = useState<boolean>(false);
  const [trackError, setTrackError] = useState<string>('');

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    let isMounted = true;
    async function fetchSlots() {
      if (!selectedDate) return;
      setSlotsLoading(true);
      setSlotsError('');
      setSelectedSlot('');

      try {
        const res = await fetch(`/api/available-slots?date=${selectedDate}`);
        const data = await res.json();
        if (isMounted) {
          if (!data.available) {
            setSlotsError(data.reason || 'No consultation slots available on this date.');
            setAvailableSlots([]);
          } else {
            setAvailableSlots(data.slots || []);
          }
        }
      } catch (err) {
        if (isMounted) {
          setSlotsError('Could not connect to availability schedule. Please check connection.');
        }
      } finally {
        if (isMounted) setSlotsLoading(false);
      }
    }

    fetchSlots();
    return () => { isMounted = false; };
  }, [selectedDate]);

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
    if (!selectedSlot) {
      setBookingError('Please select an available consultation time slot between 4:00 PM and 9:00 PM.');
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
          patientName,
          whatsappNumber,
          age: parseInt(age, 10),
          date: selectedDate,
          timeSlot: selectedSlot,
          healthConcern,
          notes,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setBookedAppointment(data.appointment);
        setActiveCheckoutApt(data.appointment);
        setShowPaymentModal(true); // Open ABHI Pay directly
      } else {
        setBookingError(data.error || 'Failed to submit booking. Slot may have just been reserved.');
      }
    } catch (err: any) {
      setBookingError('Server error while saving appointment. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title & Tabs */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <BotanicalBranch className="w-4 h-4 text-emerald-700" />
          <span>Online Scheduling · National & International Patients</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Book Online Homeopathic Consultation
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Consultations available for patients across Pakistan and overseas worldwide. Sessions are held between <strong>4:00 PM and 9:00 PM (PKT)</strong>. Consultation fee is <strong>PKR 500</strong>, automatically verified via ABHI Pay.
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
            New Appointment
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
            Track Existing Booking
          </button>
        </div>
      </div>

      {/* TAB 1: NEW BOOKING */}
      {activeTab === 'new_booking' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Fee & Hours Notice Bar */}
          <div className="bg-emerald-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Available Hours: <strong>4:00 PM – 9:00 PM (PKT)</strong> · Monday to Saturday</span>
            </div>
            <div className="font-semibold text-amber-300">
              Consultation Fee: PKR 500
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} className="p-6 sm:p-10 space-y-8">
            
            {bookingError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* 1. Date & Time Selection */}
            <div className="space-y-4">
              <h3 className="text-base font-serif font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
                <span>1. Select Date & Time Slot</span>
                <span className="text-xs font-normal text-slate-500">4:00 PM – 9:00 PM</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Consultation Date *
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                    required
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Select today or any upcoming date
                  </span>
                </div>

                {/* Slots Grid */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-medium text-slate-700">
                    Available 30-Minute Time Slots *
                  </label>

                  {slotsLoading ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      Checking Dr. Nazia's live schedule...
                    </div>
                  ) : slotsError ? (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                      {slotsError}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.timeSlot}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlot(slot.timeSlot)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                            !slot.isAvailable
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : selectedSlot === slot.timeSlot
                              ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs font-semibold'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40'
                          }`}
                        >
                          {slot.timeSlot}
                          {!slot.isAvailable && <span className="block text-[10px] text-slate-400">Booked</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedSlot && (
                    <p className="text-xs text-emerald-800 font-medium pt-1">
                      Selected Slot: <strong>{selectedSlot}</strong> on {selectedDate}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* 2. Patient Details */}
            <div className="space-y-4">
              <h3 className="text-base font-serif font-bold text-slate-900 border-b pb-2">
                2. Patient Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Full Name */}
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
                    National patients enter regular mobile/WhatsApp (e.g. 03112932192). International patients please include country code with '+' (e.g. +97150..., +447..., +1...). Dr. Nazia will connect via this number.
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Medical Concerns & Notes */}
            <div className="space-y-4">
              <h3 className="text-base font-serif font-bold text-slate-900 border-b pb-2">
                3. Health Concern Description
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

            {/* 4. Payment & Policy Summary */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Online Consultation Fee:</span>
                <span className="font-bold text-emerald-900 text-base">PKR 500</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                By submitting this form, you will be taken to the <strong>ABHI Pay</strong> checkout to settle the PKR 500 consultation fee. Appointments are held in <em>Awaiting Payment</em> status and confirmed automatically upon backend verification.
              </p>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={formSubmitting || !selectedSlot}
              className={`w-full py-4 px-6 text-sm font-semibold text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                formSubmitting || !selectedSlot
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : 'bg-emerald-800 hover:bg-emerald-900 active:scale-98'
              }`}
            >
              {formSubmitting ? (
                <span>Reserving Time Slot...</span>
              ) : (
                <>
                  <span>Continue to ABHI Pay (PKR 500)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>
      )}

      {/* TAB 2: TRACK EXISTING BOOKING */}
      {activeTab === 'track_booking' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          <div className="max-w-xl mx-auto space-y-4 text-center">
            <h3 className="text-xl font-serif font-bold text-slate-900">
              Look Up Your Appointment
            </h3>
            <p className="text-xs text-slate-600">
              Enter the unique appointment reference you received when booking (e.g., <code>APT-2026-1042</code>) to check payment status, view doctor notes, or print receipt.
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
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    trackedAppointment.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : trackedAppointment.status === 'Awaiting Payment'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : trackedAppointment.status === 'Payment Pending'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
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
                <div>
                  <span className="text-slate-400 block">Date & Time Slot</span>
                  <span className="font-semibold text-slate-900 text-sm">{trackedAppointment.date} at {trackedAppointment.timeSlot}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Consultation Fee</span>
                  <span className="font-semibold text-emerald-800 text-sm">PKR 500</span>
                </div>
              </div>

              {trackedAppointment.doctorNotes && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <strong className="text-slate-900 block mb-0.5">Doctor Notes / Instructions:</strong>
                  <p>{trackedAppointment.doctorNotes}</p>
                </div>
              )}

              {/* Action buttons based on status */}
              <div className="pt-2 flex flex-wrap gap-2">
                {trackedAppointment.status !== 'Confirmed' && (
                  <button
                    onClick={() => {
                      setActiveCheckoutApt(trackedAppointment);
                      setShowPaymentModal(true);
                    }}
                    className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Consultation Fee via ABHI Pay</span>
                  </button>
                )}

                {trackedAppointment.status === 'Confirmed' && (
                  <button
                    onClick={() => window.print()}
                    className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Booking Pass</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/923112932192?text=${encodeURIComponent(
                    `Assalam-o-Alaikum Dr. Nazia Tabassum. My appointment reference is ${trackedAppointment.reference}. Please guide me regarding my upcoming consultation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ABHI Pay Modal Triggered on Submit or Payment Click */}
      {showPaymentModal && activeCheckoutApt && (
        <AbhiPayModal
          appointment={activeCheckoutApt}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={(confirmed) => {
            setBookedAppointment(confirmed);
            setTrackedAppointment(confirmed);
          }}
          language={language}
        />
      )}

    </div>
  );
};
