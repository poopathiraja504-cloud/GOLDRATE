import React, { useState } from 'react';
import { X, Bell, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { MetalType, Carat } from '../types';
import { useRates } from '../context/RatesContext';
import { formatINR } from '../services/rateService';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMetal?: MetalType;
  defaultCarat?: Carat;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  defaultMetal = 'gold',
  defaultCarat = 24,
}) => {
  const { goldRates, silverRate, addPriceAlert } = useRates();
  const [metal, setMetal] = useState<MetalType>(defaultMetal);
  const [carat, setCarat] = useState<Carat>(defaultCarat);
  const [condition, setCondition] = useState<'above' | 'below'>('below');
  const [targetRate, setTargetRate] = useState<number>(() => {
    if (defaultMetal === 'gold') {
      return (goldRates?.[defaultCarat]?.rate_per_gram || 7850) - 50;
    }
    return (silverRate?.rate_per_gram || 94.5) - 1.5;
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentRate = metal === 'gold'
    ? (goldRates?.[carat]?.rate_per_gram || 7850)
    : (silverRate?.rate_per_gram || 94.5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPriceAlert(metal, targetRate, condition, metal === 'gold' ? carat : undefined);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">Price Alert Configured!</h3>
            <p className="text-xs text-slate-400">
              We will notify you immediately when {metal.toUpperCase()} reaches ₹{targetRate}/g.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Create Real-Time Price Alert</h3>
                <p className="text-xs text-slate-400">Receive instant push & in-app notifications on price movement.</p>
              </div>
            </div>

            {/* Current Reference */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Current Market Spot Rate:</span>
              <span className="font-bold text-amber-400 font-mono">{formatINR(currentRate)} / gram</span>
            </div>

            {/* Metal Select */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Select Commodity</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setMetal('gold'); setTargetRate((goldRates?.[carat]?.rate_per_gram || 7850) - 50); }}
                  className={`py-2 rounded-xl text-xs font-medium text-center transition-all ${
                    metal === 'gold'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Gold
                </button>
                <button
                  type="button"
                  onClick={() => { setMetal('silver'); setTargetRate((silverRate?.rate_per_gram || 94.5) - 1.5); }}
                  className={`py-2 rounded-xl text-xs font-medium text-center transition-all ${
                    metal === 'silver'
                      ? 'bg-slate-200 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Silver
                </button>
              </div>
            </div>

            {/* Carat Select (if Gold) */}
            {metal === 'gold' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Purity</label>
                <div className="grid grid-cols-3 gap-2">
                  {([24, 22, 18] as Carat[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setCarat(c); setTargetRate((goldRates?.[c]?.rate_per_gram || 7850) - 50); }}
                      className={`py-2 rounded-xl text-xs font-medium text-center transition-all ${
                        carat === c
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {c}K Gold
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Condition */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Alert Trigger</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('below')}
                  className={`py-2 rounded-xl text-xs font-medium text-center transition-all ${
                    condition === 'below'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Drops Below (Buy Signal)
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('above')}
                  className={`py-2 rounded-xl text-xs font-medium text-center transition-all ${
                    condition === 'above'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Rises Above (Sell/Target)
                </button>
              </div>
            </div>

            {/* Target Price */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Target Rate (₹ / Gram)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={targetRate}
                onChange={(e) => setTargetRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              Activate Price Alert
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

