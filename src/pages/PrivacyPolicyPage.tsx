import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Last revised: November 2026 • Commitment to user data confidentiality and security.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4 text-xs text-slate-300 leading-relaxed shadow-xl">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Information We Collect & How It Is Used</span>
        </div>

        <p>
          Gold and Silver Rate ("we", "our", or "the Platform") respects the privacy rights of our users. This Privacy Policy clarifies how personal information is handled when using our website, progressive web application (PWA), and Android APK.
        </p>

        <h3 className="font-bold text-white text-sm pt-2">1. User Accounts and Authentication Data</h3>
        <p>
          We utilize Supabase Authentication for secure login services. When you authenticate via Google OAuth, Email/Password, Email OTP, or SMS OTP, we store your email address, phone number (if SMS enabled), and display name in an encrypted PostgreSQL database protected by Row Level Security (RLS). Passwords are never stored in plaintext and are hashed using bcrypt.
        </p>

        <h3 className="font-bold text-white text-sm pt-2">2. Local Storage and Preferences</h3>
        <p>
          Your preferences (such as selected benchmark city, preferred weight unit, and visual theme) are stored locally in your device's browser memory or Capacitor SQLite store for high-performance offline viewing.
        </p>

        <h3 className="font-bold text-white text-sm pt-2">3. Zero Third-Party Advertising</h3>
        <p>
          We do not sell, rent, or monetize your personal details or portfolio price alerts to third-party ad brokers or data aggregators.
        </p>

        <h3 className="font-bold text-white text-sm pt-2">4. Row Level Security (RLS)</h3>
        <p>
          Each database record is strictly isolated: only the verified authenticated account holder can view, update, or delete their profile preferences, notification history, and price alert rules.
        </p>
      </div>

    </div>
  );
};

