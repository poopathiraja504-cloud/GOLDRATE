import React, { useState } from 'react';
import { Calculator, Sparkles, Info, ShieldCheck } from 'lucide-react';
import { Carat } from '../types';
import { calculateJewelleryPrice, formatINR } from '../services/rateService';
import { useRates } from '../context/RatesContext';

export const JewelleryCalculator: React.FC = () => {
  const { goldRates, silverRate } = useRates();
  const [metal, setMetal] = useState<'gold' | 'silver'>('gold');
  const [carat, setCarat] = useState<Carat>(22);
  const [weight, setWeight] = useState<number>(10);
  const [makingChargePercent, setMakingChargePercent] = useState<number>(12);
  const [includeHallmark, setIncludeHallmark] = useState<boolean>(true);

  const ratePerGram = metal === 'gold' 
    ? (goldRates?.[carat]?.rate_per_gram || 7196)
    : (silverRate?.rate_per_gram || 94.5);

  const calculation = calculateJewelleryPrice(
    ratePerGram,
    weight,
    makingChargePercent,
    includeHallmark
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center space-x-2 pb-4 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center">
            <span>Jewellery Price & GST Calculator</span>
            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
              INDIA RETAIL
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Calculate accurate billing estimates including making charges, 3% GST, and BIS hallmarking fee.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        
        {/* Form Inputs */}
        <div className="space-y-4">
          
          {/* Metal & Purity Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Metal & Purity
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => { setMetal('gold'); setCarat(24); }}
                className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all ${
                  metal === 'gold' && carat === 24
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                24K Gold
              </button>

              <button
                type="button"
                onClick={() => { setMetal('gold'); setCarat(22); }}
                className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all ${
                  metal === 'gold' && carat === 22
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                22K (Jewellery)
              </button>

              <button
                type="button"
                onClick={() => { setMetal('gold'); setCarat(18); }}
                className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all ${
                  metal === 'gold' && carat === 18
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                18K Gold
              </button>

              <button
                type="button"
                onClick={() => setMetal('silver')}
                className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all ${
                  metal === 'silver'
                    ? 'bg-slate-200 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                99.9% Silver
              </button>
            </div>
          </div>

          {/* Weight in Grams Input */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Weight in Grams</span>
              <span className="text-amber-400 font-mono">
                {weight}g ({Math.round((weight / 8) * 100) / 100} Pavan)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weight || ''}
                onChange={(e) => setWeight(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                placeholder="Enter weight in grams"
              />
              <div className="flex space-x-1">
                {[1, 8, 10, 20].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeight(w)}
                    className="px-2 py-2 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 font-mono"
                  >
                    {w}g
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Making Charges Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Making Charges (%)</span>
              <span className="text-amber-400 font-mono">{makingChargePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={makingChargePercent}
              onChange={(e) => setMakingChargePercent(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0% (Coins)</span>
              <span>10%-14% (Standard)</span>
              <span>25%+ (Antique / Designer)</span>
            </div>
          </div>

          {/* Hallmarking Checkbox */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="hallmark"
              checked={includeHallmark}
              onChange={(e) => setIncludeHallmark(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="hallmark" className="text-xs text-slate-300 cursor-pointer flex items-center">
              <span>Add BIS Hallmarking Fee (₹45 + 18% GST = ₹53.10)</span>
            </label>
          </div>

        </div>

        {/* Bill Receipt Preview */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Estimate Invoice Breakdown
              </span>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" />
                GST Compliant
              </span>
            </div>

            <div className="space-y-2.5 mt-4 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Gold/Silver Rate per gram:</span>
                <span className="font-mono text-white">{formatINR(ratePerGram)}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Base Metal Cost ({weight}g):</span>
                <span className="font-mono text-white">{formatINR(calculation.baseMetalCost)}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Making Charges ({makingChargePercent}%):</span>
                <span className="font-mono text-white">{formatINR(calculation.makingCharges)}</span>
              </div>

              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span>Subtotal (Metal + Making):</span>
                <span className="font-mono text-slate-200">{formatINR(calculation.subtotal)}</span>
              </div>

              <div className="flex justify-between text-amber-400">
                <span>GST (3% on Jewellery Subtotal):</span>
                <span className="font-mono">{formatINR(calculation.gstAmount)}</span>
              </div>

              {includeHallmark && (
                <div className="flex justify-between text-slate-400">
                  <span>BIS Hallmarking Charge:</span>
                  <span className="font-mono text-slate-300">₹53.10</span>
                </div>
              )}
            </div>
          </div>

          {/* Grand Total */}
          <div className="pt-4 border-t border-slate-800 mt-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Estimated Final Price
                </span>
                <span className="text-[10px] text-slate-500">Includes all taxes & fees</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                {formatINR(calculation.grandTotal)}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

