import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  DollarSign, 
  Bed, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X,
  FileSpreadsheet,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { storageService } from '../../services/storageService';
import { MOCK_HOSPITAL_ANALYTICS } from '../../data/mockData';
import { Doctor, Appointment } from '../../types';
import { DashboardSidebar } from '../../components/dashboard/DashboardSidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { StatCard } from '../../components/dashboard/StatCard';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import { useNotification } from '../../context/NotificationContext';

export const HospitalDashboardPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'doctors' | 'appointments' | 'rooms'>('overview');
  
  // Synchronize active section with URL hash if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'doctors', 'appointments', 'rooms'].includes(hash)) {
        setActiveSection(hash as any);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  
  // Data state
  const [doctors, setDoctors] = useState<Doctor[]>(() => storageService.getDoctors());
  const [appointments, setAppointments] = useState<Appointment[]>(() => storageService.getAppointments());
  const { addToast } = useNotification();

  // Modals
  const [addDoctorModalOpen, setAddDoctorModalOpen] = useState(false);
  const [editDoctorModalDoc, setEditDoctorModalDoc] = useState<Doctor | null>(null);
  const [deleteDoctorModalDoc, setDeleteDoctorModalDoc] = useState<Doctor | null>(null);
  const [appointmentActionModal, setAppointmentActionModal] = useState<{ apt: Appointment; action: 'approve' | 'reschedule' | 'cancel' } | null>(null);

  // Search queries
  const [doctorSearch, setDoctorSearch] = useState('');
  const [aptSearch, setAptSearch] = useState('');

  // New Doctor Form
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpecialty, setNewDocSpecialty] = useState('Cardiologist');
  const [newDocQualifications, setNewDocQualifications] = useState('MD, FACC');
  const [newDocFee, setNewDocFee] = useState(65);
  const [newDocExperience, setNewDocExperience] = useState(10);
  const [newDocLicense, setNewDocLicense] = useState(`MED-NY-${Math.floor(10000 + Math.random() * 90000)}`);

  // Edit Doctor Form State
  const [editDocName, setEditDocName] = useState('');
  const [editDocSpecialty, setEditDocSpecialty] = useState('');
  const [editDocFee, setEditDocFee] = useState(0);
  const [editDocExperience, setEditDocExperience] = useState(0);
  const [rescheduleSlot, setRescheduleSlot] = useState('11:00 AM');

  const analytics = MOCK_HOSPITAL_ANALYTICS;

  const handleOpenEditDoctor = (doc: Doctor) => {
    setEditDoctorModalDoc(doc);
    setEditDocName(doc.name);
    setEditDocSpecialty(doc.specialty);
    setEditDocFee(doc.consultationFee);
    setEditDocExperience(doc.experienceYears);
  };

  const handleSaveEditDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDoctorModalDoc) return;
    storageService.updateDoctor(editDoctorModalDoc.id, {
      name: editDocName,
      specialty: editDocSpecialty,
      consultationFee: editDocFee,
      experienceYears: editDocExperience
    });
    setDoctors(storageService.getDoctors());
    setEditDoctorModalDoc(null);
    addToast('Doctor Updated', `Clinical credentials updated for ${editDocName}.`, 'success');
  };

  const handleConfirmDeleteDoctor = () => {
    if (!deleteDoctorModalDoc) return;
    storageService.removeDoctor(deleteDoctorModalDoc.id);
    setDoctors(storageService.getDoctors());
    addToast('Doctor Removed', `${deleteDoctorModalDoc.name} has been de-provisioned from hospital staff.`, 'info');
    setDeleteDoctorModalDoc(null);
  };

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const created: Doctor = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      avatar: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=400&q=80',
      specialty: newDocSpecialty,
      qualifications: newDocQualifications,
      experienceYears: newDocExperience,
      rating: 5.0,
      reviewCount: 1,
      consultationFee: newDocFee,
      hospitalId: 'hosp-1',
      hospitalName: 'Apex Heart & Vascular Institute',
      languages: ['English'],
      bio: 'Board-certified medical specialist dedicated to precision hospital diagnosis.',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      nextAvailable: 'Today',
      availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      consultationTypes: ['online', 'in_person'],
      status: 'available',
      licenseNumber: newDocLicense,
      whatItHelpsWith: ['Clinical Consultations', 'Diagnostic Follow-up']
    };

    storageService.addDoctor(created);
    setDoctors(storageService.getDoctors());
    setAddDoctorModalOpen(false);
    setNewDocName('');
    addToast('Doctor Added', `${created.name} successfully assigned to ${created.specialty} department.`, 'success');
  };

  const handleUpdateDoctorStatus = (id: string, status: Doctor['status']) => {
    storageService.updateDoctorStatus(id, status);
    setDoctors(storageService.getDoctors());
    addToast('Status Updated', 'Physician shift availability refreshed.', 'info');
  };

  const handleUpdateAppointment = (id: string, status: Appointment['status']) => {
    storageService.updateAppointmentStatus(id, status);
    setAppointments(storageService.getAppointments());
    setAppointmentActionModal(null);
    addToast('Appointment Updated', `Consultation record marked as ${status}.`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#F6FAFC] flex">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        <DashboardNavbar
          title="Hospital Administration Suite"
          subtitle="Clinical operations, physician rotas, inpatient room census & scheduling"
        />

        <main className="p-4 sm:p-8 space-y-8 max-w-7xl">
          {/* Section Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'overview', label: 'Executive Overview' },
              { id: 'doctors', label: `Staff & Doctors (${doctors.length})` },
              { id: 'appointments', label: `Appointments (${appointments.length})` },
              { id: 'rooms', label: 'Bed & Room Census' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeSection === tab.id
                    ? 'bg-[#146C94] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 4 Stat Cards (matching like thsi 4.jpg & ref2.jpg) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Doctors"
              value={doctors.length}
              subtitle="3 joined this week"
              change="+12% vs last month"
              isPositive={true}
              icon={<Users className="w-5 h-5" />}
              iconBg="bg-sky-50 text-[#146C94]"
              onClick={() => setActiveSection('doctors')}
            />
            <StatCard
              title="Total Patients"
              value={analytics.stats.totalPatients.toLocaleString()}
              subtitle="Registered patient charts"
              change="+1.3% growth"
              isPositive={true}
              icon={<Activity className="w-5 h-5" />}
              iconBg="bg-teal-50 text-[#19A7A1]"
            />
            <StatCard
              title="Total Transaction"
              value={`$${analytics.stats.totalRevenue.toLocaleString()}`}
              subtitle="Monthly clinical revenue"
              change="-4.3% vs peak"
              isPositive={false}
              icon={<DollarSign className="w-5 h-5" />}
              iconBg="bg-amber-50 text-[#F4B740]"
            />
            <StatCard
              title="Total Appointments"
              value={appointments.length + 1450}
              subtitle="18/day avg per doctor"
              change="+1.8% vs yesterday"
              isPositive={true}
              icon={<Calendar className="w-5 h-5" />}
              iconBg="bg-emerald-50 text-[#22A06B]"
              onClick={() => setActiveSection('appointments')}
            />
          </div>

          {/* OVERVIEW SECTION: Charts & Census */}
          {(activeSection === 'overview' || activeSection === 'rooms') && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Reported Cases Area Chart (matching ref2.jpg) */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-base text-[#172B3A]">Reported Cases & Inpatient Volume</h3>
                    <p className="text-xs text-slate-500">Historical trend of positive admissions vs discharged cases</p>
                  </div>
                  <span className="text-xs font-bold text-[#146C94] bg-[#e8f3f8] px-3 py-1 rounded-full">
                    Neurology & Cardiology
                  </span>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.reportedCasesTimeline}>
                      <defs>
                        <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#146C94" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#146C94" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F4B740" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#F4B740" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                      <YAxis stroke="#94A3B8" fontSize={11} />
                      <Tooltip />
                      <Area type="monotone" dataKey="positive" name="Admissions (k)" stroke="#146C94" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPositive)" />
                      <Area type="monotone" dataKey="negative" name="Discharged (k)" stroke="#F4B740" strokeWidth={2} fillOpacity={1} fill="url(#colorNegative)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Share Radial Chart (matching ref2.jpg) */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-base text-[#172B3A]">Most Visited Depts</h3>
                  <span className="text-xs font-bold text-slate-400">Monthly</span>
                </div>

                <div className="h-56 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.departmentShare}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics.departmentShare.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {analytics.departmentShare.map((dept) => (
                    <div key={dept.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color }} />
                        <span className="font-bold text-slate-700">{dept.name}</span>
                      </div>
                      <span className="font-extrabold text-[#172B3A]">{dept.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ROOM AVAILABILITY BREAKDOWN (matching like thsi 4.jpg & ref2.jpg) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-[#172B3A]">Inpatient Bed & Room Availability</h3>
                <p className="text-xs text-slate-500">Live census by wing, ICU, Semi-private & surgical theatres</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                19 Available Today
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
              {analytics.roomAvailability.map((room) => (
                <div
                  key={room.type}
                  className="p-4 rounded-2xl bg-[#F6FAFC] border border-slate-200/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 line-clamp-1">{room.type}</span>
                    <Bed className="w-3.5 h-3.5 text-[#146C94]" />
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-[#172B3A]">{room.occupied}</span>
                    <span className="text-xs text-slate-400 font-semibold">/ {room.total}</span>
                  </div>

                  {/* Occupancy bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(room.occupied / room.total) * 100}%`,
                        backgroundColor: room.color
                      }}
                    />
                  </div>

                  <span className="text-[10px] text-slate-500 font-semibold mt-2">
                    {room.available} beds empty
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DOCTOR MANAGEMENT SECTION (matching ref11.jpg) */}
          {(activeSection === 'overview' || activeSection === 'doctors') && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-[#172B3A]">Doctor & Clinical Staff Management</h3>
                  <p className="text-xs text-slate-500">Manage physicians, duty schedules, licensing & availability status</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setAddDoctorModalOpen(true)}
                    icon={<UserPlus className="w-4 h-4" />}
                  >
                    Add Doctor
                  </Button>
                </div>
              </div>

              {/* Search Doctors */}
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  placeholder="Filter physicians by name or specialty..."
                  className="w-full pl-9 pr-4 py-2 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                />
              </div>

              {/* Doctor queue list (cards matching ref11.jpg) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {doctors.filter(d => {
                  if (!doctorSearch.trim()) return true;
                  const q = doctorSearch.toLowerCase();
                  return d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q);
                }).map((doc) => {
                  const statusColors = {
                    available: 'bg-emerald-100 text-[#22A06B]',
                    on_duty: 'bg-sky-100 text-[#146C94]',
                    in_surgery: 'bg-amber-100 text-amber-700',
                    on_leave: 'bg-slate-100 text-slate-600'
                  };

                  return (
                    <div
                      key={doc.id}
                      className="p-5 rounded-2xl bg-[#F6FAFC] border border-slate-200/80 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={doc.avatar}
                            alt={doc.name}
                            name={doc.name}
                            fallbackType="doctor"
                            className="w-12 h-12 rounded-2xl object-cover object-top ring-2 ring-[#19A7A1]/20"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                            <p className="text-xs font-semibold text-[#146C94]">{doc.specialty} • {doc.qualifications}</p>
                          </div>
                        </div>

                        {/* Status selector */}
                        <select
                          value={doc.status}
                          onChange={(e) => handleUpdateDoctorStatus(doc.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-none focus:outline-none ${statusColors[doc.status]}`}
                        >
                          <option value="available">Available</option>
                          <option value="on_duty">On Duty</option>
                          <option value="in_surgery">In Surgery</option>
                          <option value="on_leave">On Leave</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 py-2 border-y border-slate-200/60">
                        <div>
                          <span className="text-slate-400 block text-[10px]">License:</span>
                          <span className="font-mono font-bold text-slate-800">{doc.licenseNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Experience:</span>
                          <span className="font-bold text-slate-800">{doc.experienceYears} Years</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Consultation Fee:</span>
                          <span className="font-bold text-[#146C94]">${doc.consultationFee}.00</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Scheduled Days:</span>
                          <span className="font-bold text-slate-800">{doc.availableDays.join(', ')}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-500">Rating: ★ {doc.rating} ({doc.reviewCount})</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditDoctor(doc)}
                            className="text-xs font-bold text-[#146C94] hover:underline flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteDoctorModalDoc(doc)}
                            className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1 ml-2"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* APPOINTMENT MANAGEMENT SECTION */}
          {(activeSection === 'overview' || activeSection === 'appointments') && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-[#172B3A]">Consultation & Appointment Queue</h3>
                  <p className="text-xs text-slate-500">Approve, reschedule or cancel incoming patient visits</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => storageService.exportAppointmentsCSV()}
                  icon={<FileSpreadsheet className="w-4 h-4 text-[#22A06B]" />}
                >
                  Export Appointments CSV
                </Button>
              </div>

              {/* Search Appointments */}
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={aptSearch}
                  onChange={(e) => setAptSearch(e.target.value)}
                  placeholder="Filter appointments by patient, ref or doctor..."
                  className="w-full pl-9 pr-4 py-2 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                />
              </div>

              <div className="divide-y divide-slate-100">
                {appointments.filter(a => {
                  if (!aptSearch.trim()) return true;
                  const q = aptSearch.toLowerCase();
                  return a.patientName.toLowerCase().includes(q) || a.referenceNumber.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q);
                }).map((apt) => {
                  const statusColors = {
                    confirmed: 'bg-emerald-50 text-[#22A06B] border-emerald-200',
                    pending: 'bg-amber-50 text-amber-700 border-amber-200',
                    completed: 'bg-sky-50 text-[#146C94] border-sky-200',
                    cancelled: 'bg-red-50 text-[#E05252] border-red-200',
                    in_progress: 'bg-purple-50 text-purple-700 border-purple-200'
                  };

                  return (
                    <div key={apt.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                          {apt.patientName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-800">{apt.patientName}</h4>
                            <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                              {apt.referenceNumber}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[apt.status]}`}>
                              {apt.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Assigned: <strong>{apt.doctorName}</strong> ({apt.doctorSpecialty}) • {apt.consultationType}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Scheduled: {apt.appointmentDate} at {apt.timeSlot} • Fee: ${apt.fee}
                          </p>
                        </div>
                      </div>

                      {/* Appointment Actions */}
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        {apt.status === 'pending' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUpdateAppointment(apt.id, 'confirmed')}
                            icon={<Check className="w-3.5 h-3.5" />}
                          >
                            Approve
                          </Button>
                        )}
                        {apt.status === 'confirmed' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUpdateAppointment(apt.id, 'completed')}
                            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          >
                            Mark Completed
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRescheduleSlot(apt.timeSlot);
                            setAppointmentActionModal({ apt, action: 'reschedule' });
                          }}
                        >
                          Reschedule
                        </Button>
                        {apt.status !== 'cancelled' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setAppointmentActionModal({ apt, action: 'cancel' });
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={addDoctorModalOpen}
        onClose={() => setAddDoctorModalOpen(false)}
        title="Add Physician to Medical Staff"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDoctor} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Doctor Full Name</label>
            <input
              type="text"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              placeholder="e.g. Dr. Jennifer Lawrence"
              className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department / Specialty</label>
              <select
                value={newDocSpecialty}
                onChange={(e) => setNewDocSpecialty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
              >
                <option value="Cardiologist">Cardiology</option>
                <option value="Dermatologist">Dermatology</option>
                <option value="General Physician">General Medicine</option>
                <option value="Orthopedic Specialist">Orthopedics</option>
                <option value="Neurologist">Neurology</option>
                <option value="Pediatrician">Pediatrics</option>
                <option value="Endocrinologist">Endocrinology</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Medical License Number</label>
              <input
                type="text"
                value={newDocLicense}
                onChange={(e) => setNewDocLicense(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Qualifications</label>
              <input
                type="text"
                value={newDocQualifications}
                onChange={(e) => setNewDocQualifications(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Consultation Fee ($)</label>
              <input
                type="number"
                value={newDocFee}
                onChange={(e) => setNewDocFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setAddDoctorModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Register Physician
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal
        isOpen={!!editDoctorModalDoc}
        onClose={() => setEditDoctorModalDoc(null)}
        title={`Edit Physician: ${editDoctorModalDoc?.name}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEditDoctor} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Doctor Full Name</label>
            <input
              type="text"
              value={editDocName}
              onChange={(e) => setEditDocName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department</label>
              <select
                value={editDocSpecialty}
                onChange={(e) => setEditDocSpecialty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
              >
                <option value="Cardiologist">Cardiology</option>
                <option value="Dermatologist">Dermatology</option>
                <option value="General Physician">General Medicine</option>
                <option value="Orthopedic Specialist">Orthopedics</option>
                <option value="Neurologist">Neurology</option>
                <option value="Pediatrician">Pediatrics</option>
                <option value="Endocrinologist">Endocrinology</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Consultation Fee ($)</label>
              <input
                type="number"
                value={editDocFee}
                onChange={(e) => setEditDocFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Experience (Years)</label>
            <input
              type="number"
              value={editDocExperience}
              onChange={(e) => setEditDocExperience(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditDoctorModalDoc(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={!!deleteDoctorModalDoc}
        onClose={() => setDeleteDoctorModalDoc(null)}
        title="Confirm Physician Removal"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Are you sure you want to remove <strong>{deleteDoctorModalDoc?.name}</strong> ({deleteDoctorModalDoc?.specialty}) from active hospital staff?
            This will unschedule future clinical availability.
          </p>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setDeleteDoctorModalDoc(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDeleteDoctor}>
              Yes, Remove Doctor
            </Button>
          </div>
        </div>
      </Modal>

      {/* Appointment Action Modal (Reschedule / Cancel) */}
      <Modal
        isOpen={!!appointmentActionModal}
        onClose={() => setAppointmentActionModal(null)}
        title={appointmentActionModal?.action === 'reschedule' ? 'Reschedule Clinical Appointment' : 'Cancel Appointment Confirmation'}
        maxWidth="md"
      >
        {appointmentActionModal && (
          <div className="space-y-4 text-xs">
            {appointmentActionModal.action === 'reschedule' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  appointmentActionModal.apt.timeSlot = rescheduleSlot;
                  handleUpdateAppointment(appointmentActionModal.apt.id, 'confirmed');
                }}
                className="space-y-4"
              >
                <p className="text-slate-600">
                  Reschedule consultation for <strong>{appointmentActionModal.apt.patientName}</strong> with <strong>{appointmentActionModal.apt.doctorName}</strong>:
                </p>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select or Enter New Time Slot</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {['09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:30 PM', '04:45 PM'].map(slot => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setRescheduleSlot(slot)}
                        className={`p-2 rounded-xl font-bold border transition-all text-center ${
                          rescheduleSlot === slot
                            ? 'bg-[#146C94] text-white border-[#146C94]'
                            : 'bg-[#F6FAFC] text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={rescheduleSlot}
                    onChange={(e) => setRescheduleSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                    placeholder="Custom slot (e.g. 05:15 PM)"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setAppointmentActionModal(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Confirm Reschedule
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Are you sure you want to cancel appointment <strong>#{appointmentActionModal.apt.referenceNumber}</strong> for patient <strong>{appointmentActionModal.apt.patientName}</strong>?
                </p>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button variant="ghost" size="sm" onClick={() => setAppointmentActionModal(null)}>
                    Keep Appointment
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleUpdateAppointment(appointmentActionModal.apt.id, 'cancelled')}
                  >
                    Confirm Cancellation
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
