# MediConnect – Premium Healthcare Technology Platform
> Unified Digital Ecosystem Connecting Patients, Specialists, Partner Hospitals, and Diagnostic Centers.

Built with **React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, and Supabase**.

---

## 🏥 Platform Highlights

- **Visual Sophistication & Identity**:
  - Medical color hierarchy: Primary `#146C94`, Secondary `#19A7A1`, Accent `#72D6CB`, Canvas `#F6FAFC`, Charcoal `#172B3A`.
  - Glassmorphic panels, subtle elevation shadows, and Plus Jakarta Sans typography.
- **Framer Motion Animation System**:
  - Page-level route transitions wrapped in `AnimatePresence`.
  - Viewport scroll reveals, stagger animations, floating hero telemetry pills, and spring interactions.
- **Interactive Anatomical Diagnosis Hotspots**:
  - Interactive silhouette diagnosis model with condition monitoring for cardiovascular, renal, and orthopedic systems.
- **Zero Double-Booking Engine**:
  - Transactional booking constraint guaranteeing no conflicting doctor slots.
- **Encrypted Medical Records Vault**:
  - 256-bit encrypted HIPAA-compliant document management with category filtering and upload modal.
- **Digital Prescription & Print System**:
  - Cryptographically verifiable digital e-prescriptions with structured morning, afternoon, evening, and bedtime dosage schedules.
- **Real-Time Telemedicine Interface**:
  - HD consultation suite with audio/video controls, connection latency HUD, patient PiP feed, live consultation timer, and chat drawer.
- **Hospital Administration Suite**:
  - Inpatient room census breakdown, staff and doctor rota management, and interactive Recharts graphs.

---

## 🗺️ Application Architecture & Routes

| Route | View Description |
|---|---|
| `/` | **Landing Page** with split-screen hero, live statistics, services, top doctors, and testimonials |
| `/doctors` | **Doctor Discovery** with instant search, specialty dropdowns, and rating/price sorting |
| `/doctors/:id` | **Doctor Profile** with verified credentials, patient reviews, and sticky slot selector |
| `/hospitals` | **Hospital Directory** featuring tertiary care centers, 24/7 emergency indicators, and bed counts |
| `/services` | **Clinical Offerings** detailing cardiology, telehealth, e-prescriptions, and diagnostics |
| `/how-it-works` | **Patient Journey** with animated 4-step guided walkthrough |
| `/about` | **About MediConnect**, clinical board principles, and mission |
| `/contact` | **24/7 Concierge Support**, medical hotlines, and FAQ accordion |
| `/appointments/book` | **7-Step Booking Flow** with animated step progress, slot picker, and confetti celebration |
| `/login` | **Role-based Authentication** with 1-click demo accounts (Patient, Doctor, Admin) |
| `/register` | **User Registration** supporting multi-role onboarding and HIPAA consent |
| `/forgot-password` | **Credential Recovery** with secure email link dispatch |
| `/patient/dashboard` | **Patient Portal** with anatomical hotspots, vitals telemetry, checklist, and prescriptions |
| `/patient/records` | **Encrypted Medical Records** with upload modal and file validation |
| `/patient/prescriptions` | **E-Prescription Engine** with official printable clinical Rx layout |
| `/hospital/dashboard` | **Hospital Admin Suite** with bed occupancy census, doctor management, and queue approvals |
| `/consultation/:id` | **Telehealth WebRTC Room** with camera/mic toggles, timer, and live chat |

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
# Server starts at http://localhost:3000/ or http://localhost:3001/

# 3. Production build
npm run build
```

## 🗄️ Database Architecture (`supabase/schema.sql`)
The PostgreSQL schema provides:
- Tables: `profiles`, `patients`, `doctors`, `hospitals`, `departments`, `appointments`, `doctor_availability`, `medical_records`, `prescriptions`, `consultations`, `notifications`, `reviews`.
- Double-booking prevention: `CONSTRAINT unique_doctor_slot_active UNIQUE (doctor_id, appointment_date, time_slot)`
- Row Level Security (RLS) policies isolating patient records and doctor appointments.
