export type UserRole = 'patient' | 'doctor' | 'hospital_admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  created_at: string;
  hospital_id?: string;
  specialty?: string;
  bloodGroup?: string;
  allergies?: string[];
}

export interface Doctor {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  subSpecialty?: string;
  qualifications: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  hospitalId: string;
  hospitalName: string;
  distanceKm?: number;
  languages: string[];
  bio: string;
  availableDays: string[];
  nextAvailable: string;
  availableSlots: string[];
  consultationTypes: ('online' | 'in_person')[];
  status: 'available' | 'on_duty' | 'in_surgery' | 'on_leave';
  licenseNumber: string;
  whatItHelpsWith: string[];
}

export interface Hospital {
  id: string;
  name: string;
  image: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  phone: string;
  emergencyAvailable: boolean;
  totalDoctors: number;
  specialties: string[];
  departments: string[];
  description: string;
  stats: {
    beds: number;
    icuBeds: number;
    dailyOutpatients: number;
    successRate: number;
  };
}

export interface Appointment {
  id: string;
  referenceNumber: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: 'male' | 'female' | 'other';
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  hospitalId: string;
  hospitalName: string;
  appointmentDate: string;
  timeSlot: string;
  consultationType: 'online' | 'in_person';
  reasonForVisit: string;
  symptoms?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'in_progress';
  fee: number;
  paymentStatus: 'paid' | 'pending' | 'insurance';
  createdAt: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  category: 'Lab Reports' | 'Prescriptions' | 'Diagnostic Reports' | 'Medical History' | 'Other Documents';
  fileType: 'pdf' | 'jpg' | 'png' | 'dicom';
  fileSize: string;
  date: string;
  doctorName: string;
  hospitalName: string;
  fileUrl: string;
  description?: string;
  isSensitive: boolean;
  tags: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  timing: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorLicense: string;
  hospitalName: string;
  date: string;
  diagnosis: string;
  vitals: {
    bp: string;
    heartRate: string;
    temperature: string;
    weight: string;
  };
  medications: Medication[];
  advice: string;
  followUpDate: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'prescription' | 'record' | 'consultation' | 'reminder';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  patientName: string;
  patientAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}
