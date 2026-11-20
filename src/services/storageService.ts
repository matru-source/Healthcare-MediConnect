import { Appointment, Doctor, MedicalRecord, Prescription, DoctorReview } from '../types';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_RECORDS, MOCK_PRESCRIPTIONS, MOCK_REVIEWS } from '../data/mockData';

const APPOINTMENTS_KEY = 'mediconnect_appointments';
const RECORDS_KEY = 'mediconnect_records';
const PRESCRIPTIONS_KEY = 'mediconnect_prescriptions';
const DOCTORS_KEY = 'mediconnect_doctors';
const REVIEWS_KEY = 'mediconnect_reviews';

export const storageService = {
  // APPOINTMENTS
  getAppointments: (): Appointment[] => {
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    if (!data) {
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(MOCK_APPOINTMENTS));
      return MOCK_APPOINTMENTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MOCK_APPOINTMENTS;
    }
  },

  createAppointment: (newApt: Omit<Appointment, 'id' | 'referenceNumber' | 'createdAt' | 'status'>): { success: boolean; appointment?: Appointment; error?: string } => {
    const appointments = storageService.getAppointments();

    // Check double-booking constraint: no active confirmed appointment for same doctor at same date & slot
    const isConflict = appointments.some(
      a => a.doctorId === newApt.doctorId &&
           a.appointmentDate === newApt.appointmentDate &&
           a.timeSlot === newApt.timeSlot &&
           a.status !== 'cancelled'
    );

    if (isConflict) {
      return {
        success: false,
        error: `Dr. ${newApt.doctorName} already has a confirmed consultation on ${newApt.appointmentDate} at ${newApt.timeSlot}. Please select another time slot.`
      };
    }

    const created: Appointment = {
      ...newApt,
      id: `apt-${Date.now()}`,
      referenceNumber: `MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    const updated = [created, ...appointments];
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updated));
    return { success: true, appointment: created };
  },

  updateAppointmentStatus: (id: string, status: Appointment['status']): boolean => {
    const list = storageService.getAppointments();
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return false;
    list[index].status = status;
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify([...list]));
    return true;
  },

  // DOCTORS
  getDoctors: (): Doctor[] => {
    const data = localStorage.getItem(DOCTORS_KEY);
    if (!data) {
      localStorage.setItem(DOCTORS_KEY, JSON.stringify(MOCK_DOCTORS));
      return MOCK_DOCTORS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MOCK_DOCTORS;
    }
  },

  addDoctor: (doctor: Doctor): void => {
    const docs = storageService.getDoctors();
    const updated = [doctor, ...docs];
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(updated));
  },

  updateDoctor: (id: string, updatedDoctor: Partial<Doctor>): boolean => {
    const docs = storageService.getDoctors();
    const index = docs.findIndex(d => d.id === id);
    if (index === -1) return false;
    docs[index] = { ...docs[index], ...updatedDoctor };
    localStorage.setItem(DOCTORS_KEY, JSON.stringify([...docs]));
    return true;
  },

  removeDoctor: (id: string): boolean => {
    const docs = storageService.getDoctors();
    const filtered = docs.filter(d => d.id !== id);
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(filtered));
    return true;
  },

  updateDoctorStatus: (id: string, status: Doctor['status']): void => {
    const docs = storageService.getDoctors();
    const updated = docs.map(d => d.id === id ? { ...d, status } : d);
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(updated));
  },

  // EXPORT UTILITIES (Browser File Downloads)
  exportAppointmentsCSV: (): void => {
    const appointments = storageService.getAppointments();
    const headers = ['Reference Number', 'Patient Name', 'Patient Email', 'Doctor', 'Specialty', 'Hospital', 'Date', 'Time Slot', 'Type', 'Status', 'Fee ($)'];
    const rows = appointments.map(a => [
      a.referenceNumber,
      `"${a.patientName}"`,
      a.patientEmail,
      `"${a.doctorName}"`,
      `"${a.doctorSpecialty}"`,
      `"${a.hospitalName}"`,
      a.appointmentDate,
      `"${a.timeSlot}"`,
      a.consultationType,
      a.status,
      a.fee
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mediconnect_appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // MEDICAL RECORDS
  getRecords: (): MedicalRecord[] => {
    const data = localStorage.getItem(RECORDS_KEY);
    if (!data) {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(MOCK_RECORDS));
      return MOCK_RECORDS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MOCK_RECORDS;
    }
  },

  addRecord: (record: Omit<MedicalRecord, 'id'>): MedicalRecord => {
    const records = storageService.getRecords();
    const newRecord: MedicalRecord = {
      ...record,
      id: `rec-${Date.now()}`
    };
    const updated = [newRecord, ...records];
    localStorage.setItem(RECORDS_KEY, JSON.stringify(updated));
    return newRecord;
  },

  // PRESCRIPTIONS
  getPrescriptions: (): Prescription[] => {
    const data = localStorage.getItem(PRESCRIPTIONS_KEY);
    if (!data) {
      localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(MOCK_PRESCRIPTIONS));
      return MOCK_PRESCRIPTIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MOCK_PRESCRIPTIONS;
    }
  },

  addPrescription: (prescription: Omit<Prescription, 'id'>): Prescription => {
    const current = storageService.getPrescriptions();
    const newRx: Prescription = {
      ...prescription,
      id: `rx-${Date.now()}`
    };
    const updated = [newRx, ...current];
    localStorage.setItem(PRESCRIPTIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return newRx;
  },

  // DOCTOR REVIEWS
  getReviews: (doctorId?: string): DoctorReview[] => {
    const data = localStorage.getItem(REVIEWS_KEY);
    let list = MOCK_REVIEWS;
    if (data) {
      try {
        list = JSON.parse(data);
      } catch {
        list = MOCK_REVIEWS;
      }
    } else {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(MOCK_REVIEWS));
    }
    if (doctorId) {
      return list.filter(r => r.doctorId === doctorId);
    }
    return list;
  },

  addReview: (review: Omit<DoctorReview, 'id' | 'date'>): DoctorReview => {
    const current = storageService.getReviews();
    const newReview: DoctorReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newReview, ...current];
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return newReview;
  }
};
