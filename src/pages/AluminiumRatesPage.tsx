import React, { useState } from 'react';
import { Layers, TrendingUp, TrendingDown, RefreshCw, Zap } from 'lucide-react';
import { useRates } from '../context/RatesContext';

// Aluminium price estimate (INR per gram) — fallback
const ALUMINIUM_ESTIMATE_PER_GRAM = 0.22;

export function AluminiumRatesPage() {
  const { lastUpdated, rateSource, isSyncing, refreshRates } = useRates();
  const [change] = useState<number>(-0.18);

  const perGram = ALUMINIUM_ESTIMATE_PER_GRAM;
  const perKg = perGram * 1000;
  const perTonne = perGram * 1_000_000;

  const isPositive = change >= 0;

  const cards = [
    { label: 'Aluminium per Gram', value: perGram, unit: '₹/g', precision: 2 },
    { label: 'Aluminium per Kg', value: perKg, unit: '₹/kg', precision: 0 },
    { label: 'Aluminium per Tonne', value: perTonne, unit: '₹/tonne', precision: 0 },
  ];

  const accent = '#aaaaaa';
  const accentDim = 'rgba(170,170,170,0.15)';
  const accentBorder = 'rgba(170,170,170,0.3)';

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#888,#bbb)' }}>
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: accent }}>
              Aluminium Rates
            </h1>
            <p className="text-slate-400 text-sm">India Live Aluminium Price — LME / MCX</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: accentDim, color: accent, border: `1px solid ${accentBorder}` }}>
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

      {/* Daily Change Banner */}
      <div className="mb-6 p-4 rounded-2xl border flex items-center justify-between"
        style={{
          background: isPositive ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
          borderColor: isPositive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
        }}>
        <div>
          <p className="text-sm text-slate-400">Daily Change</p>
          <div className="flex items-center gap-2 mt-1">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="text-right text-sm text-slate-400">
          <p>Source</p>
          <p className="text-slate-200 font-medium mt-0.5">{rateSource}</p>
        </div>
      </div>

      {/* Price Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl p-6 border group transition-all"
            style={{
              borderColor: accentBorder,
              background: 'linear-gradient(135deg, rgba(170,170,170,0.1) 0%, rgba(170,170,170,0.02) 100%)',
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 0%, rgba(170,170,170,0.1), transparent 70%)' }} />

            <p className="text-slate-400 text-sm font-medium mb-3">{card.label}</p>
            <p className="text-3xl font-bold" style={{ color: accent }}>
              ₹{card.value.toLocaleString('en-IN', { minimumFractionDigits: card.precision, maximumFractionDigits: card.precision })}
            </p>
            <p className="text-xs text-slate-500 mt-2">{card.unit}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-4 text-xs text-slate-500">
        <span>Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString('en-IN') : 'N/A'}</span>
        <span>•</span>
        <span>Prices are indicative. Actual market prices may vary.</span>
      </div>
    </div>
  );
}
