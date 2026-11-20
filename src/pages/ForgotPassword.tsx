import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
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
            <h2 className="text-xl font-extrabold text-[#172B3A]">Reset Password</h2>
            <p className="text-xs text-slate-500">Enter your email address and we'll send a secure password reset link.</p>
          </div>

          {submitted ? (
            <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#22A06B] mx-auto" />
              <h4 className="text-sm font-bold text-emerald-900">Reset Link Dispatched</h4>
              <p className="text-xs text-emerald-700">
                Check your inbox at <strong>{email}</strong> for instructions to reset your password.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm" className="mt-2">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Registered Email Address</label>
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

              <Button variant="primary" size="md" type="submit" fullWidth>
                Send Recovery Link
              </Button>

              <div className="pt-2 text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#146C94] hover:underline">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
