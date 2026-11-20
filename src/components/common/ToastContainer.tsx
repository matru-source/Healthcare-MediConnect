import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-[#22A06B]" />,
            warning: <AlertTriangle className="w-5 h-5 text-[#F4B740]" />,
            error: <AlertCircle className="w-5 h-5 text-[#E05252]" />,
            info: <Info className="w-5 h-5 text-[#146C94]" />
          };

          const borders = {
            success: 'border-[#22A06B]/30 bg-white',
            warning: 'border-[#F4B740]/30 bg-white',
            error: 'border-[#E05252]/30 bg-white',
            info: 'border-[#146C94]/30 bg-white'
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`pointer-events-auto p-4 rounded-xl shadow-lg border ${borders[toast.type]} flex items-start gap-3`}
            >
              <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-[#172B3A]">{toast.title}</h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
