import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Scale, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRates } from '../context/RatesContext';
import { SupportedCity, WeightUnit } from '../types';

const CITIES: SupportedCity[] = [
  'National',
  'Mumbai',
  'Delhi',
  'Chennai',
  'Bangalore',
  'Kolkata',
  'Hyderabad',
  'Ahmedabad',
  'Jaipur',
  'Pune',
  'Lucknow'
];

const UNITS: WeightUnit[] = ['1g', '8g', '10g', '100g', '1kg'];

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const { setSelectedCity, setSelectedUnit } = useRates();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [preferredCity, setPreferredCity] = useState<SupportedCity>((profile?.preferred_city as SupportedCity) || 'National');
  const [preferredUnit, setPreferredUnit] = useState<WeightUnit>(profile?.preferred_unit || '10g');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    const ok = await updateProfile({
      full_name: fullName,
      phone,
      preferred_city: preferredCity,
      preferred_unit: preferredUnit,
    });

    if (ok) {
      setSelectedCity(preferredCity);
      setSelectedUnit(preferredUnit);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Investor Profile & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize your default bullion city benchmark, primary weight units, and communication preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile and investment preferences saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-5">
        
        {/* Avatar & Email Header */}
        <div className="flex items-center space-x-4 pb-5 border-b border-slate-800">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span>{fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{fullName || 'Valued Bullion Investor'}</h2>
            <p className="text-xs text-slate-400">{user?.email || 'Authenticated User'}</p>
            <span className="inline-flex items-center text-[10px] text-emerald-400 mt-1">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Verified Supabase Account
            </span>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              placeholder="Your full name"
            />
          </div>
        </div>

        {/* Email Read-only */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              disabled
              value={user?.email || 'investor@example.com'}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mobile Number (+91)</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Preferred Benchmark City */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Default Market City
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
            <select
              value={preferredCity}
              onChange={(e) => setPreferredCity(e.target.value as SupportedCity)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c} {c === 'National' ? '(National Benchmark)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preferred Weight Unit */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Default Pricing Unit
          </label>
          <div className="grid grid-cols-5 gap-2">
            {UNITS.map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setPreferredUnit(u)}
                className={`py-2 text-xs font-medium rounded-xl text-center transition-all ${
                  preferredUnit === u
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
          >
            {isSaving ? 'Saving Changes...' : 'Update Profile & Settings'}
          </button>
        </div>

      </form>

    </div>
  );
};
