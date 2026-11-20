import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Common layout components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Public pages
import { HomePage } from './pages/Home';
import { DoctorsPage } from './pages/Doctors';
import { DoctorProfilePage } from './pages/DoctorProfile';
import { HospitalsPage } from './pages/Hospitals';
import { ServicesPage } from './pages/Services';
import { HowItWorksPage } from './pages/HowItWorks';
import { AboutPage } from './pages/About';
import { ContactPage } from './pages/Contact';
import { AppointmentBookingPage } from './pages/AppointmentBooking';
import { NotFoundPage } from './pages/NotFound';

// Auth pages
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { ForgotPasswordPage } from './pages/ForgotPassword';

// Portal pages
import { PatientDashboardPage } from './pages/patient/PatientDashboard';
import { PatientRecordsPage } from './pages/patient/PatientRecords';
import { PatientPrescriptionsPage } from './pages/patient/PatientPrescriptions';
import { HospitalDashboardPage } from './pages/hospital/HospitalDashboard';
import { ConsultationRoomPage } from './pages/consultation/ConsultationRoom';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Scroll to top helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Page transition wrapper
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.25, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

export const App: React.FC = () => {
  const location = useLocation();

  // Pages that don't need the default public navbar/footer
  const isDashboardRoute = location.pathname.startsWith('/patient') || location.pathname.startsWith('/hospital');
  const isConsultationRoute = location.pathname.startsWith('/consultation');
  const hideMainChrome = isDashboardRoute || isConsultationRoute;

  return (
    <AuthProvider>
      <NotificationProvider>
        <ScrollToTop />
        <ToastContainer />

        {!hideMainChrome && <Navbar />}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/doctors" element={<PageWrapper><DoctorsPage /></PageWrapper>} />
            <Route path="/doctors/:id" element={<PageWrapper><DoctorProfilePage /></PageWrapper>} />
            <Route path="/hospitals" element={<PageWrapper><HospitalsPage /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><ServicesPage /></PageWrapper>} />
            <Route path="/how-it-works" element={<PageWrapper><HowItWorksPage /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
            <Route path="/appointments/book" element={<PageWrapper><AppointmentBookingPage /></PageWrapper>} />

            {/* Auth routes */}
            <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
            <Route path="/forgot-password" element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />

            {/* Patient portal routes */}
            <Route path="/patient/dashboard" element={<PageWrapper><PatientDashboardPage /></PageWrapper>} />
            <Route path="/patient/records" element={<PageWrapper><PatientRecordsPage /></PageWrapper>} />
            <Route path="/patient/prescriptions" element={<PageWrapper><PatientPrescriptionsPage /></PageWrapper>} />

            {/* Hospital administration routes - Protected by role guard */}
            <Route
              path="/hospital/dashboard"
              element={
                <ProtectedRoute allowedRoles={['hospital_admin', 'doctor']}>
                  <PageWrapper><HospitalDashboardPage /></PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* Telemedicine WebRTC consultation room */}
            <Route path="/consultation/:id" element={<PageWrapper><ConsultationRoomPage /></PageWrapper>} />

            {/* 404 Catch-all route */}
            <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>

        {!hideMainChrome && <Footer />}
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
