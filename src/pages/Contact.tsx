import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, ChevronDown, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { useNotification } from '../context/NotificationContext';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters long')
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const { addToast } = useNotification();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const faqs = [
    {
      q: 'How quickly can I consult with a specialist?',
      a: 'Online video consultations can be booked for same-day slots in as little as 15 minutes, depending on physician availability.'
    },
    {
      q: 'Are digital prescriptions accepted at all pharmacies?',
      a: 'Yes. MediConnect e-prescriptions adhere to national DEA and NCPDP standards, cryptographically signed with the physician’s medical license token.'
    },
    {
      q: 'Is my medical data and chat history private?',
      a: 'Absolutely. We utilize 256-bit AES encryption at rest and TLS 1.3 in transit. We are fully HIPAA and GDPR compliant.'
    },
    {
      q: 'How does double-booking prevention work?',
      a: 'Our scheduling database utilizes transactional unique constraints on (doctor_id, date, slot), ensuring once a slot is reserved, it is instantly blocked across all platforms.'
    }
  ];

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API dispatch
    await new Promise(res => setTimeout(res, 600));
    setSubmitted(true);
    addToast('Message Dispatched', 'Our clinical triage team will respond within 2 hours.', 'success');
    reset();
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F6FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Get In Touch"
          title="We Are Here to"
          highlight="Assist You 24/7"
          subtitle="Have questions about consultation booking, hospital integration, or patient records? Reach out anytime."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-8">
          {/* Contact Details & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
              <h3 className="text-lg font-extrabold text-[#172B3A]">Emergency & Support Hotlines</h3>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#146C94] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-sm">+1 (800) 555-CARE (2273)</span>
                    <span className="text-slate-500">Toll-free 24/7 Medical Assistance</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#19A7A1] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-sm">support@mediconnect.health</span>
                    <span className="text-slate-500">Response within 2 hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#22A06B] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block text-sm">New York Global HQ</span>
                    <span className="text-slate-500">450 Lexington Ave, Suite 2200, New York, NY 10017</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-3">
              <h4 className="font-extrabold text-sm text-[#172B3A] mb-2">Frequently Asked Questions</h4>
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border-b border-slate-100 pb-2">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full py-2 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-[#146C94]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <p className="text-xs text-slate-500 pb-2 leading-relaxed">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form with Zod & React Hook Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-card">
            <h3 className="text-lg font-extrabold text-[#172B3A] mb-1">Send Us a Direct Message</h3>
            <p className="text-xs text-slate-500 mb-6">Our clinical concierge will route your inquiry to the right department.</p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#22A06B] mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">Message Delivered Successfully</h4>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Thank you for reaching out. A confirmation has been emailed to you and our triage team is reviewing your note.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="Jane Doe"
                      className={`w-full px-3.5 py-2.5 bg-[#F6FAFC] border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94] ${
                        errors.name ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="jane@example.com"
                      className={`w-full px-3.5 py-2.5 bg-[#F6FAFC] border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94] ${
                        errors.email ? 'border-red-400' : 'border-slate-200'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Inquiry Subject</label>
                  <input
                    type="text"
                    {...register('subject')}
                    placeholder="e.g. Appointment rescheduling, Hospital partnership, Records query"
                    className={`w-full px-3.5 py-2.5 bg-[#F6FAFC] border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94] ${
                      errors.subject ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Message</label>
                  <textarea
                    rows={4}
                    {...register('message')}
                    placeholder="Describe how we can assist you..."
                    className={`w-full px-3.5 py-2.5 bg-[#F6FAFC] border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94] ${
                      errors.message ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isSubmitting}
                  icon={<Send className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Send Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
