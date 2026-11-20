import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';

console.log('=== MEDICONNECT COMPREHENSIVE VERIFICATION SUITE ===\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

// 1. Verify critical files exist
const criticalFiles = [
  'index.html',
  'package.json',
  'vite.config.ts',
  'tailwind.config.js',
  'supabase/schema.sql',
  'src/main.tsx',
  'src/App.tsx',
  'src/data/mockData.ts',
  'src/types/index.ts',
  'src/services/storageService.ts',
  'src/services/supabase.ts',
  'src/context/AuthContext.tsx',
  'src/context/NotificationContext.tsx',
  'src/components/common/Navbar.tsx',
  'src/components/common/Footer.tsx',
  'src/components/common/Button.tsx',
  'src/components/common/Modal.tsx',
  'src/components/common/SectionHeading.tsx',
  'src/components/common/ToastContainer.tsx',
  'src/components/common/ImageWithFallback.tsx',
  'src/components/doctors/DoctorCard.tsx',
  'src/components/hospitals/HospitalCard.tsx',
  'src/components/dashboard/DashboardSidebar.tsx',
  'src/components/dashboard/DashboardNavbar.tsx',
  'src/components/dashboard/StatCard.tsx',
  'src/components/dashboard/AnatomicalModel.tsx',
  'src/components/dashboard/VitalsWidget.tsx',
  'src/components/dashboard/PrescriptionsWidget.tsx',
  'src/pages/Home.tsx',
  'src/pages/Doctors.tsx',
  'src/pages/DoctorProfile.tsx',
  'src/pages/Hospitals.tsx',
  'src/pages/Services.tsx',
  'src/pages/HowItWorks.tsx',
  'src/pages/About.tsx',
  'src/pages/Contact.tsx',
  'src/pages/AppointmentBooking.tsx',
  'src/pages/Login.tsx',
  'src/pages/Register.tsx',
  'src/pages/ForgotPassword.tsx',
  'src/pages/NotFound.tsx',
  'src/pages/patient/PatientDashboard.tsx',
  'src/pages/patient/PatientRecords.tsx',
  'src/pages/patient/PatientPrescriptions.tsx',
  'src/pages/hospital/HospitalDashboard.tsx',
  'src/pages/consultation/ConsultationRoom.tsx'
];

criticalFiles.forEach(file => {
  assert(existsSync(resolve(file)), `File exists: ${file}`);
});

// 2. Verify SQL Schema
const schemaSql = readFileSync(resolve('supabase/schema.sql'), 'utf-8');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.profiles'), 'Schema defines profiles table');
assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.appointments'), 'Schema defines appointments table');
assert(schemaSql.includes('CONSTRAINT unique_doctor_slot_active UNIQUE (doctor_id, appointment_date, time_slot)'), 'Schema enforces double-booking unique constraint');
assert(schemaSql.includes('ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;'), 'Schema enables Row Level Security (RLS) on medical records');

// 3. Verify App Routes
const appCode = readFileSync(resolve('src/App.tsx'), 'utf-8');
const routes = [
  '/',
  '/doctors',
  '/doctors/:id',
  '/hospitals',
  '/services',
  '/how-it-works',
  '/about',
  '/contact',
  '/appointments/book',
  '/login',
  '/register',
  '/forgot-password',
  '/patient/dashboard',
  '/patient/records',
  '/patient/prescriptions',
  '/hospital/dashboard',
  '/consultation/:id'
];

routes.forEach(r => {
  assert(appCode.includes(`path="${r}"`), `App.tsx configures route ${r}`);
});

// 4. Verify Brand Colors in Tailwind
const tailwindConfig = readFileSync(resolve('tailwind.config.js'), 'utf-8');
assert(tailwindConfig.includes('#146C94'), 'Tailwind defines primary color #146C94');
assert(tailwindConfig.includes('#19A7A1'), 'Tailwind defines secondary color #19A7A1');
assert(tailwindConfig.includes('#72D6CB'), 'Tailwind defines accent color #72D6CB');
assert(tailwindConfig.includes('#F6FAFC'), 'Tailwind defines background #F6FAFC');

// 5. Verify Industry-grade Print Stylesheet and Accessibility in index.css
const cssContent = readFileSync(resolve('src/styles/index.css'), 'utf-8');
assert(cssContent.includes('@media print'), 'Print stylesheet @media print configured in index.css');
assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'Accessibility prefers-reduced-motion configured in index.css');

// Verify Modal Accessibility
const modalCode = readFileSync(resolve('src/components/common/Modal.tsx'), 'utf-8');
assert(modalCode.includes('role="dialog"') && modalCode.includes('aria-modal="true"'), 'Modal implements role="dialog" and aria-modal="true"');
assert(appCode.includes('NotFoundPage'), 'App.tsx mounts dedicated NotFoundPage for unmatched routes');
assert(cssContent.includes('#printable-rx'), 'Prescription container #printable-rx isolated for printing');

// Helper to recursively get all .ts and .tsx files in src
function getAllSourceFiles(dir) {
  let results = [];
  const list = readdirSync(dir);
  list.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllSourceFiles(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const allSrcFiles = getAllSourceFiles(resolve('src'));

// 6. Verify Zero Native alert, prompt, confirm popups in src
let nativePopupsFound = 0;
const popupRegex = /\b(alert|prompt|confirm)\s*\(/;
allSrcFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  if (popupRegex.test(content)) {
    console.error(`Found native popup in ${file}`);
    nativePopupsFound++;
  }
});
assert(nativePopupsFound === 0, 'Zero native browser popups (alert, prompt, confirm) remain in codebase');

// 7. Verify Zero raw <img tags outside ImageWithFallback
let rawImagesFound = 0;
const imgRegex = /<img\s+/;
allSrcFiles.forEach(file => {
  if (file.endsWith('ImageWithFallback.tsx')) return;
  const content = readFileSync(file, 'utf-8');
  if (imgRegex.test(content)) {
    console.error(`Found raw <img> in ${file}`);
    rawImagesFound++;
  }
});
assert(rawImagesFound === 0, 'Zero raw <img tags outside ImageWithFallback.tsx across the entire application');

// 8. Verify Build artifacts
assert(existsSync(resolve('dist/index.html')), 'Production build artifact dist/index.html exists');

console.log(`\nVerification Complete: ${passedTests}/${totalTests} tests passed.`);
if (passedTests === totalTests) {
  console.log('🎉 ALL HEALTHCARE PLATFORM SPECIFICATIONS VALIDATED SUCCESSFULLY!');
} else {
  process.exit(1);
}
