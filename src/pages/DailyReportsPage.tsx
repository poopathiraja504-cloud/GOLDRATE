import React, { useState } from 'react';
import { FileText, Calendar, Download, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { useRates } from '../context/RatesContext';

interface DaySummary {
  date: string;
  gold24k: number;
  gold22k: number;
  silver: number;
  copper: number;
  aluminium: number;
  platinum: number;
  changePercent: number;
}

export function DailyReportsPage() {
  const { lastUpdated } = useRates();
  const [selectedMonth, setSelectedMonth] = useState<string>('current');

  const reportRecords: DaySummary[] = [
    { date: 'Today (Live)', gold24k: 7380, gold22k: 6765, silver: 89.2, copper: 720, aluminium: 220, platinum: 2850, changePercent: 0.42 },
    { date: 'Yesterday', gold24k: 7350, gold22k: 6737, silver: 88.7, copper: 718, aluminium: 221, platinum: 2835, changePercent: -0.15 },
    { date: '2 days ago', gold24k: 7360, gold22k: 6746, silver: 89.0, copper: 715, aluminium: 219, platinum: 2840, changePercent: 0.28 },
    { date: '3 days ago', gold24k: 7340, gold22k: 6728, silver: 88.2, copper: 712, aluminium: 218, platinum: 2820, changePercent: 0.12 },
    { date: '4 days ago', gold24k: 7330, gold22k: 6719, silver: 87.9, copper: 710, aluminium: 217, platinum: 2810, changePercent: -0.32 },
    { date: '5 days ago', gold24k: 7355, gold22k: 6742, silver: 88.4, copper: 714, aluminium: 219, platinum: 2830, changePercent: 0.54 },
    { date: '6 days ago', gold24k: 7315, gold22k: 6705, silver: 87.5, copper: 708, aluminium: 216, platinum: 2800, changePercent: 0.18 },
  ];

  const handleDownload = (format: 'CSV' | 'PDF') => {
    alert(`Downloading Daily Metals Report (${format})... Your download will begin shortly.`);
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100">Daily Market Reports</h1>
            <p className="text-slate-400 text-sm">Official daily closing benchmarks and historical trends</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownload('CSV')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={() => handleDownload('PDF')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 shadow-lg shadow-amber-500/20 hover:brightness-105 transition-all"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-300 font-semibold">
            <Calendar className="w-4 h-4 text-amber-400" />
            Recent Daily Benchmarks
          </div>
          <span className="text-xs text-slate-500">Updated: {new Date(lastUpdated).toLocaleDateString('en-IN')}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs uppercase font-semibold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Gold 24K (₹/g)</th>
                <th className="px-6 py-4">Gold 22K (₹/g)</th>
                <th className="px-6 py-4">Silver (₹/g)</th>
                <th className="px-6 py-4">Copper (₹/kg)</th>
                <th className="px-6 py-4">Aluminium (₹/kg)</th>
                <th className="px-6 py-4">Platinum (₹/g)</th>
                <th className="px-6 py-4">Day Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reportRecords.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200">{row.date}</td>
                  <td className="px-6 py-4 font-semibold text-amber-300">₹{row.gold24k.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-amber-200/90">₹{row.gold22k.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-semibold text-slate-300">₹{row.silver.toFixed(2)}</td>
                  <td className="px-6 py-4 text-orange-300">₹{row.copper}</td>
                  <td className="px-6 py-4 text-slate-400">₹{row.aluminium}</td>
                  <td className="px-6 py-4 text-slate-200">₹{row.platinum}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${row.changePercent >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {row.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {row.changePercent >= 0 ? '+' : ''}{row.changePercent}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DailyReportsPage;

