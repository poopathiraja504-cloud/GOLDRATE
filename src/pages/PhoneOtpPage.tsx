import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone, Clock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PhoneOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'input_phone' | 'enter_otp'>('input_phone');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const { error } = await sendPhoneOtp(cleanPhone);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setStep('enter_otp');
        setCooldown(60);
        setSuccessMsg(`SMS OTP dispatched to +91 ${cleanPhone}. (Demo Code: 654321)`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send SMS OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, '');
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the SMS OTP.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const { error } = await verifyPhoneOtp(phone, token);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Phone verified successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed');
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
            <Smartphone className="w-6 h-6 text-slate-950" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Mobile SMS Login</h2>
          <p className="text-xs text-slate-400 mt-1">
            {step === 'input_phone'
              ? 'Instant verification with Indian (+91) Mobile SMS OTP'
              : `Enter the 6-digit SMS OTP sent to +91 ${phone}`}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            {successMsg}
          </div>
        )}

        {step === 'input_phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-800 bg-slate-950 text-slate-400 text-xs font-semibold">
                  +91 (IND)
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-r-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.length !== 10}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
            >
              {isLoading ? 'Sending SMS OTP...' : 'Send SMS OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 text-center">
                Enter 6-Digit SMS Code
              </label>

              <div className="flex justify-center space-x-2 sm:space-x-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-11 sm:h-12 text-center text-lg font-bold font-mono bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-40"
            >
              {isLoading ? 'Verifying SMS...' : 'Verify & Log In'}
            </button>

            <div className="flex items-center justify-between text-xs pt-2 text-slate-400">
              <button
                type="button"
                onClick={() => setStep('input_phone')}
                className="hover:text-amber-400 underline"
              >
                Change Number
              </button>

              {cooldown > 0 ? (
                <span className="flex items-center text-slate-500">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Resend SMS in {cooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  className="text-amber-400 font-semibold hover:underline"
                >
                  Resend SMS
                </button>
              )}
            </div>
          </form>
        )}

        <div className="text-center mt-6 text-xs text-slate-400 pt-4 border-t border-slate-800">
          Want to use password instead?{' '}
          <Link to="/login" className="text-amber-400 hover:underline font-semibold">
            Password Login
          </Link>
        </div>

      </div>
    </div>
  );
};
