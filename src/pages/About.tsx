import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, Users, Award, Target, Sparkles, Building2 } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';

export const AboutPage: React.FC = () => {
  const values = [
    { title: 'Clinical Rigor', desc: 'Every medical professional is thoroughly vetted against national licensing boards before onboarding.', icon: ShieldCheck },
    { title: 'Patient Centered', desc: 'Designed to eliminate friction, reducing average wait times from 3 weeks to under 2 hours.', icon: Heart },
    { title: 'Data Privacy First', desc: 'All telemetry, chat histories, and records are protected by zero-knowledge 256-bit AES encryption.', icon: Award },
    { title: 'Unified Ecosystem', desc: 'Bridging outpatient diagnostic labs, tertiary surgical centers, and home care seamlessly.', icon: Target }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F6FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="About MediConnect"
          title="Pioneering the Future of"
          highlight="Connected Healthcare"
          subtitle="MediConnect was founded by physicians and engineers to solve healthcare fragmentation and empower patients worldwide."
        />

        {/* Mission & Vision split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-card space-y-3">
            <span className="text-xs font-bold text-[#146C94] uppercase tracking-wider">Our Mission</span>
            <h3 className="text-2xl font-extrabold text-[#172B3A]">To make world-class healthcare universally accessible.</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We eliminate geographical and administrative barriers by connecting patients directly with accredited specialists, transparent pricing, and instant digital prescriptions.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-card space-y-3">
            <span className="text-xs font-bold text-[#19A7A1] uppercase tracking-wider">Our Vision</span>
            <h3 className="text-2xl font-extrabold text-[#172B3A]">A zero-wait, interconnected clinical ecosystem.</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              A healthcare landscape where a patient's medical records, diagnostic telemetry, and physician care teams operate in perfect digital harmony with zero data silos.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16">
          <h3 className="text-center text-xl font-extrabold text-[#172B3A] mb-8">Our Core Principles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#e8f7f6] text-[#146C94] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#172B3A]">{v.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
