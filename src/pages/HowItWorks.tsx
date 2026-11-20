import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  Video, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Lock,
  Smartphone
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Search & Match With a Verified Specialist',
      desc: 'Browse through our accredited directory of board-certified doctors by clinical department, location, patient review scores, and upfront pricing. Filter by availability to find appointments today.',
      icon: Search,
      tag: 'Step 1'
    },
    {
      num: '02',
      title: 'Pick Format & Reserve an Available Time Slot',
      desc: 'Select whether you prefer a private video consultation from home or an in-person hospital outpatient visit. Choose your preferred day and time from live, conflict-free availability slots.',
      icon: Calendar,
      tag: 'Step 2'
    },
    {
      num: '03',
      title: 'Consult Seamlessly Over Encrypted Video',
      desc: 'Join your telehealth consultation with a single click. Share relevant medical history, review live health vitals with your doctor, and ask questions with total medical privacy.',
      icon: Video,
      tag: 'Step 3'
    },
    {
      num: '04',
      title: 'Receive Official E-Prescriptions & Care Plan',
      desc: 'Following consultation, your doctor immediately issues a signed digital prescription and clinical recommendations directly to your MediConnect portal, accessible anywhere.',
      icon: FileText,
      tag: 'Step 4'
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F6FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Seamless Patient Journey"
          title="How MediConnect Delivers"
          highlight="Frictionless Healthcare"
          subtitle="Everything you need to know about navigating consultations, booking, and medical record management."
        />

        {/* Steps Breakdown */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={st.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start gap-6 relative group hover:border-[#146C94]/40 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#146C94] to-[#19A7A1] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#146C94]/20 font-mono font-black text-xl">
                  {st.num}
                </div>

                <div className="flex-1 space-y-2">
                  <span className="text-xs font-bold text-[#19A7A1] uppercase tracking-wider">
                    {st.tag}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#172B3A]">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ or Security Callout */}
        <div className="mt-16 bg-gradient-to-r from-[#146C94] to-[#19A7A1] rounded-3xl p-8 sm:p-12 text-white shadow-xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl font-extrabold">Ready to schedule your first appointment?</h3>
            <p className="text-xs text-white/80">Zero waiting queues. Instant verification guaranteed.</p>
          </div>
          <Link to="/doctors">
            <Button variant="accent" size="lg">
              Explore Doctors Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
