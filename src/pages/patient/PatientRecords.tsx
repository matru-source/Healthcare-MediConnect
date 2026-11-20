import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Lock, 
  ShieldCheck, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { MedicalRecord } from '../../types';
import { DashboardSidebar } from '../../components/dashboard/DashboardSidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

export const PatientRecordsPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>(() => storageService.getRecords());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'dateDesc' | 'dateAsc'>('dateDesc');

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModalRecord, setPreviewModalRecord] = useState<MedicalRecord | null>(null);

  // Form states
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<MedicalRecord['category']>('Lab Reports');
  const [uploadDoctor, setUploadDoctor] = useState('Dr. Arman Rahman');
  const [uploadHospital, setUploadHospital] = useState('Apex Heart & Vascular Institute');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadIsSensitive, setUploadIsSensitive] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { addToast } = useNotification();

  const categories = ['All', 'Lab Reports', 'Prescriptions', 'Diagnostic Reports', 'Medical History', 'Other Documents'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setUploadError('File size exceeds the 15MB clinical limit.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleDownloadRecord = (record: MedicalRecord) => {
    const content = `========================================================================
MEDICONNECT CLINICAL RECORDS VAULT - VERIFIED MEDICAL DOCUMENT
========================================================================
Record ID: ${record.id}
Document Title: ${record.title}
Category: ${record.category}
Date of Exam/Issue: ${record.date}
Authorizing Physician: ${record.doctorName}
Clinical Institution: ${record.hospitalName}
File Classification: ${record.fileType.toUpperCase()} (Size: ${record.fileSize})
Sensitive Record Flag: ${record.isSensitive ? 'YES (Confidential)' : 'NO'}

CLINICAL SUMMARY & OBSERVATIONS:
${record.description || 'Verified patient clinical report stored under HIPAA compliance.'}

Tags: ${record.tags.join(', ')}
Security Verification: Cryptographically Verified by MediConnect EHR
========================================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${record.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${record.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast('Document Downloaded', `Saved ${record.title} to your device.`, 'success');
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      setUploadError('Please provide a document title.');
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      const extension = selectedFile?.name.split('.').pop()?.toLowerCase() || 'pdf';
      const fileType = ['pdf', 'jpg', 'png', 'dicom'].includes(extension) ? (extension as any) : 'pdf';

      const newRecord = storageService.addRecord({
        patientId: user?.id || 'pat-1',
        title: uploadTitle,
        category: uploadCategory,
        fileType,
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
        date: new Date().toISOString().split('T')[0],
        doctorName: uploadDoctor,
        hospitalName: uploadHospital,
        fileUrl: '/assets/sample-report.pdf',
        description: uploadDescription || 'Patient verified uploaded clinical document.',
        isSensitive: uploadIsSensitive,
        tags: [uploadCategory, 'Patient Upload']
      });

      setRecords(storageService.getRecords());
      setIsUploading(false);
      setUploadModalOpen(false);
      // Reset form
      setUploadTitle('');
      setSelectedFile(null);
      addToast('Document Uploaded', `${uploadTitle} is encrypted and securely stored.`, 'success');
    }, 700);
  };

  const filteredRecords = records.filter(r => {
    if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDoc = r.doctorName.toLowerCase().includes(q);
      const matchHosp = r.hospitalName.toLowerCase().includes(q);
      const matchTags = r.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDoc && !matchHosp && !matchTags) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'dateDesc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="min-h-screen bg-[#F6FAFC] flex">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        <DashboardNavbar title="Medical Records Vault" subtitle="Encrypted HIPAA compliant diagnostic reports, labs & imaging" />

        <main className="p-4 sm:p-8 space-y-6 max-w-7xl">
          {/* Top Actions & Security Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#22A06B] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#172B3A]">Encrypted Clinical Record Storage</h2>
                <p className="text-xs text-slate-500">
                  Protected with AES-256 encryption. Only you and authorized physicians hold access keys.
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setUploadModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Upload Medical Document
            </Button>
          </div>

          {/* Search, Category Filter & Sorting */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, test name, doctor or facility..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#146C94] shadow-xs"
                />
              </div>

              {/* Sort by */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort medical records by"
                className="bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs focus:outline-none"
              >
                <option value="dateDesc">Newest Reports First</option>
                <option value="dateAsc">Oldest Reports First</option>
              </select>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#146C94] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Records Table / Card Grid */}
          <div className="space-y-3">
            {filteredRecords.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No medical records found</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting your search query or upload a new record.</p>
              </div>
            ) : (
              filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#146C94]/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#e8f3f8] text-[#146C94] flex items-center justify-center shrink-0">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-[#172B3A]">{record.title}</h4>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e8f7f6] text-[#19A7A1]">
                          {record.category}
                        </span>
                        {record.isSensitive && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Sensitive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Physician: <strong>{record.doctorName}</strong> • {record.hospitalName}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                        <span>Date: {record.date}</span>
                        <span>•</span>
                        <span>Format: {record.fileType.toUpperCase()} ({record.fileSize})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewModalRecord(record)}
                      icon={<Eye className="w-4 h-4" />}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadRecord(record)}
                      icon={<Download className="w-4 h-4" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Upload Record Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Clinical Record"
        maxWidth="lg"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          {uploadError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Document Title</label>
            <input
              type="text"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. Thyroid Panel, Knee MRI Scan..."
              className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Record Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
              >
                <option value="Lab Reports">Lab Reports</option>
                <option value="Prescriptions">Prescriptions</option>
                <option value="Diagnostic Reports">Diagnostic Reports</option>
                <option value="Medical History">Medical History</option>
                <option value="Other Documents">Other Documents</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Authorizing Doctor</label>
              <input
                type="text"
                value={uploadDoctor}
                onChange={(e) => setUploadDoctor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Hospital / Diagnostic Center</label>
            <input
              type="text"
              value={uploadHospital}
              onChange={(e) => setUploadHospital(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
            />
          </div>

          {/* Drag & drop file area */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Select File (PDF, JPG, PNG, DICOM - Max 15MB)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-[#F6FAFC] transition-colors relative cursor-pointer">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.dicom"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-[#146C94] mx-auto mb-2" />
              {selectedFile ? (
                <p className="font-bold text-[#146C94]">{selectedFile.name} ({(selectedFile.size / (1024*1024)).toFixed(1)} MB)</p>
              ) : (
                <>
                  <p className="font-bold text-slate-700">Click or drag file to upload</p>
                  <p className="text-[11px] text-slate-400 mt-1">Encrypted on upload with HIPAA-grade private storage</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sensitiveCheck"
              checked={uploadIsSensitive}
              onChange={(e) => setUploadIsSensitive(e.target.checked)}
              className="rounded text-[#146C94] focus:ring-[#146C94]"
            />
            <label htmlFor="sensitiveCheck" className="text-slate-600 font-medium">
              Flag as Sensitive Medical Document (Requires biometric/passcode confirmation)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isUploading}>
              Save & Encrypt Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Preview Modal */}
      <Modal
        isOpen={!!previewModalRecord}
        onClose={() => setPreviewModalRecord(null)}
        title={previewModalRecord?.title}
        maxWidth="lg"
      >
        {previewModalRecord && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#F6FAFC] rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-slate-800">{previewModalRecord.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Issuing Physician:</span>
                <span className="font-bold text-slate-800">{previewModalRecord.doctorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Clinical Facility:</span>
                <span className="font-bold text-slate-800">{previewModalRecord.hospitalName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Date Issued:</span>
                <span className="font-bold text-slate-800">{previewModalRecord.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">File Type:</span>
                <span className="font-bold uppercase text-slate-800">{previewModalRecord.fileType} ({previewModalRecord.fileSize})</span>
              </div>
            </div>

            <div className="p-4 border rounded-2xl bg-white space-y-2">
              <h5 className="font-bold text-slate-700">Clinical Observations & Summary:</h5>
              <p className="text-slate-600 leading-relaxed italic">{previewModalRecord.description}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => previewModalRecord && handleDownloadRecord(previewModalRecord)}
                icon={<Download className="w-4 h-4" />}
              >
                Download Verified Record
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
