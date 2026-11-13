import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const { error } = await resetPasswordForEmail(email);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg mb-2">
            <Mail className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter your email to receive a secure password recovery link.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If an account exists for <span className="text-amber-400 font-semibold">{email}</span>, you will receive an email containing a link to reset your password.
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:underline font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Sending Link...' : 'Send Password Reset Link'}
            </button>

            <div className="text-center pt-3">
              <Link
                to="/login"
                className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-amber-400"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
