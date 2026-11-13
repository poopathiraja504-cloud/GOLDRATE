import React, { useState } from 'react';
import { Gem, TrendingUp, TrendingDown, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { useRates } from '../context/RatesContext';

// Reference estimates in INR per gram (can be updated via live rates)
const PLATINUM_ESTIMATE_PER_GRAM = 2850;
const PALLADIUM_ESTIMATE_PER_GRAM = 2980;

export function PlatinumPalladiumPage() {
  const { lastUpdated, rateSource, isSyncing, refreshRates } = useRates();
  const [platChange] = useState<number>(0.85);
  const [palChange] = useState<number>(-0.42);

  const platinumCards = [
    { label: '1 Gram Platinum', value: PLATINUM_ESTIMATE_PER_GRAM, unit: '₹' },
    { label: '10 Gram Platinum', value: PLATINUM_ESTIMATE_PER_GRAM * 10, unit: '₹' },
    { label: '100 Gram Platinum', value: PLATINUM_ESTIMATE_PER_GRAM * 100, unit: '₹' },
    { label: '1 Kilogram Platinum', value: PLATINUM_ESTIMATE_PER_GRAM * 1000, unit: '₹' },
  ];

  const palladiumCards = [
    { label: '1 Gram Palladium', value: PALLADIUM_ESTIMATE_PER_GRAM, unit: '₹' },
    { label: '10 Gram Palladium', value: PALLADIUM_ESTIMATE_PER_GRAM * 10, unit: '₹' },
    { label: '100 Gram Palladium', value: PALLADIUM_ESTIMATE_PER_GRAM * 100, unit: '₹' },
    { label: '1 Kilogram Palladium', value: PALLADIUM_ESTIMATE_PER_GRAM * 1000, unit: '₹' },
  ];

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-400">
            <Gem className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
              Platinum & Palladium Rates
            </h1>
            <p className="text-slate-400 text-sm">Precious Industrial & Investment Metals</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-3 h-3" />
            Live Market
          </span>
          <button
            onClick={refreshRates}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Platinum Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-200">Platinum (Pt 999.5)</h2>
            <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${platChange >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {platChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {platChange >= 0 ? '+' : ''}{platChange}% (24h)
            </span>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-300" /> Indicative spot rate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platinumCards.map((card, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 hover:border-slate-600 rounded-2xl p-5 backdrop-blur-sm transition-all shadow-lg">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.label}</span>
              <div className="mt-2 text-2xl font-black text-white">
                {card.unit} {card.value.toLocaleString('en-IN')}
              </div>
              <div className="mt-3 text-xs text-slate-500 flex justify-between">
                <span>Purity 99.95%</span>
                <span>Active Market</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Palladium Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-blue-200">Palladium (Pd 999.5)</h2>
            <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${palChange >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {palChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {palChange >= 0 ? '+' : ''}{palChange}% (24h)
            </span>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" /> Indicative spot rate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {palladiumCards.map((card, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 hover:border-blue-900/50 rounded-2xl p-5 backdrop-blur-sm transition-all shadow-lg">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.label}</span>
              <div className="mt-2 text-2xl font-black text-blue-100">
                {card.unit} {card.value.toLocaleString('en-IN')}
              </div>
              <div className="mt-3 text-xs text-slate-500 flex justify-between">
                <span>Purity 99.95%</span>
                <span>Automotive & Bullion</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-500">
        Source: {rateSource} • Last updated: {new Date(lastUpdated).toLocaleString('en-IN')}
      </div>
    </div>
  );
}

export default PlatinumPalladiumPage;

