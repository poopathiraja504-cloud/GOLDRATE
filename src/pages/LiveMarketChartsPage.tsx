import React, { useState } from 'react';
import { ChartNoAxesCombined, BarChart2, TrendingUp, Sparkles } from 'lucide-react';
import { TradingViewCandlestickChart } from '../components/TradingViewCandlestickChart';
import { InteractiveChart } from '../components/InteractiveChart';

export const LiveMarketChartsPage: React.FC = () => {
  const [chartType, setChartType] = useState<'candlestick' | 'area'>('candlestick');

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
              Live Market Technical Candlestick Engine
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              TradingView Lightweight Charts • 1D, 1W, 1M, 1Y, 3Y, 5Y Real OHLC Candlesticks & Volume
            </p>
          </div>
        </div>

        {/* Chart View Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setChartType('candlestick')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              chartType === 'candlestick'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TradingView Candlesticks
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              chartType === 'area'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Area Chart
          </button>
        </div>
      </div>

      {/* Render Selected Chart Engine */}
      {chartType === 'candlestick' ? (
        <TradingViewCandlestickChart initialMetal="gold" initialPeriod="1M" height={500} />
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
          <InteractiveChart initialMetal="gold" initialTimeframe="30d" />
        </div>
      )}

      {/* Technical Indicators Summary */}
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
          <p className="mt-1 text-sm font-bold text-slate-200">Key Support: ₹7,800 / Resistance: ₹7,950</p>
          <p className="text-xs text-slate-500 mt-1">Consolidation range based on intraday spot ticks.</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
          <span className="text-xs font-semibold text-slate-400 uppercase">Volatility Index</span>
          <p className="mt-1 text-sm font-bold text-amber-300">Moderate (1.14% Beta)</p>
          <p className="text-xs text-slate-500 mt-1">Optimal liquidity zone for retail bullion accumulation.</p>
        </div>
      </div>
    </div>
  );
};

export default LiveMarketChartsPage;
