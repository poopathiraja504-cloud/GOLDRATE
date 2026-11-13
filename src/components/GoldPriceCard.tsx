import React from 'react';
import { TrendingUp, TrendingDown, Star, Sparkles, ShieldCheck } from 'lucide-react';
import { GoldRate, Carat, WeightUnit } from '../types';
import { formatINR } from '../services/rateService';
import { useRates } from '../context/RatesContext';

interface GoldPriceCardProps {
  rate: GoldRate;
  onAlertClick?: (carat: Carat) => void;
}

export const GoldPriceCard: React.FC<GoldPriceCardProps> = ({ rate, onAlertClick }) => {
  const { selectedUnit, toggleFavorite, isFavorite } = useRates();
  const isFav = isFavorite('gold', rate.carat);
  const isPositive = rate.change_24h >= 0;

  // Selected unit amount calculation
  const getDisplayPrice = (unit: WeightUnit) => {
    switch (unit) {
      case '1g': return rate.rate_per_gram;
      case '8g': return rate.rate_per_8g;
      case '10g': return rate.rate_per_10g;
      case '100g': return rate.rate_per_100g;
      default: return rate.rate_per_10g;
    }
  };

  const currentPrice = getDisplayPrice(selectedUnit);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-5 sm:p-6 shadow-xl hover:border-amber-400/60 transition-all duration-300 group">
      
      {/* Background Gold Shimmer Accent */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

      {/* Header: Carat, Purity & Favorite */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
              {rate.carat}K GOLD
            </span>
            <span className="text-[11px] font-medium text-slate-400 flex items-center">
              <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-400" />
              {rate.carat === 24 ? '99.9% Fine' : rate.carat === 22 ? '91.6% Hallmark' : '75.0% Jewellery'}
            </span>
          </div>
          <h3 className="text-sm text-slate-300 font-medium mt-1">
            {rate.purity_label}
          </h3>
        </div>

        <button
          onClick={() => toggleFavorite('gold', rate.carat)}
          className={`p-2 rounded-xl transition-all ${
            isFav 
              ? 'text-amber-400 bg-amber-500/20 border border-amber-500/40' 
              : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFav ? `Remove ${rate.carat}K Gold from favorites` : `Add ${rate.carat}K Gold to favorites`}
        >
          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Main Price Highlight */}
      <div className="mt-4 pt-2 border-t border-slate-800/80 relative z-10">
        <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>Price per {selectedUnit} ({rate.city})</span>
          <span className="text-[10px] text-amber-400/80 font-mono">LIVE SPOT</span>
        </div>

        <div className="flex items-baseline space-x-2 mt-1">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            {formatINR(currentPrice)}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            / {selectedUnit}
          </span>
        </div>

        {/* 24h Change Indicator */}
        <div className="flex items-center space-x-3 mt-3">
          <div className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${
            isPositive 
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
          }`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
            <span>{isPositive ? '+' : ''}{formatINR(rate.change_24h)} ({isPositive ? '+' : ''}{rate.change_percentage_24h}%)</span>
          </div>

          <span className="text-[11px] text-slate-500">
            vs Yesterday
          </span>
        </div>
      </div>

      {/* Weight Breakdown Grid */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center relative z-10">
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-400">1 Gram</div>
          <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">
            {formatINR(rate.rate_per_gram)}
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-400">8g (1 Pavan)</div>
          <div className="text-xs font-bold text-amber-300 font-mono mt-0.5">
            {formatINR(rate.rate_per_8g)}
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-400">10 Grams</div>
          <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">
            {formatINR(rate.rate_per_10g)}
          </div>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="flex items-center justify-between mt-4 text-[10px] text-slate-400 relative z-10">
        <span>Updated: {new Date(rate.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        {onAlertClick && (
          <button
            onClick={() => onAlertClick(rate.carat)}
            className="text-amber-400 hover:text-amber-300 font-medium hover:underline"
          >
            Set Price Alert +
          </button>
        )}
      </div>

    </div>
  );
};

