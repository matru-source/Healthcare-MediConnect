import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Calendar, 
  Video, 
  Users, 
  SlidersHorizontal,
  X,
  Stethoscope
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { Doctor } from '../types';
import { DoctorCard } from '../components/doctors/DoctorCard';
import { Button } from '../components/common/Button';

export const DoctorsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialHospital = searchParams.get('hospital') || '';
  const initialSpecialty = searchParams.get('specialty') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty);
  const [selectedConsultationType, setSelectedConsultationType] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'priceAsc' | 'priceDesc'>('rating');
  const [quickFilter, setQuickFilter] = useState<'All' | 'Available Today' | 'Lowest Fee' | 'Most Experienced' | 'Top Rated'>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [minExperience, setMinExperience] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const allDoctors = storageService.getDoctors();

  const specialties = ['All', 'Cardiologist', 'Dermatologist', 'General Physician', 'Orthopedic Specialist', 'Neurologist', 'Pediatrician', 'Endocrinologist'];

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(doc => {
      // Search query (doctor name, specialty, bio, or hospital)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialty.toLowerCase().includes(q);
        const matchesHosp = doc.hospitalName.toLowerCase().includes(q);
        const matchesWhat = doc.whatItHelpsWith.some(w => w.toLowerCase().includes(q));
        if (!matchesName && !matchesSpec && !matchesHosp && !matchesWhat) return false;
      }

      // Hospital query from URL
      if (initialHospital && !doc.hospitalName.toLowerCase().includes(initialHospital.toLowerCase())) {
        return false;
      }

      // Specialty filter
      if (selectedSpecialty !== 'All' && doc.specialty !== selectedSpecialty) {
        return false;
      }

      // Consultation type
      if (selectedConsultationType === 'online' && !doc.consultationTypes.includes('online')) {
        return false;
      }
      if (selectedConsultationType === 'in_person' && !doc.consultationTypes.includes('in_person')) {
        return false;
      }

      // Rating filter
      if (doc.rating < minRating) return false;

      // Price filter
      if (doc.consultationFee > maxPrice) return false;

      // Experience filter
      if (doc.experienceYears < minExperience) return false;

      // Location filter
      if (selectedLocation !== 'All' && !doc.hospitalName.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      // Quick filter pill
      if (quickFilter === 'Available Today' && !doc.nextAvailable.toLowerCase().includes('today')) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (quickFilter === 'Lowest Fee' || sortBy === 'priceAsc') return a.consultationFee - b.consultationFee;
      if (sortBy === 'priceDesc') return b.consultationFee - a.consultationFee;
      if (quickFilter === 'Most Experienced' || sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (quickFilter === 'Top Rated' || sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [allDoctors, searchQuery, selectedSpecialty, selectedConsultationType, minRating, maxPrice, minExperience, selectedLocation, sortBy, quickFilter, initialHospital]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F6FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#e8f7f6] text-[#146C94] border border-[#72D6CB]/40 mb-2">
                <Stethoscope className="w-3.5 h-3.5" /> 84+ Verified Specialists
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B3A] tracking-tight">
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#146C94] to-[#19A7A1]">Doctor</span>
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Search by name, clinical specialty, or symptoms. Compare verified reviews and book instant consultations.
              </p>
            </div>

            {/* Sorting control */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort doctors by"
                className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-[#146C94] shadow-xs"
              >
                <option value="rating">Top Rated (Highest)</option>
                <option value="experience">Most Experienced</option>
                <option value="priceAsc">Consultation Fee (Low to High)</option>
                <option value="priceDesc">Consultation Fee (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Search bar & filter pills (matching assets/like this2.jpg) */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try 'Cardiologist', 'Dr. Arman', 'Hypertension', 'Mayo Clinic'..."
                className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm text-[#172B3A] placeholder:text-slate-400 focus:outline-none focus:border-[#146C94] focus:ring-2 focus:ring-[#146C94]/10 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Specialty dropdown on mobile/tablet */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              aria-label="Filter by specialty"
              className="bg-white border border-slate-200 text-sm font-semibold text-slate-700 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#146C94] shadow-sm sm:w-56"
            >
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec === 'All' ? 'All Specialties' : spec}</option>
              ))}
            </select>
          </div>

          {/* Quick Filter Pills (like this2.jpg) */}
          <div className="mt-4 flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
            <div className="flex items-center gap-2">
              {(['All', 'Available Today', 'Lowest Fee', 'Most Experienced', 'Top Rated'] as const).map(pill => (
                <button
                  key={pill}
                  onClick={() => setQuickFilter(pill)}
                  className={`px-4 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                    quickFilter === pill
                      ? 'bg-[#146C94] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Toggle Advanced Filters Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                showAdvancedFilters
                  ? 'bg-[#146C94] text-white border-[#146C94]'
                  : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(minRating > 0 || maxPrice < 100 || minExperience > 0 || selectedLocation !== 'All' || selectedConsultationType !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-[#19A7A1]" />
              )}
            </button>
          </div>

          {/* Active Filter Chips */}
          {(initialHospital || selectedSpecialty !== 'All' || searchQuery) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">Active Filters:</span>
              {initialHospital && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#146C94] border border-[#146C94]/20 font-bold">
                  Hospital: {initialHospital}
                  <button
                    onClick={() => {
                      searchParams.delete('hospital');
                      setSearchParams(searchParams);
                    }}
                    className="hover:text-red-500 transition-colors ml-0.5"
                    aria-label="Remove hospital filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {selectedSpecialty !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#19A7A1] border border-[#19A7A1]/20 font-bold">
                  Specialty: {selectedSpecialty}
                  <button
                    onClick={() => {
                      setSelectedSpecialty('All');
                      searchParams.delete('specialty');
                      setSearchParams(searchParams);
                    }}
                    className="hover:text-red-500 transition-colors ml-0.5"
                    aria-label="Remove specialty filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
                  "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-red-500 transition-colors ml-0.5"
                    aria-label="Clear search text"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Advanced Filters Expandable Drawer */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm text-xs space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Location Filter */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Hospital Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F6FAFC] border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-[#146C94]"
                    >
                      <option value="All">All Locations</option>
                      <option value="Apex">Apex Heart Institute (Manhattan)</option>
                      <option value="St. Jude">St. Jude Medical Center (Brooklyn)</option>
                      <option value="Mayo">Mayo Health Network (Rochester)</option>
                      <option value="Pacific">Pacific Neuroscience (Seattle)</option>
                    </select>
                  </div>

                  {/* Consultation Type */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Consultation Mode</label>
                    <select
                      value={selectedConsultationType}
                      onChange={(e) => setSelectedConsultationType(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F6FAFC] border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-[#146C94]"
                    >
                      <option value="all">All (Online & In-Person)</option>
                      <option value="online">Online Telemedicine Only</option>
                      <option value="in_person">In-Person Outpatient Only</option>
                    </select>
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Min Patient Rating</label>
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#F6FAFC] border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-[#146C94]"
                    >
                      <option value={0}>Any Rating</option>
                      <option value={4.8}>4.8+ Stars</option>
                      <option value={4.9}>4.9+ Stars</option>
                    </select>
                  </div>

                  {/* Max Fee Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">Max Consultation Fee</label>
                      <span className="font-bold text-[#146C94]">${maxPrice}</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={100}
                      step={5}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#146C94]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Filtered: {filteredDoctors.length} matched</span>
                  <button
                    onClick={() => {
                      setMinRating(0);
                      setMaxPrice(100);
                      setMinExperience(0);
                      setSelectedLocation('All');
                      setSelectedConsultationType('all');
                      setSelectedSpecialty('All');
                      setQuickFilter('All');
                      setSearchQuery('');
                      setSearchParams({});
                    }}
                    className="text-xs font-bold text-red-500 hover:underline"
                  >
                    Reset All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {initialHospital && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200 rounded-xl text-xs text-[#146C94]">
              <span>Filtering by partner hospital: <strong>{initialHospital}</strong></span>
              <button onClick={() => setSearchParams({})} className="hover:text-red-500 font-bold ml-1">✕</button>
            </div>
          )}
        </div>

        {/* Doctor Grid & Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-500">
              Showing <strong className="text-slate-800">{filteredDoctors.length}</strong> available doctors
            </p>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/70 shadow-xs">
              <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No matching doctors found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Try loosening your filters, changing the specialty, or searching by generic symptom name.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialty('All');
                  setQuickFilter('All');
                  setSearchParams({});
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDoctors.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
