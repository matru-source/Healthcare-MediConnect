import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Calendar as CalendarIcon, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface DashboardNavbarProps {
  title?: string;
  subtitle?: string;
}

export const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ title, subtitle }) => {
  const { user, role, switchRole } = useAuth();
  const { notifications, unreadCount, markAllAsRead, addToast } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addToast('EHR Vault Query', `Filtering clinical records and provider directory for "${searchTerm.trim()}".`, 'info');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#172B3A] tracking-tight flex items-center gap-2">
          {title || `Good Morning, ${user?.name?.split(' ')[0] || 'User'}!`} 👋
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {subtitle || "Here is your unified health overview and medical schedule for today."}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-64 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records, doctors, prescriptions..."
            className="w-full pl-9 pr-4 py-2 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs text-[#172B3A] placeholder:text-slate-400 focus:outline-none focus:border-[#146C94] focus:bg-white transition-all font-medium"
          />
        </form>

        {/* Date badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F6FAFC] border border-slate-200 text-xs font-semibold text-slate-600">
          <CalendarIcon className="w-3.5 h-3.5 text-[#146C94]" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="View notifications"
            className="p-2 rounded-xl text-slate-600 hover:text-[#146C94] hover:bg-[#EEF4F8] transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-extrabold text-slate-900 text-sm">Clinical Alerts</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-bold text-[#146C94] hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        n.read ? 'bg-white border-slate-100' : 'bg-sky-50/50 border-sky-100'
                      }`}
                    >
                      <p className="font-bold text-slate-800 text-xs">{n.title}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Role preview pill */}
        <div className="flex items-center bg-[#EEF4F8] p-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
          <button
            onClick={() => switchRole('patient')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              role === 'patient' ? 'bg-white text-[#146C94] shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => switchRole('hospital_admin')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              role === 'hospital_admin' ? 'bg-white text-[#146C94] shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Hospital
          </button>
        </div>
      </div>
    </header>
  );
};
