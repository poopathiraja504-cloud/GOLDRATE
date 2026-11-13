import React, { useState } from 'react';
import { ChartNoAxesCombined, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { InteractiveChart } from '../components/InteractiveChart';

type ChartMetal = 'gold' | 'silver' | 'copper' | 'aluminium' | 'platinum' | 'palladium';

export const LiveMarketChartsPage: React.FC = () => {
  const [activeMetal, setActiveMetal] = useState<ChartMetal>('gold');

  const metalsList: { id: ChartMetal; name: string; color: string; badge: string }[] = [
    { id: 'gold', name: 'Gold (24K / 22K)', color: '#d4af37', badge: '₹/10g' },
    { id: 'silver', name: 'Silver Bullion', color: '#c0c0c0', badge: '₹/1kg' },
    { id: 'copper', name: 'Copper (LME/MCX)', color: '#b87333', badge: '₹/1kg' },
    { id: 'aluminium', name: 'Aluminium', color: '#aaaaaa', badge: '₹/1kg' },
    { id: 'platinum', name: 'Platinum 999.5', color: '#e5e4e2', badge: '₹/1g' },
    { id: 'palladium', name: 'Palladium', color: '#90cdf4', badge: '₹/1g' },
  ];

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-yellow-500/10 text-amber-400 border border-amber-500/30">
            <ChartNoAxesCombined className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Live Market Technical Charts
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-asset historical trajectories, volatility bands & real-time trend analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> High-Resolution Data
          </span>
        </div>
      </div>

      {/* Metal Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {metalsList.map((m) => {
          const isActive = activeMetal === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMetal(m.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-slate-800 border-amber-400/80 text-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: m.color }}
              />
              <span>{m.name}</span>
              <span className="text-[10px] text-slate-400 bg-slate-950/60 px-1.5 py-0.5 rounded">
                {m.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Render Chart */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        <InteractiveChart
          initialMetal={activeMetal === 'silver' ? 'silver' : 'gold'}
          initialTimeframe="30d"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Trend Indicator</span>
          <p className="mt-1 text-sm font-bold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Strong Bullish Momentum
          </p>
          <p className="text-xs text-slate-500 mt-1">20-day EMA trading safely above 50-day moving average.</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Support & Resistance</span>
          <p className="mt-1 text-sm font-bold text-slate-200">Key Support: ₹7,250 / Resistance: ₹7,480</p>
          <p className="text-xs text-slate-500 mt-1">Consolidation range based on intraday ticks.</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Volatility Index</span>
          <p className="mt-1 text-sm font-bold text-amber-300">Moderate (1.14% Beta)</p>
          <p className="text-xs text-slate-500 mt-1">Safe zone for long-term jewellery and bullion accumulation.</p>
        </div>
      </div>
    </div>
  );
};

export default LiveMarketChartsPage;

