import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Droplet, Activity, Eye, Zap, Wind } from 'lucide-react';

export const VitalsWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Heart' | 'Lungs' | 'Metabolic' | 'Body'>('Heart');

  const tabs = [
    { id: 'Heart', label: 'Heart', icon: Heart },
    { id: 'Lungs', label: 'Lungs', icon: Wind },
    { id: 'Metabolic', label: 'Metabolic', icon: Droplet },
    { id: 'Body', label: 'Body', icon: Activity },
  ] as const;

  const vitalsData = {
    Heart: [
      { label: 'Heart Rate', value: '74 bpm', status: 'Normal', color: 'text-[#22A06B]', bg: 'bg-emerald-50', icon: Heart },
      { label: 'Blood Pressure', value: '118/76 mmHg', status: 'Optimal', color: 'text-[#22A06B]', bg: 'bg-emerald-50', icon: Activity },
      { label: 'ECG Rhythm', value: 'Sinus Normal', status: 'Stable', color: 'text-[#146C94]', bg: 'bg-sky-50', icon: Zap },
      { label: 'Oxygen (SpO2)', value: '99%', status: 'Excellent', color: 'text-[#19A7A1]', bg: 'bg-teal-50', icon: Wind }
    ],
    Lungs: [
      { label: 'Respiration Rate', value: '16 breaths/min', status: 'Normal', color: 'text-[#22A06B]', bg: 'bg-emerald-50', icon: Wind },
      { label: 'Peak Flow', value: '480 L/min', status: 'Optimal', color: 'text-[#22A06B]', bg: 'bg-emerald-50', icon: Activity },
      { label: 'Lung Capacity', value: '4.6 L', status: 'Good', color: 'text-[#146C94]', bg: 'bg-sky-50', icon: Activity },
      { label: 'FEV1 / FVC', value: '82%', status: 'Normal', color: 'text-[#19A7A1]', bg: 'bg-teal-50', icon: Zap }
    ],
    Metabolic: [
      { label: 'Fasting Glucose', value: '94 mg/dL', status: 'Normal', color: 'text-[#22A06B]', bg: 'bg-emerald-50', icon: Droplet },
      { label: 'HbA1c', value: '5.4%', status: 'Non-diabetic', color: 'text-[#22A06B]', bg: 'bg-emerald-50', icon: Droplet },
      { label: 'Cholesterol Total', value: '185 mg/dL', status: 'Normal', color: 'text-[#146C94]', bg: 'bg-sky-50', icon: Activity },
      { label: 'Hemoglobin', value: '14.2 g/dL', status: 'Healthy', color: 'text-[#19A7A1]', bg: 'bg-teal-50', icon: Droplet }
    ],
    Body: [
      { label: 'Body Weight', value: '62 kg', status: 'BMI 21.8', color: 'text-[#22A06B]', bg: 'bg-emerald-50', icon: Activity },
      { label: 'Body Temperature', value: '98.4 °F', status: 'Normal', color: 'text-[#22A06B]', bg: 'bg-emerald-50', icon: Zap },
      { label: 'Hydration Level', value: '64%', status: 'Optimal', color: 'text-[#19A7A1]', bg: 'bg-teal-50', icon: Droplet },
      { label: 'Sleep Score', value: '8.2 hrs', status: 'Restorative', color: 'text-[#146C94]', bg: 'bg-sky-50', icon: Activity }
    ]
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[#172B3A]">Health Overview & Vitals</h3>
          <p className="text-xs text-slate-500">Live telemetry sync from medical devices and consultations</p>
        </div>

        {/* Tab selector */}
        <div className="flex items-center bg-[#F6FAFC] p-1 rounded-xl border border-slate-200/70">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#146C94] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#146C94]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {vitalsData[activeTab].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 rounded-2xl bg-[#F6FAFC] border border-slate-200/60 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">{item.label}</span>
                <span className={`p-1.5 rounded-lg ${item.bg}`}>
                  <Icon className="w-3.5 h-3.5 text-[#146C94]" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-xl font-extrabold text-[#172B3A] block">{item.value}</span>
                <span className={`text-[11px] font-bold ${item.color} mt-0.5 inline-block`}>
                  {item.status}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
