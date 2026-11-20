import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Video, Users, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Doctor } from '../../types';
import { Button } from '../common/Button';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface DoctorCardProps {
  doctor: Doctor;
  onQuickBook?: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onQuickBook }) => {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 20px 30px -10px rgba(20, 108, 148, 0.12)' }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-card relative overflow-hidden group"
    >
      {/* Top row: distance pill & availability status */}
      <div className="flex items-center justify-between mb-3">
        {doctor.distanceKm ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
            <MapPin className="w-3 h-3 text-[#146C94]" /> {doctor.distanceKm} km
          </span>
        ) : <div />}

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e8f7f6] text-[#19A7A1]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#19A7A1] animate-pulse" />
          {doctor.nextAvailable}
        </span>
      </div>

      {/* Doctor photo & main info */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <ImageWithFallback
            src={doctor.avatar}
            alt={doctor.name}
            name={doctor.name}
            fallbackType="doctor"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover object-top ring-4 ring-[#19A7A1]/20 group-hover:ring-[#19A7A1]/40 transition-all shadow-sm"
          />
          <div className="absolute -bottom-2 bg-white px-2 py-0.5 rounded-full shadow-xs border border-slate-100 flex items-center gap-1 text-[11px] font-bold text-slate-800">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{doctor.rating}</span>
            <span className="text-slate-400 font-normal">({doctor.reviewCount})</span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[#172B3A] group-hover:text-[#146C94] transition-colors mt-2">
          {doctor.name}
        </h3>
        <p className="text-xs font-semibold text-[#19A7A1] mt-0.5">{doctor.specialty}</p>
        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{doctor.hospitalName}</p>

        {/* Experience & consultation modes */}
        <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-600 py-2 border-y border-slate-100 w-full">
          <span>{doctor.experienceYears} yrs exp</span>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-2">
            {doctor.consultationTypes.includes('online') && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                <Video className="w-3 h-3 text-[#146C94]" /> Online
              </span>
            )}
            {doctor.consultationTypes.includes('in_person') && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                <Users className="w-3 h-3 text-[#19A7A1]" /> In-Person
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="mt-4 pt-1 flex items-center justify-between gap-2">
        <div>
          <span className="text-[11px] text-slate-400 block leading-tight">Starting at</span>
          <span className="text-lg font-extrabold text-[#172B3A]">${doctor.consultationFee}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Link to={`/doctors/${doctor.id}`}>
            <Button variant="ghost" size="sm" className="px-2.5 py-1.5 text-xs text-slate-600">
              Profile
            </Button>
          </Link>
          <Link to={`/appointments/book?doctorId=${doctor.id}`}>
            <Button variant="primary" size="sm" className="bg-[#146C94] hover:bg-[#0f5271] text-xs">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
