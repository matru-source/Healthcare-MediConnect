import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { UserRole } from '../types';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [isLoading, setIsLoading] = useState(false);

  const { login, switchRole } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(async () => {
      await login(email, selectedRole);
      setIsLoading(false);
      addToast('Signed In', `Welcome back to MediConnect!`, 'success');
      if (selectedRole === 'hospital_admin' || selectedRole === 'doctor') {
        navigate('/hospital/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    }, 600);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'patient') {
      setEmail('sarah.jenkins@example.com');
      setPassword('patient123');
    } else if (role === 'doctor') {
      setEmail('arman.rahman@apexhealth.org');
      setPassword('doctor123');
    } else {
      setEmail('admin@apexhealth.org');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#F6FAFC] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Card */}
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
            <h2 className="text-xl font-extrabold text-[#172B3A]">Sign In to Your Account</h2>
            <p className="text-xs text-slate-500">Access your appointments, medical records and consultations</p>
          </div>

          {/* Quick Demo Credentials Tabs */}
          <div className="p-3 bg-[#e8f7f6]/50 rounded-2xl border border-[#72D6CB]/30 space-y-2">
            <span className="text-[11px] font-bold text-[#146C94] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Instant Demo Sign-in:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('patient')}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedRole === 'patient' ? 'bg-[#146C94] text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('doctor')}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedRole === 'doctor' ? 'bg-[#146C94] text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('hospital_admin')}
                className={`py-1.5 rounded-lg transition-all ${
                  selectedRole === 'hospital_admin' ? 'bg-[#146C94] text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-bold text-[#146C94] hover:underline">
                  Forgot Password?
                </Link>
              </div>
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

            <Button
              variant="primary"
              size="md"
              type="submit"
              fullWidth
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Sign In to Portal
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#146C94] hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
