import React, { useState } from 'react';
import { History, Calendar, Filter, Coins, CircleDot, ArrowUpDown } from 'lucide-react';
import { useRates } from '../context/RatesContext';
import { formatINR } from '../services/rateService';

export const RateHistoryPage: React.FC = () => {
  const { goldRates, silverRate, selectedCity } = useRates();
  const [selectedMetal, setSelectedMetal] = useState<'gold' | 'silver'>('gold');
  const [filterPeriod, setFilterPeriod] = useState<'all' | '7d' | '30d'>('30d');

  // Realistic historical series for India
  const historyData = [
    { date: '13 Nov 2026', gold24k: 7850, gold22k: 7196, silver: 94.50, change: '+0.58%', high: 7890, low: 7795 },
    { date: '12 Nov 2026', gold24k: 7805, gold22k: 7155, silver: 93.70, change: '-0.20%', high: 7830, low: 7780 },
    { date: '11 Nov 2026', gold24k: 7820, gold22k: 7168, silver: 93.90, change: '+0.45%', high: 7840, low: 7790 },
    { date: '10 Nov 2026', gold24k: 7785, gold22k: 7136, silver: 93.40, change: '+0.30%', high: 7800, low: 7750 },
    { date: '09 Nov 2026', gold24k: 7760, gold22k: 7113, silver: 92.80, change: '-0.15%', high: 7790, low: 7740 },
    { date: '08 Nov 2026', gold24k: 7772, gold22k: 7124, silver: 93.00, change: '+0.10%', high: 7785, low: 7755 },
    { date: '07 Nov 2026', gold24k: 7765, gold22k: 7118, silver: 92.60, change: '+0.60%', high: 7780, low: 7730 },
    { date: '06 Nov 2026', gold24k: 7720, gold22k: 7077, silver: 92.10, change: '+0.25%', high: 7740, low: 7700 },
    { date: '05 Nov 2026', gold24k: 7700, gold22k: 7058, silver: 91.80, change: '-0.40%', high: 7725, low: 7680 },
    { date: '04 Nov 2026', gold24k: 7730, gold22k: 7086, silver: 92.20, change: '+0.80%', high: 7750, low: 7695 },
    { date: '03 Nov 2026', gold24k: 7670, gold22k: 7031, silver: 91.40, change: '+0.35%', high: 7690, low: 7650 },
    { date: '02 Nov 2026', gold24k: 7645, gold22k: 7008, silver: 91.00, change: '-0.10%', high: 7660, low: 7630 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Rate History & Closing Prices
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Archived daily historical spot data, high/low spread, and percentage fluctuations for {selectedCity}.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setSelectedMetal('gold')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedMetal === 'gold' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Gold History
            </button>
            <button
              onClick={() => setSelectedMetal('silver')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedMetal === 'silver' ? 'bg-slate-200 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Silver History
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                {selectedMetal === 'gold' ? (
                  <>
                    <th className="py-3 px-4 text-amber-400">24K Rate / g</th>
                    <th className="py-3 px-4 text-amber-300">22K Rate / g</th>
                    <th className="py-3 px-4">Day's High</th>
                    <th className="py-3 px-4">Day's Low</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4 text-slate-200">Rate / Gram</th>
                    <th className="py-3 px-4 text-slate-300">Rate / 10g</th>
                    <th className="py-3 px-4 text-slate-200">Rate / 1 kg</th>
                  </>
                )}
                <th className="py-3 px-4 text-right">Movement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {historyData.map((row, idx) => {
                const isPos = !row.change.startsWith('-');
                return (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-sans text-white font-medium">{row.date}</td>
                    {selectedMetal === 'gold' ? (
                      <>
                        <td className="py-3.5 px-4 text-amber-400 font-bold">{formatINR(row.gold24k)}</td>
                        <td className="py-3.5 px-4 text-slate-200">{formatINR(row.gold22k)}</td>
                        <td className="py-3.5 px-4 text-slate-400">{formatINR(row.high)}</td>
                        <td className="py-3.5 px-4 text-slate-500">{formatINR(row.low)}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3.5 px-4 text-slate-100 font-bold">{formatINR(row.silver)}</td>
                        <td className="py-3.5 px-4 text-slate-300">{formatINR(row.silver * 10)}</td>
                        <td className="py-3.5 px-4 text-slate-200">{formatINR(row.silver * 1000)}</td>
                      </>
                    )}
                    <td className={`py-3.5 px-4 text-right font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.change}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
