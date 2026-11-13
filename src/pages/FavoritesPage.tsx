import React from 'react';
import { Star, Coins, CircleDot, Trash2 } from 'lucide-react';
import { useRates } from '../context/RatesContext';
import { formatINR } from '../services/rateService';
import { Link } from 'react-router-dom';

export const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite, goldRates, silverRate, selectedCity } = useRates();

  return (
    <div className="space-y-6">
      
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Favorite Watchlist
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Quickly access your pinned bullion carats and preferred city benchmark quotes.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
          <Star className="w-12 h-12 text-slate-600 mx-auto opacity-40" />
          <h3 className="text-base font-bold text-white">No items in your watchlist yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click the star icon on any Gold or Silver rate card to pin it here for instant tracking.
          </p>
          <div className="pt-2">
            <Link
              to="/gold-rate"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-block"
            >
              Browse Gold Rates
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav) => {
            const isGold = fav.metal === 'gold';
            const rate = isGold && goldRates && fav.carat
              ? goldRates[fav.carat]?.rate_per_10g
              : (silverRate?.rate_per_kg || 94500);

            return (
              <div
                key={fav.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {isGold ? <Coins className="w-5 h-5 text-amber-400" /> : <CircleDot className="w-5 h-5 text-slate-300" />}
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {isGold ? `${fav.carat}K Gold (10g)` : 'Fine Silver 99.9% (1 kg)'}
                      </h4>
                      <span className="text-[10px] text-slate-400">Market: {fav.city || selectedCity}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavorite(fav.metal, fav.carat)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="text-xs text-slate-400">Current Market Rate</div>
                  <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
                    {formatINR(rate || 0)}
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <Link
                    to={isGold ? '/gold-rate' : '/silver-rate'}
                    className="text-xs text-amber-400 hover:underline font-semibold block text-center"
                  >
                    View Live Detailed Breakdown →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

