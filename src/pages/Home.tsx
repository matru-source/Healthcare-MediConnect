import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  Activity, 
  Search, 
  Calendar, 
  Video, 
  ShieldCheck, 
  Lock, 
  Star, 
  Clock, 
  Users, 
  FileText, 
  Pill, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  ChevronRight,
  ChevronLeft,
  PhoneCall,
  Play
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { MOCK_HOSPITALS, MOCK_REVIEWS } from '../data/mockData';
import { DoctorCard } from '../components/doctors/DoctorCard';
import { HospitalCard } from '../components/hospitals/HospitalCard';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

// Interactive count-up statistics component
const AnimatedCounter: React.FC<{ value: number; suffix?: string; decimals?: number; className?: string }> = ({
  value,
  suffix = '',
  decimals = 0,
  className
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1600;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(ease * value);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
  }, [isInView, value]);

  return (
    <span ref={ref} className={className}>
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  );
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const doctors = storageService.getDoctors().slice(0, 4);
  const hospitals = MOCK_HOSPITALS.slice(0, 3);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Auto-advance testimonials carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonialIdx(prev => (prev + 1) % 3);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: 'Elena Rostova',
      role: 'Cardiac Patient',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      quote: 'MediConnect completely transformed how I manage my cardiovascular health. Booking Dr. Arman took 40 seconds, the video call was crystal clear, and my digital prescription was automatically queued to my local pharmacy.'
    },
    {
      name: 'David K. Henderson',
      role: 'Chronic Care Patient',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      quote: 'Having all my diagnostic ECGs, blood labs, and specialist consultations under one secure, HIPAA-compliant vault is a breath of fresh air. No more lost paper files!'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Endocrinology Lead',
      avatar: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      quote: 'As a hospital physician, the real-time double-booking prevention and clinical telemetry dashboard allow me to treat more outpatients with zero administrative friction.'
    }
  ];

  const services = [
    {
      title: 'Doctor Discovery',
      description: 'Search 84+ verified board-certified physicians filtered by specialty, sub-specialty, ratings, and instant availability.',
      icon: Users,
      link: '/doctors',
      color: 'bg-sky-50 text-[#146C94]'
    },
    {
      title: 'Online Consultation',
      description: 'Connect securely with specialists over encrypted HD WebRTC video with real-time chat, screen sharing and vital stats.',
      icon: Video,
      link: '/consultation/apt-101',
      color: 'bg-teal-50 text-[#19A7A1]'
    },
    {
      title: 'Appointment Scheduling',
      description: 'Interactive 7-step booking engine with slot reservation algorithms preventing double booking across hospital clinics.',
      icon: Calendar,
      link: '/appointments/book',
      color: 'bg-emerald-50 text-[#22A06B]'
    },
    {
      title: 'Medical Records Vault',
      description: 'Private 256-bit encrypted health document storage. Upload, categorize, and share labs and diagnostic scans securely.',
      icon: FileText,
      link: '/patient/records',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Digital Prescriptions',
      description: 'Cryptographically signed e-prescriptions with structured morning, afternoon and night medication dosages.',
      icon: Pill,
      link: '/patient/prescriptions',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      title: 'Diagnostic Centers',
      description: 'Integrated partner network across accredited regional medical centers and outpatient testing laboratories.',
      icon: Activity,
      link: '/hospitals',
      color: 'bg-rose-50 text-[#E05252]'
    }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* SECTION 1: HERO (inspired by assets/like this 1.jpg & ref1.jpg) */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 bg-radial from-[#e8f7f6]/60 via-[#F6FAFC] to-white overflow-hidden">
        {/* Soft background ambient glow */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#72D6CB]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-10 w-96 h-96 bg-[#146C94]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#72D6CB]/50 text-xs font-bold text-[#146C94] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#19A7A1] animate-ping" />
                <span>Your Health, Connected</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#172B3A] tracking-tight leading-[1.12]">
                Healthcare That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#146C94] via-[#19A7A1] to-[#146C94]">Connects.</span> Care That Matters.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Discover trusted doctors, book verified appointments, access live HD online consultations, and manage your lifelong healthcare journey in one unified, secure platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/doctors" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" fullWidth icon={<Search className="w-4 h-4" />}>
                    Find a Doctor
                  </Button>
                </Link>
                <Link to="/appointments/book" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" fullWidth icon={<Calendar className="w-4 h-4" />}>
                    Book Consultation
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-2 sm:gap-4 text-left">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22A06B] shrink-0 mt-0.5" />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-700">Verified Physicians</span>
                </div>
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-[#146C94] shrink-0 mt-0.5" />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-700">256-Bit Encrypted</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#19A7A1] shrink-0 mt-0.5" />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-700">Zero Double-Booking</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Column: Visual composition with floating cards (matching like this 1.jpg) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="lg:col-span-6 relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-lg">
                {/* Main Hero Doctor Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] max-h-[500px]">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
                    alt="Doctor MediConnect"
                    name="Dr. Arman Rahman"
                    fallbackType="hero"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#146C94]/80 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-6 left-6 text-white pointer-events-none">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#72D6CB]">Lead Cardiologist</span>
                    <h3 className="text-2xl font-extrabold">Dr. Arman Rahman</h3>
                    <p className="text-xs text-slate-200">Apex Heart & Vascular Institute</p>
                  </div>
                </div>

                {/* Floating Telemedicine Call Card (inspired by like this 1.jpg) */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-4 sm:-right-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-20"
                >
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1594824813637-0245a4918e9d?auto=format&fit=crop&w=150&q=80"
                    alt="Dr. Martina"
                    name="Dr. Martina Ricci"
                    fallbackType="doctor"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#19A7A1]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Incoming Call</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">Dr. Martina Ricci</p>
                    <p className="text-[10px] text-[#19A7A1] font-semibold">Consultant Cardiologist</p>
                  </div>
                </motion.div>

                {/* Floating Real-time Slot Card (inspired by ref1.jpg) */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 z-20 space-y-2 max-w-[240px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Next Available Slot</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link
                      to="/appointments/book?slot=2%3A30%20PM"
                      className="px-2.5 py-1 rounded-lg bg-[#146C94] text-white text-xs font-bold hover:bg-[#19A7A1] transition-colors"
                    >
                      2:30 PM
                    </Link>
                    <Link
                      to="/appointments/book?slot=4%3A00%20PM"
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      4:00 PM
                    </Link>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-800">4.9</span>
                    <span>(100k+ reviews)</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUSTED STATISTICS */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <AnimatedCounter value={84} suffix="+" className="text-3xl sm:text-4xl font-extrabold text-[#146C94] tracking-tight" />
              <p className="text-xs sm:text-sm font-bold text-[#172B3A] mt-1">Verified Doctors</p>
              <p className="text-[11px] text-slate-400">Board-certified specialists</p>
            </div>
            <div>
              <AnimatedCounter value={120} suffix="+" className="text-3xl sm:text-4xl font-extrabold text-[#19A7A1] tracking-tight" />
              <p className="text-xs sm:text-sm font-bold text-[#172B3A] mt-1">Partner Hospitals</p>
              <p className="text-[11px] text-slate-400">Accredited tertiary networks</p>
            </div>
            <div>
              <AnimatedCounter value={1.4} decimals={1} suffix="M+" className="text-3xl sm:text-4xl font-extrabold text-[#22A06B] tracking-tight" />
              <p className="text-xs sm:text-sm font-bold text-[#172B3A] mt-1">Successful Appointments</p>
              <p className="text-[11px] text-slate-400">Zero double bookings</p>
            </div>
            <div>
              <AnimatedCounter value={99.4} decimals={1} suffix="%" className="text-3xl sm:text-4xl font-extrabold text-[#146C94] tracking-tight" />
              <p className="text-xs sm:text-sm font-bold text-[#172B3A] mt-1">Happy Patients</p>
              <p className="text-[11px] text-slate-400">5-star verified satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: OUR SERVICES */}
      <section className="py-20 bg-[#F6FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Unified Clinical Ecosystem"
            title="Comprehensive Services For"
            highlight="Every Step of Your Care"
            subtitle="Explore our end-to-end digital health capabilities designed for seamless patient and doctor interactions."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <motion.div
                  key={srv.title}
                  whileHover={{ y: -6, boxShadow: '0 20px 30px -10px rgba(20, 108, 148, 0.1)' }}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl ${srv.color} flex items-center justify-center mb-6 shadow-sm`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-bold text-[#172B3A] group-hover:text-[#146C94] transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={srv.link}
                      className="text-xs font-bold text-[#146C94] group-hover:text-[#19A7A1] flex items-center gap-1 transition-colors"
                    >
                      Learn More <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: FIND YOUR DOCTOR */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e8f7f6] text-[#146C94] border border-[#72D6CB]/40 mb-2">
                Certified Clinical Directory
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B3A] tracking-tight">
                Top Rated <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#146C94] to-[#19A7A1]">Physicians</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Book immediate video appointments or hospital outpatient visits with leading doctors.
              </p>
            </div>

            <Link to="/doctors">
              <Button variant="outline" size="md" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                View All Doctors
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW IT WORKS (Animated 4-Step Timeline) */}
      <section className="py-20 bg-[#F6FAFC] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Simplified Patient Journey"
            title="How MediConnect"
            highlight="Works For You"
            subtitle="Four easy steps to connect with licensed healthcare providers and take control of your health."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { step: '01', title: 'Search for a Doctor', desc: 'Filter verified doctors by clinical specialty, location, consultation fee and real patient ratings.' },
              { step: '02', title: 'Choose Appointment', desc: 'Select between an encrypted online video session or an in-clinic hospital outpatient visit.' },
              { step: '03', title: 'Consult Your Doctor', desc: 'Join with one click on any device, discuss symptoms, share prior labs and receive expert medical care.' },
              { step: '04', title: 'Manage Healthcare', desc: 'Access your instant digital e-prescriptions, follow-up schedule and lab documents anytime.' }
            ].map((item, idx) => (
              <div
                key={item.step}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card flex flex-col justify-between relative group hover:border-[#146C94]/40 transition-colors"
              >
                <div>
                  <span className="text-3xl font-extrabold text-[#19A7A1]/30 group-hover:text-[#19A7A1] transition-colors block mb-4 font-mono">
                    {item.step}
                  </span>
                  <h3 className="text-base font-bold text-[#172B3A]">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: ONLINE TELEMEDICINE PREVIEW */}
      <section className="py-20 bg-gradient-to-br from-[#172B3A] via-[#103b4f] to-[#146C94] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-[#72D6CB] border border-white/20">
                <Video className="w-3.5 h-3.5" /> Next-Gen Telehealth
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Private, Secure <span className="text-[#72D6CB]">Video Consultations</span> from Home
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Experience crystal-clear medical video conferencing. Share previous labs and ECG records directly with your doctor, receive live clinical advice, and download your verified e-prescription instantly.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#72D6CB]" />
                  <span>No special apps required – works in any modern browser</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#72D6CB]" />
                  <span>End-to-end WebRTC 256-bit HIPAA compliance</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#72D6CB]" />
                  <span>Integrated real-time vital telemetry overlay</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/consultation/apt-101">
                  <Button variant="accent" size="lg" icon={<Play className="w-4 h-4 fill-current" />}>
                    Start Telemedicine Consultation
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900 relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1594824813637-0245a4918e9d?auto=format&fit=crop&w=800&q=80"
                  alt="Doctor Telehealth Preview"
                  name="Dr. Telehealth"
                  fallbackType="hero"
                  className="w-full h-80 object-cover opacity-90"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-emerald-400 font-bold block flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
                    </span>
                    <span className="text-white font-medium">ECG Sinus Normal • Pulse 74 bpm</span>
                  </div>
                  <Link to="/consultation/apt-101">
                    <button className="px-3 py-1.5 bg-[#19A7A1] text-white font-bold rounded-xl text-xs hover:bg-[#148681]">
                      Join Session
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PATIENT DASHBOARD PREVIEW (Inspired by SynthCare & MedCare screenshots) */}
      <section className="py-20 bg-[#F6FAFC] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Unified Health Portal"
            title="Everything in One Place"
            highlight="Your Connected Patient Portal"
            subtitle="Take command of your health metrics, consultation history, real-time vital telemetry, and active prescriptions in a beautifully organized digital hub."
          />

          {/* Interactive Mockup Container */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-lg p-6 sm:p-10 relative">
            {/* Mockup top browser bar */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-slate-400 ml-2">portal.mediconnect.health/patient/dashboard</span>
              </div>
              <Link to="/patient/dashboard">
                <Button variant="outline" size="sm" className="text-xs">
                  Launch Live Portal <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Mockup Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Vitals & Recent activity */}
              <div className="lg:col-span-8 space-y-6">
                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Heart Rhythm</span>
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#146C94] mt-1">74 bpm</h4>
                    <span className="text-[10px] font-bold text-emerald-600">Optimal Resting</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Blood Pressure</span>
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#19A7A1] mt-1">118/76</h4>
                    <span className="text-[10px] font-bold text-emerald-600">Target Range</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Blood Glucose</span>
                    <h4 className="text-xl sm:text-2xl font-extrabold text-[#22A06B] mt-1">94 mg/dL</h4>
                    <span className="text-[10px] font-bold text-emerald-600">Normal Fasting</span>
                  </div>
                </div>

                {/* Mini Prescriptions & Health Records Preview */}
                <div className="p-5 rounded-2xl bg-[#F6FAFC] border border-slate-200/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-[#146C94]" /> Active Digital Prescriptions
                    </h4>
                    <span className="text-[10px] font-bold text-[#146C94]">Auto-synced</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Metoprolol Tartrate</p>
                        <p className="text-[11px] text-[#146C94] font-semibold">25 mg • Twice daily</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">Morning & Night</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Rosuvastatin Calcium</p>
                        <p className="text-[11px] text-[#146C94] font-semibold">10 mg • At bedtime</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">Bedtime</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Upcoming appointment card & Checklist */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#146C94] to-[#19A7A1] text-white shadow-md space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#72D6CB] uppercase text-[10px]">Upcoming Telehealth</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">Tomorrow</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80"
                      alt="Dr. Arman"
                      name="Dr. Arman Rahman"
                      fallbackType="doctor"
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/30"
                    />
                    <div>
                      <h5 className="font-extrabold text-sm">Dr. Arman Rahman</h5>
                      <p className="text-[11px] text-white/80">Cardiologist • 2:30 PM</p>
                    </div>
                  </div>
                  <Link to="/consultation/apt-101" className="block w-full">
                    <button className="w-full py-2 bg-white text-[#146C94] font-bold text-xs rounded-xl shadow-xs hover:bg-slate-50 transition-colors">
                      Enter Video Consultation
                    </button>
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Recent Health Activity</span>
                  <div className="text-xs text-slate-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22A06B]" />
                      <span>Lipid Blood Panel report uploaded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22A06B]" />
                      <span>12-Lead Resting ECG verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: HOSPITAL PARTNERS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e8f7f6] text-[#146C94] border border-[#72D6CB]/40 mb-2">
                Premier Medical Networks
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B3A] tracking-tight">
                Our Partner <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#146C94] to-[#19A7A1]">Hospitals</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Collaborating with top-tier multi-specialty centers and surgical institutions.
              </p>
            </div>

            <Link to="/hospitals">
              <Button variant="outline" size="md" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Explore All Hospitals
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hospitals.map((hosp) => (
              <HospitalCard key={hosp.id} hospital={hosp} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: TESTIMONIALS */}
      <section className="py-20 bg-[#F6FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Patient Stories"
            title="Trusted by Over"
            highlight="15 Million People"
            subtitle="Read real stories from patients and physicians who depend on MediConnect daily."
          />

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-card relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <ImageWithFallback
                src={testimonials[activeTestimonialIdx].avatar}
                alt={testimonials[activeTestimonialIdx].name}
                name={testimonials[activeTestimonialIdx].name}
                fallbackType="avatar"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#19A7A1]/20 shadow-md"
              />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-center sm:justify-start text-amber-400 gap-1">
                  {[...Array(testimonials[activeTestimonialIdx].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed">
                  "{testimonials[activeTestimonialIdx].quote}"
                </p>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {testimonials[activeTestimonialIdx].name}
                  </h4>
                  <p className="text-xs text-[#146C94] font-semibold">
                    {testimonials[activeTestimonialIdx].role}
                  </p>
                </div>
              </div>
            </div>

            {/* Carousel navigation controls */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveTestimonialIdx(prev => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-[#146C94] hover:bg-slate-50 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonialIdx(idx)}
                    className={`h-2 rounded-full transition-all ${
                      activeTestimonialIdx === idx ? 'w-8 bg-[#146C94]' : 'w-2 bg-slate-200'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveTestimonialIdx(prev => (prev + 1) % testimonials.length)}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-[#146C94] hover:bg-slate-50 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#146C94] via-[#105676] to-[#19A7A1] rounded-3xl p-8 sm:p-14 text-white shadow-xl text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[#72D6CB]">
                <Sparkles className="w-3.5 h-3.5" /> Start Your Healthcare Journey
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Your Health Deserves Better Connections.
              </h2>
              <p className="text-sm sm:text-base text-slate-200">
                Join thousands of patients and leading medical institutions. Register your free account in less than two minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link to="/register">
                  <Button variant="accent" size="lg">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                    Explore Doctors
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
