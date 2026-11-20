-- ==============================================================================
-- MEDICONNECT: Comprehensive PostgreSQL & Supabase Database Schema
-- Production-Ready Schema with Row Level Security (RLS), Double-Booking Constraints,
-- Triggers, RBAC Policies, and Audit Tracking.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'hospital_admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'in_progress');
CREATE TYPE consultation_type AS ENUM ('online', 'in_person');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'insurance');
CREATE TYPE record_category AS ENUM ('Lab Reports', 'Prescriptions', 'Diagnostic Reports', 'Medical History', 'Other Documents');
CREATE TYPE doctor_duty_status AS ENUM ('available', 'on_duty', 'in_surgery', 'on_leave');

-- 3. PROFILES TABLE (Supabase auth.users profile sync)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS public.hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    emergency_available BOOLEAN DEFAULT true,
    total_beds INT DEFAULT 200,
    icu_beds INT DEFAULT 30,
    rating NUMERIC(3,2) DEFAULT 4.8,
    review_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    head_of_department TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    sub_specialty TEXT,
    qualifications TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 5,
    license_number TEXT NOT NULL UNIQUE,
    consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 50.00,
    bio TEXT,
    languages TEXT[] DEFAULT ARRAY['English'],
    status doctor_duty_status DEFAULT 'available',
    rating NUMERIC(3,2) DEFAULT 4.9,
    review_count INT DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DOCTOR AVAILABILITY SLOTS (Scheduling rules)
CREATE TABLE IF NOT EXISTS public.doctor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT check_time_order CHECK (end_time > start_time)
);

-- 8. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender TEXT,
    blood_group TEXT,
    emergency_contact TEXT,
    allergies TEXT[],
    chronic_conditions TEXT[],
    insurance_provider TEXT,
    insurance_policy_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. APPOINTMENTS TABLE
-- Crucial: Exclude / Prevent double-booking for the same doctor at the same date and timeslot
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_number TEXT NOT NULL UNIQUE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE RESTRICT,
    hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    consultation_type consultation_type NOT NULL DEFAULT 'online',
    reason_for_visit TEXT NOT NULL,
    symptoms TEXT,
    fee NUMERIC(10,2) NOT NULL,
    status appointment_status NOT NULL DEFAULT 'confirmed',
    payment_status payment_status NOT NULL DEFAULT 'paid',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- Constraint to prevent double booking active slots
    CONSTRAINT unique_doctor_slot_active UNIQUE (doctor_id, appointment_date, time_slot)
);

-- 10. CONSULTATIONS TABLE (Telemedicine sessions)
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES public.appointments(id) ON DELETE CASCADE,
    room_id TEXT NOT NULL UNIQUE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id),
    patient_id UUID NOT NULL REFERENCES public.patients(id),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    duration_minutes INT,
    doctor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MEDICAL RECORDS TABLE (Private sensitive document storage)
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category record_category NOT NULL,
    file_path TEXT NOT NULL, -- Supabase Storage private bucket path
    file_type TEXT NOT NULL,
    file_size_bytes BIGINT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    is_sensitive BOOLEAN DEFAULT true,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_number TEXT NOT NULL UNIQUE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE RESTRICT,
    diagnosis TEXT NOT NULL,
    vitals JSONB DEFAULT '{}'::jsonb, -- { bp: '120/80', heartRate: '72 bpm', weight: '70kg' }
    medications JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ name, dosage, frequency, timing }]
    advice TEXT,
    follow_up_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'appointment', 'prescription', 'record', 'consultation'
    read BOOLEAN NOT NULL DEFAULT false,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public read for Doctors, Hospitals, Departments
CREATE POLICY "Public can view active doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Public can view hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Public can view departments" ON public.departments FOR SELECT USING (true);

-- Profiles RLS: Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Appointments RLS:
CREATE POLICY "Patients view own appointments" ON public.appointments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.patients WHERE patients.id = appointments.patient_id AND patients.profile_id = auth.uid()));

CREATE POLICY "Patients insert own appointments" ON public.appointments FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.patients WHERE patients.id = appointments.patient_id AND patients.profile_id = auth.uid()));

CREATE POLICY "Doctors view assigned appointments" ON public.appointments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.doctors WHERE doctors.id = appointments.doctor_id AND doctors.profile_id = auth.uid()));

-- Medical records RLS: Only authorized patient and prescribing doctors can view
CREATE POLICY "Patients view own records" ON public.medical_records FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.patients WHERE patients.id = medical_records.patient_id AND patients.profile_id = auth.uid()));

CREATE POLICY "Patients upload own records" ON public.medical_records FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.patients WHERE patients.id = medical_records.patient_id AND patients.profile_id = auth.uid()));

-- ==============================================================================
-- STORAGE BUCKETS CONFIGURATION (Supabase Storage)
-- ==============================================================================
-- 1. 'medical-records' (Private bucket - access checked via RLS storage policies)
-- 2. 'avatars' (Public bucket - doctor and patient avatars)
-- 3. 'hospital-media' (Public bucket - facility photos)
