import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Star, ShieldAlert, Award, ArrowRight } from 'lucide-react';
import { Hospital } from '../../types';
import { Button } from '../common/Button';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface HospitalCardProps {
  hospital: Hospital;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ hospital }) => {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 20px 30px -10px rgba(20, 108, 148, 0.12)' }}
      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card flex flex-col justify-between group"
    >
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <ImageWithFallback
          src={hospital.image}
          alt={hospital.name}
          name={hospital.name}
          fallbackType="hospital"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 pointer-events-none" />

        {/* Emergency Badge */}
        {hospital.emergencyAvailable && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#E05252] text-white shadow-md">
            <ShieldAlert className="w-3 h-3" /> 24/7 Emergency
          </span>
        )}

        {/* Rating */}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>{hospital.rating}</span>
          <span className="text-slate-400 text-[10px]">({hospital.reviewCount})</span>
        </span>

        {/* Bottom title on image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-extrabold text-base leading-tight drop-shadow-sm">{hospital.name}</h3>
          <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#72D6CB]" /> {hospital.location}
          </p>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {hospital.description}
        </p>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#F6FAFC] rounded-xl text-center border border-slate-100">
          <div>
            <span className="text-xs font-extrabold text-[#146C94]">{hospital.stats.beds}+</span>
            <span className="text-[10px] text-slate-500 block">Beds</span>
          </div>
          <div>
            <span className="text-xs font-extrabold text-[#19A7A1]">{hospital.totalDoctors}</span>
            <span className="text-[10px] text-slate-500 block">Doctors</span>
          </div>
          <div>
            <span className="text-xs font-extrabold text-[#22A06B]">{hospital.stats.successRate}%</span>
            <span className="text-[10px] text-slate-500 block">Success</span>
          </div>
        </div>

        {/* Specialties tags */}
        <div className="flex flex-wrap gap-1.5">
          {hospital.specialties.slice(0, 3).map((spec, idx) => (
            <span
              key={idx}
              className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#e8f7f6] text-[#146C94]"
            >
              {spec}
            </span>
          ))}
          {hospital.specialties.length > 3 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              +{hospital.specialties.length - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#19A7A1]" /> {hospital.phone}
          </span>
          <Link to={`/doctors?hospital=${encodeURIComponent(hospital.name)}`}>
            <Button variant="ghost" size="sm" className="text-xs text-[#146C94] font-bold p-0 hover:bg-transparent">
              View Doctors <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
