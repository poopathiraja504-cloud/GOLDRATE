import React from 'react';
import { TrendingUp, TrendingDown, Star, CircleDot, ShieldCheck } from 'lucide-react';
import { SilverRate, WeightUnit } from '../types';
import { formatINR } from '../services/rateService';
import { useRates } from '../context/RatesContext';

interface SilverPriceCardProps {
  rate: SilverRate;
  onAlertClick?: () => void;
}

export const SilverPriceCard: React.FC<SilverPriceCardProps> = ({ rate, onAlertClick }) => {
  const { selectedUnit, toggleFavorite, isFavorite } = useRates();
  const isFav = isFavorite('silver');
  const isPositive = rate.change_24h >= 0;

  // Selected unit amount calculation
  const getDisplayPrice = (unit: WeightUnit) => {
    switch (unit) {
      case '1g': return rate.rate_per_gram;
      case '8g': return rate.rate_per_gram * 8;
      case '10g': return rate.rate_per_10g;
      case '100g': return rate.rate_per_100g;
      case '1kg': return rate.rate_per_kg;
      default: return rate.rate_per_kg;
    }
  };

  const currentPrice = getDisplayPrice(selectedUnit);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-800/40 via-slate-900 to-slate-950 p-5 sm:p-6 shadow-xl hover:border-slate-400/50 transition-all duration-300 group">
      
      {/* Background Silver Shimmer Accent */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-slate-300/10 rounded-full blur-2xl group-hover:bg-slate-300/15 transition-all pointer-events-none" />

      {/* Header: Metal & Favorite */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-300/15 text-slate-200 border border-slate-400/40">
              <CircleDot className="w-3 h-3 mr-1 text-slate-300" />
              FINE SILVER
            </span>
            <span className="text-[11px] font-medium text-slate-400 flex items-center">
              <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-400" />
              99.9% Pure Bullion
            </span>
          </div>
          <h3 className="text-sm text-slate-300 font-medium mt-1">
            {rate.purity_label}
          </h3>
        </div>

        <button
          onClick={() => toggleFavorite('silver')}
          className={`p-2 rounded-xl transition-all ${
            isFav 
              ? 'text-slate-100 bg-slate-700/60 border border-slate-400/60' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFav ? 'Remove Silver from favorites' : 'Add Silver to favorites'}
        >
          <Star className={`w-4 h-4 ${isFav ? 'fill-slate-200' : ''}`} />
        </button>
      </div>

      {/* Main Price Highlight */}
      <div className="mt-4 pt-2 border-t border-slate-800/80 relative z-10">
        <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
          <span>Price per {selectedUnit} ({rate.city})</span>
          <span className="text-[10px] text-slate-400 font-mono">SPOT BULLION</span>
        </div>

        <div className="flex items-baseline space-x-2 mt-1">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 font-mono">
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

      {/* Silver Breakdown Grid */}
      <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center relative z-10">
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-400">1 Gram</div>
          <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">
            {formatINR(rate.rate_per_gram)}
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-400">10 Grams</div>
          <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">
            {formatINR(rate.rate_per_10g)}
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-400">100 Grams</div>
          <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">
            {formatINR(rate.rate_per_100g)}
          </div>
        </div>

        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] text-slate-400">1 Kilogram</div>
          <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">
            {formatINR(rate.rate_per_kg)}
          </div>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="flex items-center justify-between mt-4 text-[10px] text-slate-400 relative z-10">
        <span>Updated: {new Date(rate.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        {onAlertClick && (
          <button
            onClick={onAlertClick}
            className="text-slate-300 hover:text-white font-medium hover:underline"
          >
            Set Silver Alert +
          </button>
        )}
      </div>

    </div>
  );
};
