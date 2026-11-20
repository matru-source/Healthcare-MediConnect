import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Prescription } from '../../types';

interface PrescriptionsWidgetProps {
  prescriptions: Prescription[];
}

export const PrescriptionsWidget: React.FC<PrescriptionsWidgetProps> = ({ prescriptions }) => {
  const currentRx = prescriptions[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[#172B3A]">Active Prescriptions</h3>
          <p className="text-xs text-slate-500">Current doctor prescribed dosages and schedules</p>
        </div>
        <Link
          to="/patient/prescriptions"
          className="text-xs font-bold text-[#146C94] hover:text-[#19A7A1] flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!currentRx ? (
        <p className="text-xs text-slate-400 py-6 text-center">No active prescriptions.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {currentRx.medications.map((med, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#F6FAFC] border border-slate-200/70 flex flex-col justify-between hover:border-[#19A7A1]/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#e8f7f6] flex items-center justify-center text-[#19A7A1]">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#172B3A]">{med.name}</h4>
                    <span className="text-xs font-semibold text-[#146C94]">{med.dosage}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {med.duration}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-3 line-clamp-1 italic">
                "{med.instructions}"
              </p>

              {/* Timing pills */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-2 text-[10px] font-semibold">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Schedule:
                </span>
                {med.timing.morning && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60">
                    Morning 1-pill
                  </span>
                )}
                {med.timing.afternoon && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/60">
                    Afternoon 1-pill
                  </span>
                )}
                {med.timing.evening && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    Evening 1-pill
                  </span>
                )}
                {med.timing.night && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60">
                    Bedtime 1-pill
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
