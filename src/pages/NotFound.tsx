import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  ArrowLeft, 
  Home, 
  Search, 
  Building2, 
  AlertCircle,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#F6FAFC] flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Badge with Medical Cross/Stethoscope */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative inline-flex items-center justify-center mb-8"
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#146C94] to-[#19A7A1] text-white flex items-center justify-center shadow-2xl shadow-[#146C94]/25 ring-8 ring-sky-100/60">
            <Stethoscope className="w-14 h-14" />
          </div>
          <span className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-extrabold bg-[#E05252] text-white shadow-md">
            404 Error
          </span>
        </motion.div>

        {/* Heading & Clinical Description */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3 mb-8"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-[#E05252] border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> Clinical Route Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B3A] tracking-tight">
            The Requested Page Is Unavailable
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            The medical directory, patient record, or hospital service link you requested does not exist or may have been relocated.
          </p>
        </motion.div>

        {/* Quick Pathways Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card mb-8 text-left"
        >
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Recommended Clinical Portals:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/doctors"
              className="p-4 rounded-2xl bg-[#F6FAFC] hover:bg-sky-50 border border-slate-200/80 hover:border-[#146C94]/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#146C94] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Search className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#146C94]">Find Doctors</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">84+ verified specialists</p>
            </Link>

            <Link
              to="/hospitals"
              className="p-4 rounded-2xl bg-[#F6FAFC] hover:bg-teal-50 border border-slate-200/80 hover:border-[#19A7A1]/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-[#19A7A1] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#19A7A1]">Partner Hospitals</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">120+ clinical networks</p>
            </Link>

            <Link
              to="/appointments/book"
              className="p-4 rounded-2xl bg-[#F6FAFC] hover:bg-emerald-50 border border-slate-200/80 hover:border-[#22A06B]/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#22A06B] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#22A06B]">Book Appointment</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Instant scheduling</p>
            </Link>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/">
            <Button variant="primary" size="md" icon={<Home className="w-4 h-4" />}>
              Return to Homepage
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="md" icon={<HelpCircle className="w-4 h-4" />}>
              Clinical Support
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
