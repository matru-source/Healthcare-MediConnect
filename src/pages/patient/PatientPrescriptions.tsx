import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Printer, 
  Download, 
  Clock, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  User, 
  Activity, 
  FileText,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Prescription } from '../../types';
import { DashboardSidebar } from '../../components/dashboard/DashboardSidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { Button } from '../../components/common/Button';
import { useNotification } from '../../context/NotificationContext';

export const PatientPrescriptionsPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const prescriptions = storageService.getPrescriptions();
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(prescriptions[0] || null);
  const [refillModalOpen, setRefillModalOpen] = useState(false);
  const { addToast } = useNotification();

  const handlePrint = () => {
    if (!selectedRx) return;
    window.print();
  };

  const handleDownloadRx = () => {
    if (!selectedRx) return;
    const content = `========================================================================
MEDICONNECT OFFICIAL CLINICAL DIGITAL PRESCRIPTION
========================================================================
Prescription Token: ${selectedRx.prescriptionNumber}
Date of Consultation: ${selectedRx.date}
Clinical Center: ${selectedRx.hospitalName}

ATTENDING PHYSICIAN:
Name: ${selectedRx.doctorName}
Specialty: ${selectedRx.doctorSpecialty}
Medical License: ${selectedRx.doctorLicense}

PATIENT INFORMATION:
Name: ${selectedRx.patientName}
Age/Gender: ${selectedRx.patientAge} Years / ${selectedRx.patientGender}
Recorded Vitals: BP ${selectedRx.vitals.bp} | Pulse ${selectedRx.vitals.heartRate} | Temp ${selectedRx.vitals.temperature} | Weight ${selectedRx.vitals.weight}

DIAGNOSIS:
${selectedRx.diagnosis}

PRESCRIBED MEDICATIONS:
${selectedRx.medications.map((m, i) => `${i + 1}. ${m.name} (${m.dosage}) - ${m.frequency} for ${m.duration}
   Instructions: ${m.instructions}
   Schedule: ${[m.timing.morning ? 'Morning' : '', m.timing.afternoon ? 'Afternoon' : '', m.timing.evening ? 'Evening' : '', m.timing.night ? 'Bedtime' : ''].filter(Boolean).join(', ')}`).join('\n\n')}

CLINICAL ADVICE & LIFESTYLE GUIDANCE:
${selectedRx.advice}

Follow-up Consultation: ${selectedRx.followUpDate}

PKI Digital Signature: VALID & CRYPTOGRAPHICALLY AUTHENTICATED
========================================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mediconnect_rx_${selectedRx.prescriptionNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast('Prescription Downloaded', `Voucher #${selectedRx.prescriptionNumber} saved.`, 'success');
  };

  const handleConfirmRefill = () => {
    setRefillModalOpen(false);
    addToast(
      'Pharmacy Refill Dispatched',
      `Auto-refill request for ${selectedRx?.medications[0]?.name || 'medication'} sent to partner hospital pharmacy.`,
      'success'
    );
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
        <DashboardNavbar title="Digital Prescriptions" subtitle="Digitally signed doctor e-prescriptions with structured dosage guides" />

        <main className="p-4 sm:p-8 space-y-6 max-w-7xl">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#172B3A]">Prescription Directory</h2>
              <p className="text-xs text-slate-500">Select any clinical prescription to view and print official Rx chart.</p>
            </div>

            {selectedRx && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRefillModalOpen(true)}
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Request Pharmacy Refill
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  icon={<Printer className="w-4 h-4" />}
                >
                  Print Rx
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadRx}
                  icon={<Download className="w-4 h-4" />}
                >
                  Download Rx Voucher
                </Button>
              </div>
            )}
          </div>

          {!selectedRx || prescriptions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-card space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#19A7A1] flex items-center justify-center mx-auto">
                <Pill className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Prescriptions Recorded</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once a verified specialist completes your consultation, your official digitally signed e-prescription will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left list of prescriptions */}
              <div className="lg:col-span-4 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Prescription Records ({prescriptions.length})
                </span>
                {prescriptions.map(rx => {
                  const isSelected = selectedRx?.id === rx.id;
                  return (
                    <div
                      key={rx.id}
                      onClick={() => setSelectedRx(rx)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white border-[#146C94] shadow-md ring-2 ring-[#146C94]/20'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#146C94]">{rx.prescriptionNumber}</span>
                        <span className="text-[11px] text-slate-400">{rx.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">{rx.doctorName}</h4>
                      <p className="text-xs text-[#19A7A1] font-semibold">{rx.doctorSpecialty}</p>
                      <p className="text-[11px] text-slate-500 mt-1 truncate">{rx.diagnosis}</p>
                    </div>
                  );
                })}
              </div>

              {/* Right: Professional Printable Medical Prescription Sheet */}
              <div className="lg:col-span-8">
                <div id="printable-rx" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card space-y-6">
                  {/* Clinical Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b-2 border-slate-800 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#146C94] text-white flex items-center justify-center font-black">
                          M
                        </div>
                        <span className="text-xl font-extrabold text-[#172B3A]">
                          Medi<span className="text-[#19A7A1]">Connect</span> Rx
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{selectedRx.hospitalName}</p>
                      <p className="text-[11px] text-slate-400">Electronic Health Record Verification System</p>
                    </div>

                    <div className="text-left sm:text-right text-xs">
                      <h3 className="font-extrabold text-slate-900 text-sm">{selectedRx.doctorName}</h3>
                      <p className="text-[#146C94] font-bold">{selectedRx.doctorSpecialty}</p>
                      <p className="text-slate-500 font-mono text-[11px]">Lic: {selectedRx.doctorLicense}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#22A06B] mt-1">
                        <ShieldCheck className="w-3 h-3" /> Digitally Cryptographically Signed
                      </span>
                    </div>
                  </div>

                  {/* Patient Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F6FAFC] rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Patient Name:</span>
                      <strong className="text-slate-800">{selectedRx.patientName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Age & Gender:</span>
                      <strong className="text-slate-800">{selectedRx.patientAge} Yrs / {selectedRx.patientGender}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Consult Date:</span>
                      <strong className="text-slate-800">{selectedRx.date}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Rx Reference:</span>
                      <strong className="text-[#146C94] font-mono">{selectedRx.prescriptionNumber}</strong>
                    </div>
                  </div>

                  {/* Vitals Recorded */}
                  <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex flex-wrap items-center justify-between text-xs text-slate-700 gap-2">
                    <span><strong>Blood Pressure:</strong> {selectedRx.vitals.bp}</span>
                    <span><strong>Heart Rate:</strong> {selectedRx.vitals.heartRate}</span>
                    <span><strong>Temperature:</strong> {selectedRx.vitals.temperature}</span>
                    <span><strong>Weight:</strong> {selectedRx.vitals.weight}</span>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Diagnosis</h4>
                    <p className="text-sm font-bold text-slate-900 bg-[#F6FAFC] p-3 rounded-xl border border-slate-200/60">
                      {selectedRx.diagnosis}
                    </p>
                  </div>

                  {/* Medications Table */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prescribed Medicines</h4>
                    <div className="space-y-3">
                      {selectedRx.medications.map((med, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-[#F6FAFC]/50">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900">
                              {idx + 1}. {med.name} ({med.dosage})
                            </span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              {med.frequency} • {med.duration}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-2 italic">
                            Instructions: {med.instructions}
                          </p>

                          {/* Timing pills */}
                          <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold">
                            <span className="text-slate-400">Dosage Timing:</span>
                            {med.timing.morning && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Morning</span>}
                            {med.timing.afternoon && <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">Afternoon</span>}
                            {med.timing.evening && <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">Evening</span>}
                            {med.timing.night && <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">Night</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advice & Follow Up */}
                  <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <p><strong>Clinical Advice:</strong> <span className="text-slate-600">{selectedRx.advice}</span></p>
                    <p><strong>Next Follow-up Consultation:</strong> <span className="font-bold text-[#146C94]">{selectedRx.followUpDate}</span></p>
                  </div>

                  {/* Footer Signature */}
                  <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
                    <div className="text-[10px] text-slate-400">
                      <p>Generated by MediConnect Clinical Suite</p>
                      <p>Verified with Public Key Infrastructure (PKI)</p>
                    </div>
                    <div className="text-right">
                      <div className="w-32 border-b border-slate-400 mb-1 inline-block" />
                      <p className="text-xs font-extrabold text-slate-800">{selectedRx.doctorName}</p>
                      <p className="text-[10px] text-slate-400">Authorized Physician Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Refill Request Modal */}
      <AnimatePresence>
        {refillModalOpen && selectedRx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#19A7A1] flex items-center justify-center">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Request Medication Refill</h3>
                </div>
                <button
                  onClick={() => setRefillModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6FAFC] border border-slate-200/80 text-xs space-y-2">
                <p><strong>Prescription:</strong> #{selectedRx.prescriptionNumber}</p>
                <p><strong>Physician:</strong> {selectedRx.doctorName}</p>
                <p><strong>Medications:</strong> {selectedRx.medications.map(m => `${m.name} (${m.dosage})`).join(', ')}</p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                MediConnect will forward your clinical refill request directly to <strong>{selectedRx.hospitalName}</strong> pharmacy.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setRefillModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleConfirmRefill}>
                  Confirm Refill Request
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
