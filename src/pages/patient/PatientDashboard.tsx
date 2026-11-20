import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  FileText, 
  Pill, 
  Video, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Activity, 
  AlertCircle,
  Plus,
  TrendingUp,
  MapPin,
  CheckSquare,
  Square,
  X,
  Navigation,
  Building2,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { DashboardSidebar } from '../../components/dashboard/DashboardSidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { StatCard } from '../../components/dashboard/StatCard';
import { AnatomicalModel } from '../../components/dashboard/AnatomicalModel';
import { VitalsWidget } from '../../components/dashboard/VitalsWidget';
import { PrescriptionsWidget } from '../../components/dashboard/PrescriptionsWidget';
import { Button } from '../../components/common/Button';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export const PatientDashboardPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const appointments = storageService.getAppointments();
  const records = storageService.getRecords();
  const prescriptions = storageService.getPrescriptions();

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  // Interactive checklist from ref12.jpg
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Confirm tomorrow’s tele-consultation with Dr. Arman', done: true },
    { id: 2, text: 'Take morning 25mg Metoprolol medication', done: true },
    { id: 3, text: 'Log resting morning blood pressure reading', done: false },
    { id: 4, text: 'Bring digital insurance card to St. Jude on Nov 24', done: false }
  ]);

  // Modals state replacing native browser alert & prompt
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [newReminderText, setNewReminderText] = useState('');
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [activeDirectionsApt, setActiveDirectionsApt] = useState<any>(null);

  const toggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReminderText.trim()) {
      setChecklist(prev => [...prev, { id: Date.now(), text: newReminderText.trim(), done: false }]);
      setNewReminderText('');
      setReminderModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FAFC] flex">
      {/* Animated Collapsible Sidebar */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        <DashboardNavbar />

        <main className="p-4 sm:p-8 space-y-8 max-w-7xl">
          {/* Top Stat Cards (4 key healthcare pillars) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Upcoming Appointments"
              value={upcomingAppointments.length}
              subtitle={upcomingAppointments.length > 0 ? `Next: ${upcomingAppointments[0].appointmentDate}` : "None scheduled"}
              change={upcomingAppointments.length > 0 ? "+1 this week" : "Schedule now"}
              isPositive={true}
              icon={<Calendar className="w-5 h-5" />}
              iconBg="bg-sky-50 text-[#146C94]"
            />
            <StatCard
              title="Completed Consults"
              value={completedAppointments.length + 12}
              subtitle="All records digitally signed"
              change="100% attendance"
              isPositive={true}
              icon={<CheckCircle2 className="w-5 h-5" />}
              iconBg="bg-emerald-50 text-[#22A06B]"
            />
            <StatCard
              title="Active Prescriptions"
              value={prescriptions[0]?.medications.length || 3}
              subtitle="Auto-refill enabled"
              change="2 ongoing"
              isPositive={true}
              icon={<Pill className="w-5 h-5" />}
              iconBg="bg-teal-50 text-[#19A7A1]"
            />
            <StatCard
              title="Medical Records"
              value={records.length}
              subtitle="256-bit encrypted vault"
              change="+2 added"
              isPositive={true}
              icon={<FileText className="w-5 h-5" />}
              iconBg="bg-indigo-50 text-indigo-600"
            />
          </div>

          {/* Clinical Patient ID & Critical Medical Indicators Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 px-5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-bold text-slate-500">Patient ID: <strong className="text-slate-800 font-mono">PT-2026-8901</strong></span>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1.5 font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Blood Group: O+ (Rh Positive)
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5" /> No Known Drug Allergies (NKDA)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[#19A7A1]" /> EHR Synchronized: Real-time
            </span>
          </div>

          {/* Next Urgent Appointment Banner or Empty State */}
          {upcomingAppointments[0] ? (
            <div className="bg-gradient-to-r from-[#146C94] via-[#105676] to-[#19A7A1] rounded-3xl p-6 text-white shadow-lg shadow-[#146C94]/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <ImageWithFallback
                  src={upcomingAppointments[0].doctorAvatar}
                  alt={upcomingAppointments[0].doctorName}
                  name={upcomingAppointments[0].doctorName}
                  fallbackType="doctor"
                  className="w-16 h-16 rounded-2xl object-cover object-top ring-4 ring-white/20 shadow-md"
                />
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-xs mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#72D6CB]" /> Upcoming Consultation
                  </span>
                  <h3 className="text-xl font-extrabold">{upcomingAppointments[0].doctorName}</h3>
                  <p className="text-xs text-white/80">{upcomingAppointments[0].doctorSpecialty} • {upcomingAppointments[0].hospitalName}</p>
                  <p className="text-xs font-semibold text-[#72D6CB] mt-1">
                    {upcomingAppointments[0].appointmentDate} at {upcomingAppointments[0].timeSlot} ({upcomingAppointments[0].consultationType})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {upcomingAppointments[0].consultationType === 'online' ? (
                  <Link to={`/consultation/${upcomingAppointments[0].id}`}>
                    <Button variant="accent" size="md" icon={<Video className="w-4 h-4" />}>
                      Join Video Call
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="accent"
                    size="md"
                    onClick={() => {
                      setActiveDirectionsApt(upcomingAppointments[0]);
                      setDirectionsModalOpen(true);
                    }}
                    icon={<MapPin className="w-4 h-4" />}
                  >
                    View Clinic Directions
                  </Button>
                )}
                <Link to="/appointments/book">
                  <Button variant="outline" size="md" className="border-white/40 text-white hover:bg-white/10">
                    Book Another
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#146C94] flex items-center justify-center">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">No Urgent Appointments Scheduled</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Maintain preventive health checks with our verified physicians.</p>
                </div>
              </div>
              <Link to="/appointments/book">
                <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
                  Book Consultation
                </Button>
              </Link>
            </div>
          )}

          {/* Interactive Anatomical Model (Diagnosis Hotspots) - inspired by SynthCare screenshot */}
          <AnatomicalModel />

          {/* Health Overview & Vitals */}
          <VitalsWidget />

          {/* Bottom Grid: Prescriptions & Care Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Prescriptions widget */}
            <div className="lg:col-span-8">
              <PrescriptionsWidget prescriptions={prescriptions} />
            </div>

            {/* Checklist & Notes widget (inspired by ref12.jpg) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-[#172B3A]">Health Checklist</h3>
                <span className="text-[11px] font-bold text-[#146C94] bg-[#e8f3f8] px-2 py-0.5 rounded-full">
                  {checklist.filter(c => c.done).length}/{checklist.length} Done
                </span>
              </div>

              <div className="space-y-2.5" role="list">
                {checklist.map(item => (
                  <div
                    key={item.id}
                    role="checkbox"
                    tabIndex={0}
                    aria-checked={item.done}
                    aria-label={item.text}
                    onClick={() => toggleChecklist(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        toggleChecklist(item.id);
                      }
                    }}
                    className="p-3 rounded-xl bg-[#F6FAFC] border border-slate-200/60 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#146C94]/20"
                  >
                    <div className="mt-0.5 text-[#146C94]">
                      {item.done ? (
                        <CheckSquare className="w-4 h-4 text-[#22A06B]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${
                      item.done ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setReminderModalOpen(true)}
                className="w-full py-2.5 text-xs font-bold text-[#146C94] border border-dashed border-[#146C94]/40 rounded-xl hover:bg-[#e8f3f8] transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#146C94]/20"
              >
                <Plus className="w-3.5 h-3.5" /> Add Health Reminder
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* In-App Add Health Reminder Modal */}
      <AnimatePresence>
        {reminderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#e8f3f8] text-[#146C94] flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Add Personal Reminder</h3>
                </div>
                <button
                  onClick={() => setReminderModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddReminder} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">
                    Reminder Description
                  </label>
                  <input
                    type="text"
                    value={newReminderText}
                    onChange={(e) => setNewReminderText(e.target.value)}
                    placeholder="e.g. Log fasting blood glucose, refill prescription..."
                    className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setReminderModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                  >
                    Save Reminder
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* In-App Clinic Directions Modal */}
      <AnimatePresence>
        {directionsModalOpen && activeDirectionsApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#19A7A1] flex items-center justify-center">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">Hospital Clinic Directions</h3>
                    <p className="text-[10px] text-slate-500">Pass Ref: #{activeDirectionsApt.referenceNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDirectionsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6FAFC] border border-slate-200/80 space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-[#146C94] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">{activeDirectionsApt.hospitalName}</h4>
                    <p className="text-slate-500 mt-0.5">Outpatient Pavilion, Wing B, Level 3, Suite 340</p>
                    <p className="text-slate-500">1200 Healthcare Parkway, Medical District</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Attending Physician:</span>
                    <span className="font-bold text-slate-800">{activeDirectionsApt.doctorName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[11px] block">Scheduled Time:</span>
                    <span className="font-bold text-[#146C94]">{activeDirectionsApt.appointmentDate} at {activeDirectionsApt.timeSlot}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-xs text-[#146C94] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Arrival Instructions
                </p>
                <p className="text-[11px] text-slate-600">
                  Please arrive 10 minutes before your appointment time. Show your digital pass reference <strong>{activeDirectionsApt.referenceNumber}</strong> at the Wing B check-in kiosk for expedited security entrance.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setDirectionsModalOpen(false)}
                >
                  Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
