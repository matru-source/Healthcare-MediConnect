import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Video, 
  Calendar, 
  FileText, 
  Pill, 
  Activity, 
  ShieldCheck, 
  Stethoscope, 
  Zap, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';

export const ServicesPage: React.FC = () => {
  const serviceCategories = [
    {
      title: 'Cardiovascular Care',
      desc: 'Advanced ECG tele-monitoring, hypertension protocols, arrhythmia detection, and post-infarct cardiac rehabilitation.',
      icon: Heart,
      color: 'bg-rose-50 text-rose-600',
      badge: 'Popular',
      specialty: 'Cardiologist',
      features: ['Remote 12-lead ECG analysis', 'Lipid & cholesterol management', 'Heart failure telemetry', 'Pacemaker checkups']
    },
    {
      title: 'Telemedicine Consultations',
      desc: 'Encrypted HD browser-based video appointments with licensed medical specialists across 18+ sub-specialties.',
      icon: Video,
      color: 'bg-sky-50 text-[#146C94]',
      badge: '24/7 Available',
      specialty: 'General Physician',
      features: ['One-click WebRTC room entry', 'Real-time chat & file sharing', 'Screen sharing for radiology', 'Instant e-prescriptions']
    },
    {
      title: 'Smart Scheduling Engine',
      desc: 'Automated hospital & clinic appointment booking with zero double-booking algorithm and instant SMS/email confirmations.',
      icon: Calendar,
      color: 'bg-teal-50 text-[#19A7A1]',
      badge: 'Instant Confirmation',
      specialty: 'All',
      features: ['Slot collision prevention', 'Automated reminders', 'Real-time doctor calendar sync', 'Free cancellation up to 2h']
    },
    {
      title: 'Encrypted Health Records Vault',
      desc: 'Secure digital locker for all your lab results, imaging scans, and clinical discharge summaries with granular access controls.',
      icon: FileText,
      color: 'bg-indigo-50 text-indigo-600',
      badge: 'HIPAA Compliant',
      specialty: 'General Physician',
      features: ['256-bit AES encryption', 'DICOM & PDF support', 'Doctor access permissions', 'Biometric security locks']
    },
    {
      title: 'E-Prescription & Pharmacy Sync',
      desc: 'Digitally signed prescriptions delivered straight to your patient portal and routed automatically to your preferred pharmacy.',
      icon: Pill,
      color: 'bg-amber-50 text-amber-600',
      badge: 'Auto Refills',
      specialty: 'General Physician',
      features: ['Structured morning/noon/night dosage', 'Drug interaction checks', 'Refill alert reminders', 'Printable PDF Rx vouchers']
    },
    {
      title: 'Diagnostic & Lab Integration',
      desc: 'Direct synchronization with accredited partner hospital labs for faster test result turnaround and historical trending.',
      icon: Activity,
      color: 'bg-emerald-50 text-[#22A06B]',
      badge: 'Rapid Results',
      specialty: 'Cardiologist',
      features: ['Automated lab notifications', 'Visual biomarker trends', 'Specialist review annotations', 'Direct doctor callback']
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F6FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Specialized Medical Offerings"
          title="Clinical Services Built for"
          highlight="Precision & Compassion"
          subtitle="Explore our comprehensive array of digital health services and hospital-backed specialized care pathways."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategories.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                whileHover={{ y: -6, boxShadow: '0 20px 30px -10px rgba(20, 108, 148, 0.1)' }}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#172B3A]">{s.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.desc}</p>

                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    {s.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#19A7A1]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link to={s.specialty !== 'All' ? `/appointments/book?specialty=${encodeURIComponent(s.specialty)}` : '/appointments/book'}>
                    <Button variant="primary" size="sm" className="text-xs">
                      Book This Service
                    </Button>
                  </Link>
                  <Link to={s.specialty !== 'All' ? `/doctors?specialty=${encodeURIComponent(s.specialty)}` : '/doctors'}>
                    <span className="text-xs font-bold text-[#146C94] hover:text-[#19A7A1] flex items-center gap-1">
                      Find Specialist <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
