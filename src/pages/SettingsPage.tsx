import React, { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Database, 
  Trash2, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useRates } from '../context/RatesContext';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, refreshRates } = useRates();
  const { isConfigured } = useAuth();
  const [cleared, setCleared] = useState(false);

  const handleClearCache = () => {
    localStorage.removeItem('cached_gold_rates_v1');
    localStorage.removeItem('cached_silver_rates_v1');
    localStorage.removeItem('cached_rates_time_v1');
    refreshRates();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Visual theme, caching rules, and platform configuration.
        </p>
      </div>

      {cleared && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Offline rate cache cleared! Fresh market data synchronized.</span>
        </div>
      )}

      {/* Theme Settings */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Appearance & Theme</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { if (theme !== 'dark') toggleTheme(); }}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              theme === 'dark'
                ? 'border-amber-500/60 bg-amber-500/10 text-white'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Moon className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold">Premium Dark Navy</div>
                <div className="text-[10px] text-slate-400">Gold & Silver Accents</div>
              </div>
            </div>
            {theme === 'dark' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
          </button>

          <button
            type="button"
            onClick={() => { if (theme !== 'light') toggleTheme(); }}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              theme === 'light'
                ? 'border-amber-500/60 bg-amber-500/10 text-white'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Sun className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold">White / Light Theme</div>
                <div className="text-[10px] text-slate-400">High Contrast Day Mode</div>
              </div>
            </div>
            {theme === 'light' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
          </button>
        </div>
      </div>

      {/* Backend & Supabase Status */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Backend Architecture</h2>
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-200">Supabase PostgreSQL & Auth</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {isConfigured ? 'CONNECTED' : 'STANDBY / LOCAL FALLBACK'}
          </span>
        </div>
      </div>

      {/* Data & Cache Management */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Cache & Offline Storage</h2>
        <p className="text-xs text-slate-400">
          The app caches rates locally so you can check bullion quotes even when traveling without network coverage.
        </p>

        <button
          onClick={handleClearCache}
          className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center space-x-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Local Rate Cache & Re-sync</span>
        </button>
      </div>

    </div>
  );
};
