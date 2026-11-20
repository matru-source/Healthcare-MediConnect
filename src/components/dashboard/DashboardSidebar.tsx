import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Pill, 
  Video, 
  Bell, 
  Settings, 
  LogOut, 
  Building2, 
  Activity, 
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { user, role, logout, switchRole } = useAuth();
  const { unreadCount, addToast } = useNotification();
  const navigate = useNavigate();

  const patientNav = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/appointments/book', icon: Calendar },
    { name: 'Find Doctors', path: '/doctors', icon: Users },
    { name: 'Health Records', path: '/patient/records', icon: FileText },
    { name: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
    { name: 'Telemedicine', path: '/consultation/apt-101', icon: Video },
  ];

  const adminNav = [
    { name: 'Dashboard', path: '/hospital/dashboard', icon: LayoutDashboard },
    { name: 'Doctor Management', path: '/hospital/dashboard#doctors', icon: Users },
    { name: 'Appointments', path: '/hospital/dashboard#appointments', icon: Calendar },
    { name: 'Clinical Rooms', path: '/hospital/dashboard#rooms', icon: Building2 },
    { name: 'Diagnostics', path: '/patient/records', icon: FileText },
  ];

  const navItems = role === 'hospital_admin' ? adminNav : patientNav;

  return (
    <>
      {/* Mobile backdrop overlay when open on small screens */}
      {!collapsed && (
        <div
          onClick={onToggleCollapse}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 bg-white border-r border-slate-200/80 z-40 transition-all duration-300 flex flex-col justify-between ${
          collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'
        }`}
      >
      <div>
        {/* Brand header */}
        <div className="h-18 flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <NavLink to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#146C94] to-[#19A7A1] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#146C94]/20">
              <Activity className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-[#172B3A] tracking-tight">
                  Medi<span className="text-[#19A7A1]">Connect</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {role === 'hospital_admin' ? 'Hospital Admin' : 'Patient Portal'}
                </span>
              </div>
            )}
          </NavLink>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 hidden lg:block"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-1">
          <p className={`text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? '•••' : 'Main Menu'}
          </p>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/patient/dashboard' || item.path === '/hospital/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#146C94] text-white shadow-md shadow-[#146C94]/25'
                    : 'text-slate-600 hover:bg-[#EEF4F8] hover:text-[#146C94]'
                } ${collapsed ? 'justify-center px-0' : ''}`
              }
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer Area: Promo card & user profile */}
      <div className="p-3 space-y-3">
        {/* Mobile app teaser banner if not collapsed */}
        {!collapsed && (
          <div className="bg-gradient-to-br from-[#146C94] to-[#19A7A1] text-white p-4 rounded-2xl relative overflow-hidden shadow-lg shadow-[#146C94]/15">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs mb-2">
                <Sparkles className="w-3 h-3 text-[#72D6CB]" /> 1 Month Free
              </span>
              <p className="text-xs font-bold leading-tight">Have you tried our Mobile App?</p>
              <button
                onClick={() => addToast('MediConnect Mobile App', 'SMS install voucher sent to your registered phone.', 'info')}
                className="mt-3 w-full py-1.5 px-3 bg-white text-[#146C94] text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5" /> Download Now
              </button>
            </div>
          </div>
        )}

        {/* User Card */}
        <div className={`pt-2 border-t border-slate-100 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <ImageWithFallback
              src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
              alt={user?.name || 'User Profile'}
              name={user?.name || 'User'}
              fallbackType="avatar"
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-[#19A7A1]/30"
            />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-400 capitalize truncate">{role.replace('_', ' ')}</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
    </>
  );
};
