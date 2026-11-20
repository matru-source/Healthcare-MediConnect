import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Mail, Lock, User, ShieldCheck, ArrowRight, AlertCircle, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { UserRole } from '../types';
import { Button } from '../components/common/Button';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms of Service and HIPAA Privacy Notice.');
      return;
    }

    setIsLoading(true);
    setTimeout(async () => {
      await register(name.trim(), email.trim(), selectedRole);
      setIsLoading(false);
      addToast('Account Registered', 'Welcome to the MediConnect ecosystem!', 'success');
      if (selectedRole === 'hospital_admin' || selectedRole === 'doctor') {
        navigate('/hospital/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F6FAFC] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-card space-y-6">
          <div className="text-center space-y-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#146C94] to-[#19A7A1] flex items-center justify-center text-white shadow-md shadow-[#146C94]/25">
                <Activity className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <span className="text-2xl font-extrabold text-[#172B3A]">
                Medi<span className="text-[#19A7A1]">Connect</span>
              </span>
            </Link>
            <h2 className="text-xl font-extrabold text-[#172B3A]">Create Free Account</h2>
            <p className="text-xs text-slate-500">Join our connected digital medical network</p>
          </div>

          {/* Role selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1 text-xs">Select Your Role</label>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedRole('patient')}
                className={`py-2 rounded-xl transition-all ${
                  selectedRole === 'patient' ? 'bg-[#146C94] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('doctor')}
                className={`py-2 rounded-xl transition-all ${
                  selectedRole === 'doctor' ? 'bg-[#146C94] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('hospital_admin')}
                className={`py-2 rounded-xl transition-all ${
                  selectedRole === 'hospital_admin' ? 'bg-[#146C94] text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Hospital
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                  required
                />
              </div>
            </div>

            {(selectedRole === 'doctor' || selectedRole === 'hospital_admin') && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Medical License / Facility ID</label>
                <div className="relative">
                  <FileCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. MED-NY-84920"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password (Min 8 characters)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F6FAFC] border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#146C94]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded text-[#146C94] focus:ring-[#146C94]"
              />
              <label htmlFor="terms" className="text-slate-600 font-medium">
                I agree to the <span className="text-[#146C94] font-bold">Terms of Service</span> and <span className="text-[#146C94] font-bold">HIPAA Privacy Notice</span>.
              </label>
            </div>

            <Button
              variant="primary"
              size="md"
              type="submit"
              fullWidth
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Complete Registration
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#146C94] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
