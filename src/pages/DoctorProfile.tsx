import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  Languages, 
  Award, 
  Video, 
  Users, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Building2,
  MessageSquare
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { MOCK_REVIEWS } from '../data/mockData';
import { Doctor } from '../types';
import { Button } from '../components/common/Button';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const doctors = storageService.getDoctors();
  const doctor = doctors.find(d => d.id === id);

  if (!doctor) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-[#F6FAFC] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 text-center shadow-card space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#146C94] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-[#172B3A]">Physician Profile Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The requested doctor ID does not match any accredited provider in our registry. Please select a doctor from the directory.
          </p>
          <Link to="/doctors">
            <Button variant="primary" size="md">
              Browse Doctor Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { user } = useAuth();
  const { addToast } = useNotification();
  const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [selectedDate, setSelectedDate] = useState<string>(tomorrowDate);
  const [selectedSlot, setSelectedSlot] = useState<string>(doctor.availableSlots[0] || '09:00 AM');
  const [consultationType, setConsultationType] = useState<'online' | 'in_person'>('online');
  const [isBioExpanded, setIsBioExpanded] = useState<boolean>(false);

  // Reviews state with real persistence
  const [reviewsList, setReviewsList] = useState(() => storageService.getReviews(doctor.id));
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState(user?.name || '');
  const [reviewComment, setReviewComment] = useState('');

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim()) {
      addToast('Reviewer Name Required', 'Please enter your name.', 'error');
      return;
    }
    if (!reviewComment.trim() || reviewComment.trim().length < 5) {
      addToast('Review Too Short', 'Please enter your clinical care feedback (at least 5 characters).', 'error');
      return;
    }

    storageService.addReview({
      doctorId: doctor.id,
      patientName: reviewAuthor.trim(),
      patientAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      rating: reviewRating,
      comment: reviewComment.trim()
    });

    setReviewsList(storageService.getReviews(doctor.id));
    setIsReviewModalOpen(false);
    setReviewComment('');
    addToast('Review Submitted', `Thank you for reviewing Dr. ${doctor.name}!`, 'success');
  };

  const handleBookNow = () => {
    navigate(`/appointments/book?doctorId=${doctor.id}&date=${selectedDate}&slot=${encodeURIComponent(selectedSlot)}&type=${consultationType}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F6FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back breadcrumb */}
        <div className="mb-6">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#146C94] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Doctor Discovery
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Profile Section (matching ref7.jpg) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card">
              {/* Doctor Header card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
                <ImageWithFallback
                  src={doctor.avatar}
                  alt={doctor.name}
                  name={doctor.name}
                  fallbackType="doctor"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover object-top ring-4 ring-[#19A7A1]/20 shadow-md"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B3A] tracking-tight">
                      {doctor.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#22A06B] border border-emerald-200/70">
                      <ShieldCheck className="w-3.5 h-3.5" /> License Verified
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[#19A7A1] mt-1">{doctor.specialty} • {doctor.qualifications}</p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-bold text-slate-800">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>{doctor.rating}</span>
                      <span className="text-slate-400 font-normal">({doctor.reviewCount} patient reviews)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#146C94]" />
                      <span>{doctor.hospitalName}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-8 border-b border-slate-100 pt-4 text-sm font-bold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 relative transition-colors ${
                    activeTab === 'overview' ? 'text-[#146C94]' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Overview
                  {activeTab === 'overview' && (
                    <motion.div
                      layoutId="tabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#146C94] rounded-full"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 relative transition-colors ${
                    activeTab === 'reviews' ? 'text-[#146C94]' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Reviews ({doctor.reviewCount})
                  {activeTab === 'reviews' && (
                    <motion.div
                      layoutId="tabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#146C94] rounded-full"
                    />
                  )}
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'overview' ? (
                <div className="pt-6 space-y-6">
                  {/* Key metadata grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Experience:</span>
                      <span className="font-bold text-slate-800">{doctor.experienceYears} years clinical practice</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Languages Spoken:</span>
                      <span className="font-bold text-slate-800">{doctor.languages.join(', ')}</span>
                    </div>
                  </div>

                  {/* What it will help with */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      What it will help with:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.whatItHelpsWith.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-[#e8f7f6] text-[#146C94] text-xs font-semibold border border-[#72D6CB]/30"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Biography with Read More / Show Less */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Doctor Biography:
                    </h4>
                    <p className={`text-sm text-slate-600 leading-relaxed ${!isBioExpanded && doctor.bio.length > 220 ? 'line-clamp-3' : ''}`}>
                      {doctor.bio}
                    </p>
                    {doctor.bio.length > 220 && (
                      <button
                        onClick={() => setIsBioExpanded(!isBioExpanded)}
                        className="mt-1 text-xs font-bold text-[#146C94] hover:text-[#19A7A1] transition-colors"
                      >
                        {isBioExpanded ? 'Show Less' : 'Read More'}
                      </button>
                    )}
                  </div>

                  {/* How to use? 3-step guide (from ref7.jpg) */}
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-[#172B3A] mb-4">How to use?</h4>
                    <div className="space-y-3.5">
                      <div className="flex items-start gap-3.5">
                        <div className="w-7 h-7 rounded-lg bg-[#e8f3f8] text-[#146C94] font-bold text-xs flex items-center justify-center shrink-0">
                          1
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#172B3A]">Book an online or in-person consultation</p>
                          <p className="text-xs text-slate-500">Select doctor, date and preferred available time slot.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <div className="w-7 h-7 rounded-lg bg-[#e8f3f8] text-[#146C94] font-bold text-xs flex items-center justify-center shrink-0">
                          2
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#172B3A]">Connect via HD Telemedicine or visit clinic</p>
                          <p className="text-xs text-slate-500">Receive private secure video link or hospital check-in token.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <div className="w-7 h-7 rounded-lg bg-[#e8f3f8] text-[#146C94] font-bold text-xs flex items-center justify-center shrink-0">
                          3
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#172B3A]">Get doctor's digital prescription & record</p>
                          <p className="text-xs text-slate-500">Instantly synced to your MediConnect patient portal.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Verified Patient Reviews</h4>
                      <p className="text-xs text-slate-500">{reviewsList.length} verified experiences</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<MessageSquare className="w-3.5 h-3.5" />}
                      onClick={() => setIsReviewModalOpen(true)}
                    >
                      Write a Review
                    </Button>
                  </div>

                  {reviewsList.map(review => (
                    <div key={review.id} className="p-4 rounded-2xl bg-[#F6FAFC] border border-slate-200/70">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <ImageWithFallback
                            src={review.patientAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt={review.patientName}
                            name={review.patientName}
                            fallbackType="avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800">{review.patientName}</span>
                            <span className="text-[10px] text-slate-400 block">{review.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sticky Booking Slot Card (matching ref7.jpg) */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card">
              <h3 className="text-base font-extrabold text-[#172B3A] mb-3">Select a slot</h3>

              {/* Consultation type toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F6FAFC] rounded-xl border border-slate-200/70 mb-4 text-xs font-bold">
                <button
                  onClick={() => setConsultationType('online')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    consultationType === 'online'
                      ? 'bg-[#146C94] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#146C94]'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" /> Video Call
                </button>
                <button
                  onClick={() => setConsultationType('in_person')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    consultationType === 'in_person'
                      ? 'bg-[#146C94] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#146C94]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> In-Person
                </button>
              </div>

              {/* Date selection */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 block mb-1.5">Consultation Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#146C94]"
                />
              </div>

              {/* Slot Grid (pills like ref7.jpg) */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Available Time Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {doctor.availableSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                        selectedSlot === slot
                          ? 'bg-[#146C94] text-white border-[#146C94] shadow-xs'
                          : 'bg-[#F6FAFC] text-slate-700 border-slate-200/80 hover:border-[#146C94]/40 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Fee & Continue */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Total Fee</span>
                  <span className="text-2xl font-extrabold text-[#172B3A]">${doctor.consultationFee}.00</span>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleBookNow}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Continue
                </Button>
              </div>
            </div>

            {/* Trust badge */}
            <div className="p-4 rounded-2xl bg-[#e8f7f6]/60 border border-[#72D6CB]/30 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-[#146C94] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#19A7A1]" /> Instant Confirmation Guarantee
              </p>
              <p className="text-[11px] text-slate-500">
                Cancel or reschedule anytime up to 2 hours before consultation with full instant refund.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Write a Review In-App Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review Dr. ${doctor.name}`}
      >
        <form onSubmit={handleCreateReview} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Your Rating *</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-600 ml-2">{reviewRating} of 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Your Name *</label>
            <input
              type="text"
              value={reviewAuthor}
              onChange={(e) => setReviewAuthor(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              required
              className="w-full px-3 py-2 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Clinical Experience Feedback *</label>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share how Dr. listened, diagnosed, and guided your care..."
              required
              className="w-full px-3 py-2 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsReviewModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
