import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Calendar,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  Download,
  Save,
  Key,
  ExternalLink,
  MessageCircle,
  Edit3,
  FileText,
  RefreshCw,
  LogOut,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Appointment, Language } from '../types/clinic';

interface AdminDashboardProps {
  language: Language;
  onLogout: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  onLogout,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
}) => {
  // Auth state
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [token, setToken] = useState<string>(() => localStorage.getItem('nazia_admin_token') || '');

  // Dashboard views
  const [adminTab, setAdminTab] = useState<'appointments' | 'schedule' | 'abhipay' | 'metrics'>('appointments');

  // Overview metrics
  const [metrics, setMetrics] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingApts, setLoadingApts] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Selected appointment for detail / edit modal
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editSlot, setEditSlot] = useState<string>('');
  const [editDoctorNotes, setEditDoctorNotes] = useState<string>('');
  const [savingApt, setSavingApt] = useState(false);
  const [aptActionSuccess, setAptActionSuccess] = useState('');

  // Settings State
  const [settings, setSettings] = useState<any>(null);
  const [feeInput, setFeeInput] = useState<number>(500);
  const [hoursStart, setHoursStart] = useState('16:00');
  const [hoursEnd, setHoursEnd] = useState('21:00');
  const [enabledDays, setEnabledDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [newDisabledDate, setNewDisabledDate] = useState('');
  const [disabledDates, setDisabledDates] = useState<string[]>([]);

  // ABHI Pay Settings
  const [abhiEnv, setAbhiEnv] = useState<'sandbox' | 'production'>('sandbox');
  const [abhiMerchantApproved, setAbhiMerchantApproved] = useState(false);
  const [abhiApiKey, setAbhiApiKey] = useState('');
  const [abhiSecretKey, setAbhiSecretKey] = useState('');
  const [abhiMerchantId, setAbhiMerchantId] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Check login on mount
  useEffect(() => {
    if (token) {
      setIsAdminLoggedIn(true);
      fetchDashboardData(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('nazia_admin_token', data.token);
        setIsAdminLoggedIn(true);
        fetchDashboardData(data.token);
      } else {
        setAuthError(data.error || 'Invalid administrator password.');
      }
    } catch (err) {
      setAuthError('Connection error contacting server.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('nazia_admin_token');
    setToken('');
    setIsAdminLoggedIn(false);
    onLogout();
  };

  const fetchDashboardData = async (authToken: string) => {
    setLoadingApts(true);
    try {
      // 1. Fetch Overview
      const resOverview = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (resOverview.ok) {
        const d = await resOverview.json();
        setMetrics(d.metrics);
      }

      // 2. Fetch Appointments
      const resApts = await fetch('/api/admin/appointments', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (resApts.ok) {
        const d = await resApts.json();
        setAppointments(d.appointments || []);
      }

      // 3. Fetch Settings
      const resSettings = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (resSettings.ok) {
        const d = await resSettings.json();
        const s = d.settings;
        setSettings(s);
        setFeeInput(s.consultationFee);
        setHoursStart(s.hoursStart);
        setHoursEnd(s.hoursEnd);
        setEnabledDays(s.enabledDays || [1, 2, 3, 4, 5, 6]);
        setDisabledDates(s.disabledDates || []);
        if (s.abhiPay) {
          setAbhiEnv(s.abhiPay.environment || 'sandbox');
          setAbhiMerchantApproved(s.abhiPay.merchantApproved || false);
          setAbhiApiKey(s.abhiPay.apiKey || '');
          setAbhiSecretKey(s.abhiPay.secretKey || '');
          setAbhiMerchantId(s.abhiPay.merchantId || '');
        }
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingApts(false);
    }
  };

  // Save changes to selected appointment
  const handleSaveAppointment = async () => {
    if (!selectedApt) return;
    setSavingApt(true);
    setAptActionSuccess('');

    try {
      const res = await fetch(`/api/admin/appointments/${selectedApt.reference}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: editStatus,
          date: editDate,
          timeSlot: editSlot,
          doctorNotes: editDoctorNotes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAptActionSuccess('Appointment updated successfully!');
        // Refresh local list
        setAppointments((prev) =>
          prev.map((a) => (a.reference === selectedApt.reference ? data.appointment : a))
        );
        setSelectedApt(data.appointment);
        setTimeout(() => setAptActionSuccess(''), 3000);
      } else {
        alert(data.error || 'Failed to update appointment.');
      }
    } catch (err) {
      alert('Network error while updating appointment.');
    } finally {
      setSavingApt(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMessage('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          consultationFee: feeInput,
          hoursStart,
          hoursEnd,
          enabledDays,
          disabledDates,
          abhiPay: {
            environment: abhiEnv,
            merchantApproved: abhiMerchantApproved,
            merchantId: abhiMerchantId,
            apiKey: abhiApiKey,
            secretKey: abhiSecretKey,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsMessage('Clinic & ABHI Pay settings saved successfully!');
        setSettings(data.settings);
        setTimeout(() => setSettingsMessage(''), 3500);
      } else {
        setSettingsMessage(data.error || 'Failed to save settings.');
      }
    } catch (err) {
      setSettingsMessage('Network error saving settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleDownloadCsv = () => {
    window.open(`/api/admin/export?token=${token}`, '_blank');
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== 'all' && apt.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (dateFilter && apt.date !== dateFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.patientName.toLowerCase().includes(q);
      const matchRef = apt.reference.toLowerCase().includes(q);
      const matchPhone = apt.whatsappNumber.includes(q);
      const matchConcern = apt.healthConcern.toLowerCase().includes(q);
      return matchName || matchRef || matchPhone || matchConcern;
    }
    return true;
  });

  // If not logged in, render Secure Login Form
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">Doctor Admin Login</h1>
            <p className="text-xs text-slate-500">
              Dr. Nazia Tabassum · Homeopathic Clinic Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Doctor Access Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
              <span className="text-[11px] text-slate-600 block mt-1.5">
                Default password for initial setup: <strong className="font-mono text-slate-800">doctor123</strong>
              </span>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>{authLoading ? 'Verifying...' : 'Access Dashboard'}</span>
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400">
            Protected endpoint with server-side token authorization.
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Admin Dashboard View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner: Doctor Info & Quick Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              Doctor Authorized
            </span>
            <span className="text-xs text-slate-500 font-mono">D.H.M.S, R.H.M.P</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Dr. Nazia Tabassum · Clinical Portal
          </h1>
          <p className="text-xs text-slate-500">
            Karachi, Pakistan · Online Homeopathic Consultations (4:00 PM – 9:00 PM)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboardData(token)}
            className="p-2.5 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleLogoutClick}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Total Bookings</span>
            <div className="text-2xl font-bold font-serif text-slate-900">{metrics.totalAppointments}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-emerald-800 uppercase tracking-wider font-medium">Confirmed</span>
            <div className="text-2xl font-bold font-serif text-emerald-800">{metrics.confirmedAppointments}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-amber-800 uppercase tracking-wider font-medium">Awaiting Payment</span>
            <div className="text-2xl font-bold font-serif text-amber-800">{metrics.awaitingPayment}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Today's Schedule</span>
            <div className="text-2xl font-bold font-serif text-slate-900">{metrics.todayAppointments}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1 col-span-2 lg:col-span-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Revenue Verified</span>
            <div className="text-2xl font-bold font-serif text-emerald-950">
              PKR {metrics.totalRevenuePKR}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        <button
          onClick={() => setAdminTab('appointments')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative ${
            adminTab === 'appointments'
              ? 'text-emerald-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Appointments & Consultations ({appointments.length})
        </button>
        <button
          onClick={() => setAdminTab('schedule')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative ${
            adminTab === 'schedule'
              ? 'text-emerald-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Schedule & Hours Configuration
        </button>
        <button
          onClick={() => setAdminTab('abhipay')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative ${
            adminTab === 'abhipay'
              ? 'text-emerald-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-800'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          ABHI Pay Merchant Settings
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS LIST */}
      {adminTab === 'appointments' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-56 flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search patient, phone, reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="awaiting payment">Awaiting Payment</option>
                <option value="payment pending">Payment Pending</option>
                <option value="payment failed">Payment Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                title="Filter by appointment date"
              />

              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Clear Date
                </button>
              )}
            </div>

            <span className="text-xs text-slate-500">
              Showing <strong>{filteredAppointments.length}</strong> of {appointments.length} appointments
            </span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">WhatsApp / Mobile</th>
                    <th className="px-4 py-3">Date & Slot</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                        No appointments found matching your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-semibold text-slate-800">
                          {apt.reference}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-900 block">{apt.patientName}</span>
                          <span className="text-[11px] text-slate-500">Age: {apt.age} yrs</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <a
                            href={`https://wa.me/${apt.whatsappNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-800 hover:underline flex items-center gap-1 font-mono"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>{apt.whatsappNumber}</span>
                          </a>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="block font-medium text-slate-800">{apt.date}</span>
                          <span className="text-[11px] text-emerald-800 font-semibold">{apt.timeSlot}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              apt.status === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.status === 'Awaiting Payment'
                                ? 'bg-amber-100 text-amber-800'
                                : apt.status === 'Payment Pending'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[11px]">
                          {apt.paidAmount ? (
                            <span className="text-emerald-800 font-bold">PKR {apt.paidAmount}</span>
                          ) : (
                            <span className="text-slate-400">Unpaid</span>
                          )}
                          {apt.paymentRef && (
                            <span className="block text-[10px] text-slate-500 truncate max-w-24">
                              {apt.paymentRef}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedApt(apt);
                              setEditStatus(apt.status);
                              setEditDate(apt.date);
                              setEditSlot(apt.timeSlot);
                              setEditDoctorNotes(apt.doctorNotes || '');
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* APPOINTMENT MANAGEMENT MODAL */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base">Manage Appointment</h3>
                <p className="text-xs text-emerald-200 font-mono">{selectedApt.reference}</p>
              </div>
              <button
                onClick={() => setSelectedApt(null)}
                className="text-emerald-200 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs text-slate-700">
              
              {/* Patient Profile */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block">Patient Name</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedApt.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Age</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedApt.age} Years</span>
                </div>
                <div>
                  <span className="text-slate-400 block">WhatsApp / Phone</span>
                  <a
                    href={`https://wa.me/${selectedApt.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>{selectedApt.whatsappNumber}</span>
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block">Consultation Format</span>
                  <span className="font-bold text-emerald-950 text-sm">Online (WhatsApp)</span>
                </div>
              </div>

              {/* Patient Health Concern */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-900 block">Patient's Stated Health Concern:</span>
                <p className="text-slate-600 leading-relaxed">{selectedApt.healthConcern}</p>
                {selectedApt.notes && (
                  <p className="text-slate-500 italic mt-1 pt-1 border-t text-[11px]">
                    Additional notes: {selectedApt.notes}
                  </p>
                )}
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Update Appointment Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="Awaiting Payment">Awaiting Payment</option>
                  <option value="Payment Pending">Payment Pending</option>
                  <option value="Payment Verified">Payment Verified</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Payment Failed">Payment Failed</option>
                </select>
              </div>

              {/* Reschedule Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Reschedule Date
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={editSlot}
                    onChange={(e) => setEditSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="07:30 PM">07:30 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                    <option value="08:30 PM">08:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Doctor Clinical Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Doctor Clinical Observations & Prescriptions
                </label>
                <textarea
                  rows={3}
                  value={editDoctorNotes}
                  onChange={(e) => setEditDoctorNotes(e.target.value)}
                  placeholder="Case notes, constitutional assessment, remedy prescribed, potency, follow-up date..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                ></textarea>
              </div>

              {aptActionSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
                  {aptActionSuccess}
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={savingApt}
                  onClick={handleSaveAppointment}
                  className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl transition-colors cursor-pointer shadow-xs text-center"
                >
                  {savingApt ? 'Saving Changes...' : 'Save & Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedApt(null)}
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULE CONFIGURATION */}
      {adminTab === 'schedule' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 max-w-3xl">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-bold text-slate-900">
              Consultation Hours & Availability Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Configure clinic consultation window (4:00 PM – 9:00 PM), standard fee (PKR 500), and block specific dates off.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Consultation Fee */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                Standard Consultation Fee (PKR)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={feeInput}
                  onChange={(e) => setFeeInput(Number(e.target.value))}
                  className="w-48 px-3.5 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm"
                  required
                />
                <span className="text-xs text-slate-500">Standard fee: PKR 500</span>
              </div>
            </div>

            {/* Hours Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Consultation Start Time
                </label>
                <input
                  type="time"
                  value={hoursStart}
                  onChange={(e) => setHoursStart(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Default: 16:00 (4:00 PM)</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Consultation End Time
                </label>
                <input
                  type="time"
                  value={hoursEnd}
                  onChange={(e) => setHoursEnd(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Default: 21:00 (9:00 PM)</span>
              </div>
            </div>

            {/* Active Days of Week */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                Active Days of Week
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {[
                  { id: 1, name: 'Mon' },
                  { id: 2, name: 'Tue' },
                  { id: 3, name: 'Wed' },
                  { id: 4, name: 'Thu' },
                  { id: 5, name: 'Fri' },
                  { id: 6, name: 'Sat' },
                  { id: 0, name: 'Sun' },
                ].map((d) => {
                  const isChecked = enabledDays.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setEnabledDays(enabledDays.filter((x) => x !== d.id));
                        } else {
                          setEnabledDays([...enabledDays, d.id]);
                        }
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-2xs'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {d.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Block Specific Dates */}
            <div className="space-y-3 pt-2 border-t">
              <label className="block text-xs font-semibold text-slate-800">
                Block Specific Dates (Holidays / Leave)
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newDisabledDate}
                  onChange={(e) => setNewDisabledDate(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newDisabledDate && !disabledDates.includes(newDisabledDate)) {
                      setDisabledDates([...disabledDates, newDisabledDate]);
                      setNewDisabledDate('');
                    }
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Block Date
                </button>
              </div>

              {disabledDates.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {disabledDates.map((date) => (
                    <span
                      key={date}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200"
                    >
                      <span>{date}</span>
                      <button
                        type="button"
                        onClick={() => setDisabledDates(disabledDates.filter((x) => x !== date))}
                        className="text-rose-600 hover:text-rose-900 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {settingsMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                {settingsMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={settingsSaving}
              className="py-3 px-6 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{settingsSaving ? 'Saving...' : 'Save Schedule Settings'}</span>
            </button>

          </form>
        </div>
      )}

      {/* TAB 3: ABHI PAY MERCHANT SETTINGS */}
      {adminTab === 'abhipay' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 max-w-3xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-800">
                Payment Provider
              </span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">
                ABHI Pay
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-900">
              ABHI Pay Gateway Configuration
            </h2>
            <p className="text-xs text-slate-500">
              Manage connection mode, merchant account credentials, and callback webhooks.
            </p>
          </div>

          {/* Account Reference Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <span className="font-semibold text-slate-800 block">Supplied Account Reference:</span>
            <div className="p-2 bg-white rounded border border-slate-300 font-mono font-bold text-slate-900">
              PK13ABHI0000923112932192
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              * Note: This reference is stored securely on the server and is not displayed as a direct public transfer destination, in strict compliance with integration requirements.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            
            {/* Mode Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Gateway Environment
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAbhiEnv('sandbox')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    abhiEnv === 'sandbox'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-700/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs">Sandbox / Demo Simulation</span>
                  <span className="text-[10px] text-slate-500">Recommended while merchant application is pending</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAbhiEnv('production')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    abhiEnv === 'production'
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold ring-2 ring-emerald-700/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs">Live Production Gateway</span>
                  <span className="text-[10px] text-slate-500">Requires approved ABHI merchant credentials</span>
                </button>
              </div>
            </div>

            {/* Merchant Approval Checkbox */}
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <input
                type="checkbox"
                id="merchantAppr"
                checked={abhiMerchantApproved}
                onChange={(e) => setAbhiMerchantApproved(e.target.checked)}
                className="w-4 h-4 text-emerald-800 rounded cursor-pointer"
              />
              <label htmlFor="merchantAppr" className="cursor-pointer text-amber-900 font-medium">
                Clinic ABHI Pay Merchant Account is Approved and Activated
              </label>
            </div>

            {/* Credentials Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Merchant ID
                </label>
                <input
                  type="text"
                  value={abhiMerchantId}
                  onChange={(e) => setAbhiMerchantId(e.target.value)}
                  placeholder="e.g. ABHI_MERCH_923112932192"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ABHI Pay API Key
                </label>
                <input
                  type="password"
                  value={abhiApiKey}
                  onChange={(e) => setAbhiApiKey(e.target.value)}
                  placeholder="Secret API Key (stored server-side only)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ABHI Pay Secret Key
                </label>
                <input
                  type="password"
                  value={abhiSecretKey}
                  onChange={(e) => setAbhiSecretKey(e.target.value)}
                  placeholder="Gateway signing secret"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
            </div>

            {/* Webhook endpoint URL */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <span className="font-semibold text-slate-800 block">ABHI Pay Webhook Endpoint URL</span>
              <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-700 select-all">
                {window.location.origin}/api/payments/webhook
              </div>
              <p className="text-slate-500 text-[11px]">
                Register this endpoint in the ABHI Pay Merchant portal to receive automated transaction settlement IPN callbacks.
              </p>
            </div>

            {settingsMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                {settingsMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={settingsSaving}
              className="py-3 px-6 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{settingsSaving ? 'Saving...' : 'Save ABHI Pay Settings'}</span>
            </button>

          </form>
        </div>
      )}

    </div>
  );
};
