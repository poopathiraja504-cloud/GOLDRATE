import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Coins, AlertCircle } from 'lucide-react';
import { emailService } from '../services/emailService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, signInWithEmail } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const redirectTarget = (location.state as any)?.from?.pathname || '/dashboard';

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) {
        setError(authError.message || 'Google sign-in failed. Please try again.');
      } else {
        navigate('/auth/callback');
      }
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await signInWithEmail(email, password);
      if (authError) {
        setError(authError.message || 'Sign-in failed. Please check your credentials.');
      } else {
        // Send welcome back email (rate-limited)
        emailService.sendWelcomeNotification(email, email.split('@')[0], false);
        navigate(redirectTarget, { replace: true });
      }
    } catch {
      setError('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#0a0f1e' }}>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl">
          {/* Top: Coin Icon */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full"
              style={{ backgroundColor: '#d4af3722', border: '2px solid #d4af37' }}>
              <Coins size={32} style={{ color: '#d4af37' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#d4af37' }}>Welcome Back!</h1>
            <p className="mt-1 text-sm text-gray-400">Sign in to continue to GOLDSILVERRATE.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Continue with Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow hover:bg-gray-100 transition-colors disabled:opacity-60 mb-4"
          >
            {googleLoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.3 9 3.4l6.7-6.7C35.8 2.5 30.3 0 24 0 14.7 0 6.8 5.4 2.9 13.4l7.8 6.1C12.5 13 17.8 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/>
                <path fill="#FBBC05" d="M10.7 28.5A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.7-4.5L2.4 13.4A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8.2-6.1z"/>
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.2 0-11.5-4.2-13.3-9.9l-8.2 6.1C6.8 42.6 14.7 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* 2. OR Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            {/* 3. Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: '#0d1424',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 2px #d4af3730'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* 4. Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: '#0d1424',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 2px #d4af3730'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* 5. Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0d1424] border-white/20 text-[#d4af37] focus:ring-0 cursor-pointer"
                />
                <span>Remember Me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-medium transition-colors hover:opacity-80"
                style={{ color: '#d4af37' }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* 6. Sign In button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-black transition-all disabled:opacity-60 hover:opacity-90 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #d4af37, #f5d47a)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing In…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* 7. Sign Up link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold hover:opacity-80 transition-colors"
              style={{ color: '#d4af37' }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
