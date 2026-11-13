import React from 'react';
import { LineChart, Sparkles } from 'lucide-react';
import { TradingViewCandlestickChart } from '../components/TradingViewCandlestickChart';
import { InteractiveChart } from '../components/InteractiveChart';

export const PriceChartsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <LineChart className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Financial Price Charts & Technical Trends
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            TradingView Candlestick Engine & Area Charts across 1D, 1W, 1M, 1Y, 3Y, and 5Y historical trajectories.
          </p>
        </div>
      </div>

      {/* Main TradingView Candlestick Chart */}
      <TradingViewCandlestickChart initialMetal="gold" initialPeriod="1M" height={440} />

      {/* Secondary Multi-Month Trajectory */}
      <div className="pt-4">
        <h2 className="text-lg font-bold text-white mb-3">Multi-Month Area Trend Trajectory</h2>
        <InteractiveChart initialMetal="silver" initialTimeframe="6m" />
      </div>

    </div>
  );
};

export default PriceChartsPage;
