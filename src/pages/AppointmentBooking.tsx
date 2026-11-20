import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Check, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  Download
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Button } from '../components/common/Button';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const AppointmentBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const allDoctors = storageService.getDoctors();
  const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const paramDocId = searchParams.get('doctorId') || allDoctors[0]?.id;
  const paramDate = searchParams.get('date') || tomorrowDate;
  const paramSlot = searchParams.get('slot') || '10:30 AM';
  const paramType = (searchParams.get('type') as 'online' | 'in_person') || 'online';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(paramDocId);
  const [consultationType, setConsultationType] = useState<'online' | 'in_person'>(paramType);
  const [appointmentDate, setAppointmentDate] = useState<string>(paramDate);
  const [selectedSlot, setSelectedSlot] = useState<string>(paramSlot);
  const [consentAgreed, setConsentAgreed] = useState<boolean>(false);

  // Patient details form state
  const [patientName, setPatientName] = useState(user?.name || 'Sarah Jenkins');
  const [patientEmail, setPatientEmail] = useState(user?.email || 'sarah.jenkins@example.com');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '+1 (555) 234-8901');
  const [patientAge, setPatientAge] = useState<number>(32);
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('female');
  const [reasonForVisit, setReasonForVisit] = useState('Routine preventive checkup and cardiovascular wellness review');
  const [symptoms, setSymptoms] = useState('Mild palpitations, sleep irregularity');

  // Booking result
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDoctor = allDoctors.find(d => d.id === selectedDoctorId) || allDoctors[0];

  // Calculate booked slots for this doctor on selected date
  const bookedSlots = storageService.getAppointments()
    .filter(a => a.doctorId === selectedDoctor.id && a.appointmentDate === appointmentDate && a.status !== 'cancelled')
    .map(a => a.timeSlot);

  const steps = [
    'Select Doctor',
    'Appointment Type',
    'Choose Date',
    'Time Slot',
    'Patient Info',
    'Review Summary',
    'Confirmation'
  ];

  const handleNext = () => {
    // Step 5 validation
    if (currentStep === 5) {
      if (!patientName.trim() || patientName.trim().length < 2) {
        setBookingError('Please enter the patient full legal name.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!patientEmail.trim() || !emailRegex.test(patientEmail)) {
        setBookingError('Please enter a valid patient email address.');
        return;
      }
      if (!patientPhone.trim() || patientPhone.trim().length < 7) {
        setBookingError('Please enter a valid contact phone number.');
        return;
      }
      if (!patientAge || patientAge <= 0 || patientAge > 125) {
        setBookingError('Please enter a valid patient age.');
        return;
      }
    }

    setBookingError(null);

    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 6) {
      if (!consentAgreed) {
        setBookingError('Please review and check the Clinical Telehealth & Informed Consent agreement to proceed.');
        return;
      }
      handleConfirmBooking();
    }
  };

  const handleBack = () => {
    setBookingError(null);
    if (currentStep > 1 && currentStep < 7) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setBookingError(null);

    setTimeout(() => {
      const result = storageService.createAppointment({
        patientId: user?.id || 'pat-1',
        patientName,
        patientEmail,
        patientPhone,
        patientAge,
        patientGender,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        doctorAvatar: selectedDoctor.avatar,
        hospitalId: selectedDoctor.hospitalId,
        hospitalName: selectedDoctor.hospitalName,
        appointmentDate,
        timeSlot: selectedSlot,
        consultationType,
        reasonForVisit,
        symptoms,
        fee: selectedDoctor.consultationFee,
        paymentStatus: 'paid'
      });

      setIsSubmitting(false);

      if (result.success && result.appointment) {
        setBookingResult(result.appointment);
        setCurrentStep(7);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        addToast(
          'Appointment Confirmed!',
          `Your appointment with ${selectedDoctor.name} on ${appointmentDate} at ${selectedSlot} has been registered.`,
          'success'
        );
      } else {
        setBookingError(result.error || 'Failed to book appointment. Please try again.');
      }
    }, 800);
  };

  const handleDownloadPass = (appointment: any) => {
    const passContent = `========================================================================
MEDICONNECT DIGITAL CLINICAL APPOINTMENT PASS
========================================================================
Reference Code:  ${appointment.referenceNumber}
Issued Date:     ${new Date().toLocaleDateString()}
Status:          CONFIRMED & REGISTERED

PATIENT DETAILS:
----------------
Name:            ${appointment.patientName}
Age/Gender:      ${appointment.patientAge} Years / ${appointment.patientGender.toUpperCase()}
Email:           ${appointment.patientEmail}
Phone:           ${appointment.patientPhone}
Chief Complaint: ${appointment.reasonForVisit}

APPOINTMENT PARTICULARS:
------------------------
Physician:       ${appointment.doctorName}
Specialty:       ${appointment.doctorSpecialty}
Hospital:        ${appointment.hospitalName}
Format:          ${appointment.consultationType.toUpperCase()}
Date:            ${appointment.appointmentDate}
Time Slot:       ${appointment.timeSlot}
Consult Fee:     $${appointment.fee}.00 (PAID ONLINE)

INSTRUCTIONS:
-------------
- For Telemedicine consultations, join the virtual consultation room 5 minutes prior to the scheduled slot.
- For In-Person hospital consultations, present this pass at the primary reception desk of ${appointment.hospitalName}.
- Inquiries & Support: support@mediconnect.health | +1 (800) 555-MEDI
========================================================================`;

    const blob = new Blob([passContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MediConnect-Pass-${appointment.referenceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Pass Downloaded', `Clinical appointment pass #${appointment.referenceNumber} saved.`, 'success');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F6FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e8f7f6] text-[#146C94] border border-[#72D6CB]/40 mb-2">
            <CalendarIcon className="w-3.5 h-3.5" /> Direct Telehealth & Hospital Scheduling
          </span>
          <h1 className="text-3xl font-extrabold text-[#172B3A] tracking-tight">
            Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#146C94] to-[#19A7A1]">Consultation</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Complete the 7-step guided reservation to secure your clinical time slot.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 mb-8 shadow-card">
          <div className="relative flex items-center justify-between">
            {steps.map((label, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <div key={label} className="flex flex-col items-center relative z-10 flex-1">
                  <motion.div
                    animate={{ scale: isCurrent ? 1.15 : 1 }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      isCompleted
                        ? 'bg-[#22A06B] text-white'
                        : isCurrent
                        ? 'bg-[#146C94] text-white ring-4 ring-[#146C94]/20'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
                  </motion.div>
                  <span className={`text-[10px] mt-1.5 font-bold hidden sm:block text-center ${
                    isCurrent ? 'text-[#146C94]' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card">
          {bookingError && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <div>
                <p className="font-bold">Attention Required</p>
                <p>{bookingError}</p>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: Select Doctor */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-extrabold text-[#172B3A]">Step 1: Choose Your Doctor</h3>
                <p className="text-xs text-slate-500">Select a verified healthcare provider for your consultation.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {allDoctors.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctorId(doc.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                          isSelected
                            ? 'border-[#146C94] bg-[#e8f3f8]/50 ring-2 ring-[#146C94]/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <ImageWithFallback
                          src={doc.avatar}
                          alt={doc.name}
                          name={doc.name}
                          fallbackType="doctor"
                          className="w-14 h-14 rounded-2xl object-cover object-top ring-2 ring-[#19A7A1]/20"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{doc.name}</h4>
                          <p className="text-xs font-semibold text-[#19A7A1]">{doc.specialty}</p>
                          <p className="text-[11px] text-slate-500 truncate">{doc.hospitalName}</p>
                          <span className="text-xs font-extrabold text-[#146C94] mt-1 block">
                            ${doc.consultationFee}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Select Appointment Type */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-extrabold text-[#172B3A]">Step 2: Select Appointment Type</h3>
                <p className="text-xs text-slate-500">Choose between a remote video consultation or an in-clinic visit.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div
                    onClick={() => setConsultationType('online')}
                    className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                      consultationType === 'online'
                        ? 'border-[#146C94] bg-[#e8f3f8]/60 ring-2 ring-[#146C94]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#146C94] text-white flex items-center justify-center mb-4 shadow-md shadow-[#146C94]/20">
                      <Video className="w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900">HD Online Telemedicine</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Consult directly via high-definition encrypted video from anywhere. Instant digital prescription issued.
                    </p>
                    <span className="inline-block mt-4 text-xs font-bold text-[#146C94]">
                      Includes live audio/video & prescription
                    </span>
                  </div>

                  <div
                    onClick={() => setConsultationType('in_person')}
                    className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                      consultationType === 'in_person'
                        ? 'border-[#146C94] bg-[#e8f3f8]/60 ring-2 ring-[#146C94]/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#19A7A1] text-white flex items-center justify-center mb-4 shadow-md shadow-[#19A7A1]/20">
                      <Users className="w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900">In-Person Hospital Visit</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Visit the doctor in their physical outpatient department at {selectedDoctor.hospitalName}.
                    </p>
                    <span className="inline-block mt-4 text-xs font-bold text-[#19A7A1]">
                      Includes priority physical check-in pass
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Choose Date */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-extrabold text-[#172B3A]">Step 3: Select Date</h3>
                <p className="text-xs text-slate-500">Pick an available calendar day for your consultation.</p>

                <div className="max-w-md pt-2">
                  <label htmlFor="appointment-date-input" className="text-xs font-bold text-slate-600 block mb-2">Calendar Date</label>
                  <input
                    id="appointment-date-input"
                    type="date"
                    value={appointmentDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F6FAFC] border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-[#146C94] focus:ring-2 focus:ring-[#146C94]/10"
                  />
                  <p className="text-[11px] text-slate-400 mt-2">
                    Doctor is regularly scheduled on: {selectedDoctor.availableDays.join(', ')}
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Choose Time Slot with Booked Slot Disabling */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#172B3A]">Step 4: Select Available Time Slot</h3>
                    <p className="text-xs text-slate-500">
                      Slots for {appointmentDate} with Dr. {selectedDoctor.name}.
                    </p>
                  </div>
                  {bookedSlots.length > 0 && (
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
                      {bookedSlots.length} slot(s) already booked today
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  {selectedDoctor.availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    const isBooked = bookedSlots.includes(slot);

                    return (
                      <button
                        key={slot}
                        disabled={isBooked}
                        onClick={() => !isBooked && setSelectedSlot(slot)}
                        className={`p-3.5 rounded-2xl text-xs font-bold transition-all text-center border relative ${
                          isBooked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-[#146C94] text-white border-[#146C94] shadow-md shadow-[#146C94]/20'
                            : 'bg-[#F6FAFC] text-slate-700 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1 opacity-70" />
                        <span className={isBooked ? 'line-through' : ''}>{slot}</span>
                        {isBooked && (
                          <span className="block text-[9px] font-bold text-red-500 uppercase mt-0.5">Booked</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Enter Patient Details */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-extrabold text-[#172B3A]">Step 5: Patient Medical Details</h3>
                <p className="text-xs text-slate-500">Provide accurate patient information for clinical chart preparation.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label htmlFor="patient-full-name" className="text-xs font-bold text-slate-600 block mb-1">Full Legal Name *</label>
                    <input
                      id="patient-full-name"
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="patient-email-addr" className="text-xs font-bold text-slate-600 block mb-1">Email Address *</label>
                    <input
                      id="patient-email-addr"
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="patient-phone-num" className="text-xs font-bold text-slate-600 block mb-1">Phone Number *</label>
                    <input
                      id="patient-phone-num"
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="patient-age-val" className="text-xs font-bold text-slate-600 block mb-1">Age *</label>
                      <input
                        id="patient-age-val"
                        type="number"
                        min="1"
                        max="125"
                        value={patientAge}
                        onChange={(e) => setPatientAge(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="patient-gender-sel" className="text-xs font-bold text-slate-600 block mb-1">Gender</label>
                      <select
                        id="patient-gender-sel"
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label htmlFor="patient-reason-text" className="text-xs font-bold text-slate-600 block mb-1">Reason for Consultation</label>
                  <input
                    id="patient-reason-text"
                    type="text"
                    value={reasonForVisit}
                    onChange={(e) => setReasonForVisit(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                    placeholder="e.g. Chest tightness, prescription renewal, skin rash..."
                  />
                </div>

                <div>
                  <label htmlFor="patient-symptoms-text" className="text-xs font-bold text-slate-600 block mb-1">Current Symptoms & Duration (Optional)</label>
                  <textarea
                    id="patient-symptoms-text"
                    rows={2}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                    placeholder="e.g. Occasional fluttering sensation, worse at rest for the past 2 weeks..."
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 6: Review Summary */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-extrabold text-[#172B3A]">Step 6: Review Booking Summary</h3>
                <p className="text-xs text-slate-500">Please review all consultation details before confirming.</p>

                <div className="bg-[#F6FAFC] rounded-2xl p-6 border border-slate-200/80 space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-200/60">
                    <ImageWithFallback
                      src={selectedDoctor.avatar}
                      alt={selectedDoctor.name}
                      name={selectedDoctor.name}
                      fallbackType="doctor"
                      className="w-16 h-16 rounded-2xl object-cover object-top ring-2 ring-[#19A7A1]/20"
                    />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{selectedDoctor.name}</h4>
                      <p className="text-xs font-semibold text-[#19A7A1]">{selectedDoctor.specialty}</p>
                      <p className="text-xs text-slate-500">{selectedDoctor.hospitalName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Type</span>
                      <span className="font-bold text-slate-800 capitalize flex items-center gap-1 mt-0.5">
                        {consultationType === 'online' ? <Video className="w-3.5 h-3.5 text-[#146C94]" /> : <Users className="w-3.5 h-3.5 text-[#19A7A1]" />}
                        {consultationType.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Date</span>
                      <span className="font-bold text-slate-800 block mt-0.5">{appointmentDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Time Slot</span>
                      <span className="font-bold text-slate-800 block mt-0.5">{selectedSlot}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Consultation Fee</span>
                      <span className="font-extrabold text-[#146C94] text-sm block mt-0.5">
                        ${selectedDoctor.consultationFee}.00
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 text-xs space-y-1">
                    <p className="text-slate-500"><strong>Patient:</strong> {patientName} ({patientAge} y.o., {patientGender})</p>
                    <p className="text-slate-500"><strong>Contact:</strong> {patientEmail} • {patientPhone}</p>
                    <p className="text-slate-500"><strong>Reason:</strong> {reasonForVisit}</p>
                  </div>

                  {/* Telehealth Informed Consent */}
                  <div className="pt-3 border-t border-slate-200/60">
                    <label htmlFor="telehealth-consent" className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80">
                      <input
                        id="telehealth-consent"
                        type="checkbox"
                        checked={consentAgreed}
                        onChange={(e) => setConsentAgreed(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#146C94] focus:ring-[#146C94] w-4 h-4 cursor-pointer"
                      />
                      <span className="leading-relaxed">
                        I confirm this clinical information is accurate and explicitly agree to the <strong>Telehealth & Outpatient Informed Consent</strong> under MediConnect's HIPAA privacy policies. I understand online consults do not replace immediate 911 emergency care.
                      </span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 7: Confirmation Screen */}
            {currentStep === 7 && bookingResult && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-5"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#22A06B] flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-[#172B3A]">Consultation Confirmed!</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your appointment has been successfully scheduled and synced to your records.
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-[#F6FAFC] rounded-2xl p-5 border border-slate-200/80 text-left text-xs space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Reference Code:</span>
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {bookingResult.referenceNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Doctor:</span>
                    <span className="font-bold text-slate-800">{bookingResult.doctorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-bold text-slate-800">{bookingResult.appointmentDate} at {bookingResult.timeSlot}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Consultation Format:</span>
                    <span className="font-bold text-slate-800 capitalize">{bookingResult.consultationType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Payment Status:</span>
                    <span className="font-bold text-[#22A06B] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Paid (${bookingResult.fee}.00)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  {bookingResult.consultationType === 'online' && (
                    <Link to={`/consultation/${bookingResult.id}`}>
                      <Button variant="secondary" size="md" icon={<Video className="w-4 h-4" />}>
                        Open Telemedicine Room
                      </Button>
                    </Link>
                  )}
                  <Link to="/patient/dashboard">
                    <Button variant="primary" size="md">
                      Go to Patient Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => handleDownloadPass(bookingResult)}
                    icon={<Download className="w-4 h-4" />}
                  >
                    Download Pass
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          {currentStep < 7 && (
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Previous Step
                </Button>
              ) : (
                <div />
              )}

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                isLoading={isSubmitting}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                {currentStep === 6 ? 'Confirm & Book Appointment' : 'Continue'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
