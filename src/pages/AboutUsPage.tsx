import React from 'react';
import { Sparkles, ShieldCheck, Database, Globe, Award } from 'lucide-react';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      <div className="text-center space-y-3 pb-6 border-b border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About Gold & Silver Rate Platform
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          India's trusted digital portal for transparent, verified bullion spot pricing and jewellery cost estimation.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-5 text-xs text-slate-300 leading-relaxed shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Our Vision & Methodology</span>
        </h2>
        <p>
          The Gold and Silver Rate platform was engineered to solve a pervasive challenge in the Indian retail and investment bullion marketplace: widespread pricing confusion between wholesale bullion spot rates, MCX commodity futures, and local retail jewellery quotes.
        </p>
        <p>
          We provide transparent pricing by integrating directly with verified market feeds, combining live international spot rates (XAU & XAG), official USD/INR forex benchmarks from the Reserve Bank of India, and statutory Indian import duties.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-center">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-white">100% Verified</h4>
            <p className="text-slate-400 mt-1">Calibrated to 916 BIS Hallmark standards.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <Database className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <h4 className="font-bold text-white">Supabase Cloud</h4>
            <p className="text-slate-400 mt-1">Synchronized real-time Postgres database.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <Globe className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <h4 className="font-bold text-white">10+ Indian Cities</h4>
            <p className="text-slate-400 mt-1">Regional bullion association benchmarks.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
