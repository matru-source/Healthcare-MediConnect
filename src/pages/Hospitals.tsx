import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Search, 
  ShieldAlert, 
  Star, 
  Bed, 
  Users, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { MOCK_HOSPITALS } from '../data/mockData';
import { HospitalCard } from '../components/hospitals/HospitalCard';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';

export const HospitalsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  const hospitals = MOCK_HOSPITALS;

  const filteredHospitals = hospitals.filter(h => {
    if (emergencyOnly && !h.emergencyAvailable) return false;
    if (selectedCity !== 'All' && !h.location.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = h.name.toLowerCase().includes(q);
      const matchLoc = h.location.toLowerCase().includes(q);
      const matchSpec = h.specialties.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchSpec) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F6FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e8f7f6] text-[#146C94] border border-[#72D6CB]/40 mb-2">
            <Building2 className="w-3.5 h-3.5" /> 120+ Partner Healthcare Networks
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B3A] tracking-tight">
            Partner <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#146C94] to-[#19A7A1]">Hospitals</span> & Centers
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Connect directly with leading acute care tertiary hospitals, specialized surgery institutes, and diagnostics.
          </p>

          {/* Search & Filters */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospital by name, specialty (e.g. Cardiology), or city..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-2xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#146C94] shadow-xs"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs focus:outline-none w-full sm:w-48"
            >
              <option value="All">All Locations</option>
              <option value="New York">New York</option>
              <option value="Minnesota">Minnesota</option>
              <option value="Washington">Washington</option>
            </select>

            <button
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                emergencyOnly
                  ? 'bg-[#E05252] text-white border-[#E05252]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              24/7 Emergency Only
            </button>
          </div>
        </div>

        {/* Hospital Card Grid */}
        {filteredHospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map(hosp => (
              <HospitalCard key={hosp.id} hospital={hosp} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-card space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#146C94] flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-[#172B3A]">No Partner Hospitals Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No medical facilities matched your query "{searchQuery || selectedCity}". Try clearing filters or selecting another metropolitan region.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('All');
                setEmergencyOnly(false);
              }}
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
