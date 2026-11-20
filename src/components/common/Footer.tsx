import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  ArrowRight,
  Lock,
  Award,
  Clock,
  X
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const Footer: React.FC = () => {
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'hipaa' | null>(null);

  const legalContent = {
    privacy: {
      title: 'MediConnect Patient Privacy Policy',
      content: `MediConnect adheres to stringent global privacy standards. All Electronic Protected Health Information (ePHI) is encrypted at rest using 256-bit AES encryption and in transit via TLS 1.3. We never sell, monetize, or disclose your clinical consultations, diagnostic records, or personal demographics to unauthorized third parties.`
    },
    terms: {
      title: 'Platform Terms & Clinical Conditions of Service',
      content: `By utilizing MediConnect, you acknowledge that our platform connects verified patients with independent accredited medical professionals. Emergency cases requiring immediate acute resuscitation should contact local emergency dispatch (911) immediately. Prescriptions issued through MediConnect are cryptographically signed and compliant with DEA / NCPDP regulations.`
    },
    hipaa: {
      title: 'Notice of HIPAA Compliance & Security Safeguards',
      content: `MediConnect maintains technical, administrative, and physical safeguards in accordance with the Health Insurance Portability and Accountability Act (HIPAA) and HITECH requirements. Access to patient records is strictly restricted via role-based access control (RBAC), and every clinician access request is logged in immutable audit trails.`
    }
  };

  return (
    <footer className="bg-[#172B3A] text-white pt-16 pb-12 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#19A7A1]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#146C94]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-700/60">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#146C94] to-[#19A7A1] flex items-center justify-center text-white shadow-lg">
                <Activity className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Medi<span className="text-[#72D6CB]">Connect</span>
              </span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              The next-generation digital healthcare ecosystem uniting verified specialists, partner hospitals, diagnostic centers, and patients on a secure, encrypted clinical platform.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-[#72D6CB]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-[#72D6CB]">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit Encrypted</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#72D6CB] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/doctors" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#19A7A1]" /> Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#19A7A1]" /> Partner Hospitals
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#19A7A1]" /> Clinical Services
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#19A7A1]" /> How It Works
                </Link>
              </li>
              <li>
                <Link to="/appointments/book" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#19A7A1]" /> Book Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals & Resources */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#72D6CB] mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/patient/dashboard" className="hover:text-white transition-colors">
                  Patient Health Portal
                </Link>
              </li>
              <li>
                <Link to="/patient/records" className="hover:text-white transition-colors">
                  Medical Records Vault
                </Link>
              </li>
              <li>
                <Link to="/patient/prescriptions" className="hover:text-white transition-colors">
                  Digital Prescriptions
                </Link>
              </li>
              <li>
                <Link to="/hospital/dashboard" className="hover:text-white transition-colors">
                  Hospital Admin Suite
                </Link>
              </li>
              <li>
                <Link to="/consultation/apt-101" className="hover:text-white transition-colors">
                  Telemedicine Room
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#72D6CB] mb-4">
              Connect 24/7
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#19A7A1] shrink-0 mt-0.5" />
                <span>450 Lexington Ave, Suite 2200, New York, NY 10017</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#19A7A1] shrink-0" />
                <a href="tel:18005552273" className="hover:text-white transition-colors">
                  +1 (800) 555-CARE (2273)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#19A7A1] shrink-0" />
                <a href="mailto:care@mediconnect.health" className="hover:text-white transition-colors">
                  care@mediconnect.health
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#19A7A1] shrink-0" />
                <span>24/7 Emergency Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} MediConnect Inc. All rights reserved. Built with precision for modern healthcare.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setActiveLegalModal('privacy')}
              className="text-slate-400 hover:text-white transition-colors focus:outline-none"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveLegalModal('terms')}
              className="text-slate-400 hover:text-white transition-colors focus:outline-none"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActiveLegalModal('hipaa')}
              className="text-slate-400 hover:text-white transition-colors focus:outline-none"
            >
              HIPAA Notice
            </button>
          </div>
        </div>
      </div>

      {/* In-app Legal Disclosure Dialog */}
      <Modal
        isOpen={!!activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
        title={activeLegalModal ? legalContent[activeLegalModal].title : ''}
        maxWidth="lg"
      >
        {activeLegalModal && (
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <p className="p-4 rounded-2xl bg-[#F6FAFC] border border-slate-200">
              {legalContent[activeLegalModal].content}
            </p>
            <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-[11px] text-[#146C94] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#19A7A1] shrink-0" />
              <span>Verified and compliant with HHS and ONC health information technology requirements.</span>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setActiveLegalModal(null)}>
                Understood
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </footer>
  );
};
