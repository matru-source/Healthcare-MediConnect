import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Menu, 
  X, 
  Bell, 
  ChevronDown, 
  User, 
  LogOut, 
  Calendar, 
  FileText, 
  Hospital, 
  ShieldCheck,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from './Button';
import { ImageWithFallback } from './ImageWithFallback';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

  const { user, role, isAuthenticated, logout, switchRole } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotificationDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Doctors', path: '/doctors' },
    { name: 'Hospitals', path: '/hospitals' },
    { name: 'Services', path: '/services' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDashboardPath = () => {
    if (role === 'hospital_admin') return '/hospital/dashboard';
    return '/patient/dashboard';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/60 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.05 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#146C94] to-[#19A7A1] flex items-center justify-center text-white shadow-md shadow-[#146C94]/25"
            >
              <Activity className="w-5 h-5 text-white stroke-[2.5]" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#172B3A] group-hover:text-[#146C94] transition-colors">
                Medi<span className="text-[#19A7A1]">Connect</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#718096] -mt-1">
                Unified Healthcare
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#146C94] font-semibold'
                      : 'text-[#172B3A]/80 hover:text-[#146C94] hover:bg-slate-100/60'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#19A7A1] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Demo Role Selector pill */}
            <div className="hidden xl:flex items-center bg-[#EEF4F8] border border-slate-200/80 rounded-full p-1 text-xs font-semibold text-[#172B3A]">
              <span className="px-2 text-slate-500 text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#19A7A1]" /> Preview:
              </span>
              <button
                onClick={() => switchRole('patient')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  role === 'patient'
                    ? 'bg-white text-[#146C94] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-[#146C94]'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => switchRole('hospital_admin')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  role === 'hospital_admin'
                    ? 'bg-white text-[#146C94] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-[#146C94]'
                }`}
              >
                Hospital
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                className="relative p-2.5 rounded-xl text-[#172B3A] hover:bg-[#EEF4F8] transition-colors focus:outline-none"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E05252] text-[10px] font-bold text-white shadow">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {notificationDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-slate-100 p-4 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h4 className="font-bold text-sm text-[#172B3A]">Notifications</h4>
                        <p className="text-xs text-slate-500">{unreadCount} unread updates</p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-[#146C94] hover:text-[#19A7A1] font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="mt-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-xs text-slate-400">No notifications yet</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              if (notif.link) navigate(notif.link);
                              setNotificationDropdownOpen(false);
                            }}
                            className={`py-3 px-2 flex items-start gap-3 cursor-pointer rounded-lg transition-colors ${
                              notif.read ? 'hover:bg-slate-50' : 'bg-[#e8f7f6]/40 hover:bg-[#e8f7f6]/70'
                            }`}
                          >
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-[#19A7A1] shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#172B3A]">{notif.title}</p>
                              <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#EEF4F8] transition-colors focus:outline-none"
                >
                  <ImageWithFallback
                    src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name || 'User Profile'}
                    name={user?.name || 'User'}
                    fallbackType="avatar"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#19A7A1]/40"
                  />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-[#172B3A] leading-tight">{user?.name}</p>
                    <p className="text-[11px] text-[#19A7A1] font-semibold capitalize">{user?.role?.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 text-sm"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="font-bold text-slate-800 text-xs">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-[#EEF4F8] hover:text-[#146C94]"
                      >
                        <Activity className="w-4 h-4 text-[#19A7A1]" />
                        <span>Portal Dashboard</span>
                      </Link>

                      {role === 'patient' && (
                        <>
                          <Link
                            to="/patient/records"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-[#EEF4F8] hover:text-[#146C94]"
                          >
                            <FileText className="w-4 h-4 text-[#19A7A1]" />
                            <span>My Health Records</span>
                          </Link>
                          <Link
                            to="/patient/prescriptions"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-[#EEF4F8] hover:text-[#146C94]"
                          >
                            <Stethoscope className="w-4 h-4 text-[#19A7A1]" />
                            <span>Prescriptions</span>
                          </Link>
                        </>
                      )}

                      {role === 'hospital_admin' && (
                        <Link
                          to="/hospital/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-[#EEF4F8] hover:text-[#146C94]"
                        >
                          <Hospital className="w-4 h-4 text-[#19A7A1]" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-[#E05252] hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-4 shadow-xl"
          >
            <div className="flex flex-col space-y-3">
              {isAuthenticated && user && (
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
                      alt={user?.name || 'User Profile'}
                      name={user?.name || 'User'}
                      fallbackType="avatar"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#19A7A1]/40"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#172B3A]">{user.name}</p>
                      <p className="text-[11px] text-[#19A7A1] font-semibold capitalize">{user.role?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                      {unreadCount} Alerts
                    </span>
                  )}
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3 py-2 rounded-lg font-medium text-slate-800 hover:text-[#146C94] hover:bg-slate-50"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between py-2 text-xs text-slate-500 font-semibold">
                  <span>Switch Role Mode:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => switchRole('patient')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${
                        role === 'patient' ? 'bg-[#146C94] text-white' : 'bg-slate-100'
                      }`}
                    >
                      Patient
                    </button>
                    <button
                      onClick={() => switchRole('hospital_admin')}
                      className={`px-3 py-1 rounded-md text-xs font-semibold ${
                        role === 'hospital_admin' ? 'bg-[#146C94] text-white' : 'bg-slate-100'
                      }`}
                    >
                      Hospital Admin
                    </button>
                  </div>
                </div>

                <Link to={getDashboardPath()} className="w-full">
                  <Button variant="secondary" fullWidth size="md">
                    Go to Portal Dashboard
                  </Button>
                </Link>

                {!isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link to="/login">
                      <Button variant="outline" fullWidth size="md">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="primary" fullWidth size="md">
                        Register
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={logout}
                    className="w-full py-2.5 text-center text-sm font-semibold text-red-600 bg-red-50 rounded-xl"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
