import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, AlertCircle, ShieldCheck, ChevronRight, UserCheck } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

interface Hotspot {
  id: string;
  name: string;
  top: string;
  left: string;
  organ: string;
  condition: string;
  doctor: string;
  status: 'monitoring' | 'resolved' | 'attention';
  description: string;
  image: string;
}

export const AnatomicalModel: React.FC = () => {
  const { addToast } = useNotification();
  const [selectedHotspot, setSelectedHotspot] = useState<string>('heart');

  const hotspots: Hotspot[] = [
    {
      id: 'heart',
      name: 'Heart Condition',
      top: '28%',
      left: '48%',
      organ: 'Cardiovascular System',
      condition: 'Benign Sinus Tachycardia (Controlled)',
      doctor: 'Dr. Arman Rahman',
      status: 'monitoring',
      description: 'Coronary artery flow is clear. Resting pulse 72 bpm. Under mild beta-blocker therapy.',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'kidney',
      name: 'Renal Function',
      top: '46%',
      left: '42%',
      organ: 'Kidneys & Filtration',
      condition: 'eGFR 98 mL/min (Optimal)',
      doctor: 'Dr. James Miller',
      status: 'resolved',
      description: 'Creatinine and hydration markers within perfect physiological range.',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'knee',
      name: 'Knee Joint',
      top: '72%',
      left: '43%',
      organ: 'Left Patellar Joint',
      condition: 'Patellofemoral Mild Strain',
      doctor: 'Dr. Rehan Mahmud',
      status: 'monitoring',
      description: 'Cartilage intact. Prescribed strengthening physiotherapy exercises twice weekly.',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const current = hotspots.find(h => h.id === selectedHotspot) || hotspots[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[#172B3A]">History of Diagnosis</h3>
          <p className="text-xs text-slate-500">Interactive organ health telemetry & clinical reports</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#e8f7f6] text-[#19A7A1] border border-[#72D6CB]/30">
          3 Monitored Areas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
        {/* Anatomical Human illustration with animated interactive pulsing hotspots */}
        <div className="md:col-span-5 flex justify-center relative py-4">
          <div className="relative w-48 h-80 sm:w-56 sm:h-96 bg-gradient-to-b from-[#e8f7f6]/40 via-white to-slate-50 rounded-3xl border border-slate-200/70 p-4 flex items-center justify-center shadow-inner">
            {/* SVG stylized anatomical human silhouette */}
            <svg
              viewBox="0 0 200 400"
              className="w-full h-full text-slate-300 stroke-slate-300 fill-slate-100/90"
            >
              {/* Head */}
              <circle cx="100" cy="45" r="24" className="fill-[#146C94]/10 stroke-[#146C94]/30" strokeWidth="2" />
              {/* Neck */}
              <rect x="94" y="69" width="12" height="15" rx="3" className="fill-slate-200" />
              {/* Torso */}
              <path
                d="M 65 84 C 70 80, 130 80, 135 84 C 145 100, 140 160, 130 180 C 125 190, 75 190, 70 180 C 60 160, 55 100, 65 84 Z"
                className="fill-[#19A7A1]/10 stroke-[#19A7A1]/40"
                strokeWidth="2"
              />
              {/* Arms */}
              <path d="M 60 88 C 45 110, 40 150, 35 190" fill="none" stroke="#CBD5E1" strokeWidth="12" strokeLinecap="round" />
              <path d="M 140 88 C 155 110, 160 150, 165 190" fill="none" stroke="#CBD5E1" strokeWidth="12" strokeLinecap="round" />
              {/* Legs */}
              <path d="M 80 185 C 78 220, 75 270, 72 350" fill="none" stroke="#CBD5E1" strokeWidth="16" strokeLinecap="round" />
              <path d="M 120 185 C 122 220, 125 270, 128 350" fill="none" stroke="#CBD5E1" strokeWidth="16" strokeLinecap="round" />
            </svg>

            {/* Hotspots */}
            {hotspots.map((h) => {
              const isSelected = h.id === selectedHotspot;
              return (
                <button
                  key={h.id}
                  onClick={() => setSelectedHotspot(h.id)}
                  style={{ top: h.top, left: h.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none group z-10"
                >
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isSelected ? 'bg-[#19A7A1]' : 'bg-[#146C94]'
                    }`} />
                    <span className={`relative inline-flex rounded-full h-4 w-4 border-2 border-white items-center justify-center shadow-md ${
                      isSelected ? 'bg-[#19A7A1]' : 'bg-[#146C94]'
                    }`}>
                      <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected condition details & hotspot list */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex gap-2 pb-2 overflow-x-auto">
            {hotspots.map((h) => (
              <button
                key={h.id}
                onClick={() => setSelectedHotspot(h.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  h.id === selectedHotspot
                    ? 'bg-[#146C94] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {h.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-5 rounded-2xl bg-[#F6FAFC] border border-slate-200/80 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#146C94]">
                  {current.organ}
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  current.status === 'resolved' 
                    ? 'bg-emerald-100 text-[#22A06B]' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {current.status === 'resolved' ? 'Resolved' : 'Active Telemetry'}
                </span>
              </div>

              <h4 className="text-base font-extrabold text-[#172B3A]">{current.condition}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{current.description}</p>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#19A7A1]" />
                  <span className="text-slate-500 font-medium">Attending:</span>
                  <span className="font-bold text-slate-800">{current.doctor}</span>
                </div>
                <button
                  onClick={() => addToast('Diagnostic Imaging Viewer', `Accessing radiologic scans and high-resolution telemetry for ${current.name} (${current.condition}).`, 'info')}
                  className="text-xs font-bold text-[#146C94] hover:text-[#19A7A1] flex items-center gap-0.5"
                >
                  View Scans <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
