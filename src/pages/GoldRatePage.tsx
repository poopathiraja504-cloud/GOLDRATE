import React, { useState } from 'react';
import { 
  Coins, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Info,
  Calendar,
  Scale
} from 'lucide-react';
import { useRates } from '../context/RatesContext';
import { GoldPriceCard } from '../components/GoldPriceCard';
import { formatINR } from '../services/rateService';
import { PriceAlertModal } from '../components/PriceAlertModal';
import { JewelleryCalculator } from '../components/JewelleryCalculator';
import { Carat, SupportedCity } from '../types';

export const GoldRatePage: React.FC = () => {
  const { goldRates, selectedCity, setSelectedCity, lastUpdated, rateSource } = useRates();
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [targetCarat, setTargetCarat] = useState<Carat>(24);

  const cityComparison = [
    { city: 'Mumbai', rate24k: 7855, rate22k: 7200, change: '+₹40.00' },
    { city: 'Delhi', rate24k: 7865, rate22k: 7210, change: '+₹50.00' },
    { city: 'Chennai', rate24k: 7880, rate22k: 7225, change: '+₹55.00' },
    { city: 'Bangalore', rate24k: 7850, rate22k: 7195, change: '+₹42.00' },
    { city: 'Kolkata', rate24k: 7850, rate22k: 7195, change: '+₹40.00' },
    { city: 'Hyderabad', rate24k: 7860, rate22k: 7205, change: '+₹45.00' },
    { city: 'Ahmedabad', rate24k: 7858, rate22k: 7202, change: '+₹43.00' },
    { city: 'Jaipur', rate24k: 7862, rate22k: 7208, change: '+₹46.00' },
    { city: 'Pune', rate24k: 7856, rate22k: 7201, change: '+₹41.00' },
    { city: 'Lucknow', rate24k: 7864, rate22k: 7209, change: '+₹48.00' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Coins className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Gold Rate Today in {selectedCity}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verified Indian gold spot prices per gram, 8g (pavan), 10g and 100g. Calibrated against MCX & Bullion associations.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            Source: <span className="text-amber-400 font-medium">{rateSource}</span>
          </span>
        </div>
      </div>

      {/* Gold Rates Cards (24K, 22K, 18K) */}
      {goldRates && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <GoldPriceCard rate={goldRates[24]} onAlertClick={(c) => { setTargetCarat(c); setAlertModalOpen(true); }} />
          <GoldPriceCard rate={goldRates[22]} onAlertClick={(c) => { setTargetCarat(c); setAlertModalOpen(true); }} />
          <GoldPriceCard rate={goldRates[18]} onAlertClick={(c) => { setTargetCarat(c); setAlertModalOpen(true); }} />
        </div>
      )}

      {/* Comprehensive Weight Breakdown Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="font-bold text-base text-white">Gold Price Weight Table ({selectedCity})</h2>
          <span className="text-xs text-slate-400">Currency: INR (₹)</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Gold Weight</th>
                <th className="py-3 px-4 text-amber-400">24K Gold (99.9%)</th>
                <th className="py-3 px-4 text-amber-300">22K Gold (91.6%)</th>
                <th className="py-3 px-4 text-slate-300">18K Gold (75.0%)</th>
                <th className="py-3 px-4 text-right">Daily Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {[
                { label: '1 Gram', mult: 1 },
                { label: '8 Grams (1 Pavan / Sovereign)', mult: 8, highlight: true },
                { label: '10 Grams (1 Tola benchmark)', mult: 10, highlight: true },
                { label: '50 Grams', mult: 50 },
                { label: '100 Grams (Standard Biscuit)', mult: 100 },
                { label: '1 Kilogram (1000g Bullion Bar)', mult: 1000 },
              ].map((row, idx) => {
                const g24 = (goldRates?.[24]?.rate_per_gram || 7850) * row.mult;
                const g22 = (goldRates?.[22]?.rate_per_gram || 7196) * row.mult;
                const g18 = (goldRates?.[18]?.rate_per_gram || 5888) * row.mult;
                const chg = (goldRates?.[24]?.change_24h || 45) * row.mult;

                return (
                  <tr key={idx} className={row.highlight ? 'bg-amber-500/5 font-bold' : 'hover:bg-slate-800/30'}>
                    <td className="py-3.5 px-4 font-sans text-slate-200">{row.label}</td>
                    <td className="py-3.5 px-4 text-amber-400 font-bold">{formatINR(g24)}</td>
                    <td className="py-3.5 px-4 text-slate-200">{formatINR(g22)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{formatINR(g18)}</td>
                    <td className="py-3.5 px-4 text-right text-emerald-400">+{formatINR(chg)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Major Cities Gold Price Comparison Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-bold text-base text-white">City-Wise Gold Rate Comparison Today</h2>
            <p className="text-xs text-slate-400 mt-0.5">Local bullion association differences based on transport & state taxes.</p>
          </div>
          <MapPin className="w-5 h-5 text-amber-400" />
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-amber-400">24K (per 10g)</th>
                <th className="py-3 px-4 text-amber-300">22K (per 10g)</th>
                <th className="py-3 px-4">24h Movement</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {cityComparison.map((item) => (
                <tr key={item.city} className={`hover:bg-slate-800/30 ${selectedCity === item.city ? 'bg-amber-500/10 font-bold' : ''}`}>
                  <td className="py-3 px-4 font-sans text-white font-medium flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                    {item.city}
                  </td>
                  <td className="py-3 px-4 text-amber-400">{formatINR(item.rate24k * 10)}</td>
                  <td className="py-3 px-4 text-slate-200">{formatINR(item.rate22k * 10)}</td>
                  <td className="py-3 px-4 text-emerald-400">{item.change}</td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedCity(item.city as SupportedCity)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        selectedCity === item.city
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                          : 'border-slate-700 text-slate-300 hover:border-amber-400 hover:text-amber-300'
                      }`}
                    >
                      {selectedCity === item.city ? 'Active' : 'Select'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gold Purity Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>24 Carat Gold (999 Purity)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The purest form of gold with 99.9% purity. It is naturally soft and pliable, making it ideal for investment coins, bullion bars, and sovereign mints rather than delicate gemstone jewellery.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>22 Carat Gold (916 Hallmark)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Standard jewellery gold containing 91.6% pure gold alloyed with 8.4% copper and zinc for structural durability. Almost all Indian traditional bridal jewellery is crafted in certified 916 gold.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
          <div className="flex items-center space-x-2 text-slate-300 font-bold text-sm">
            <Info className="w-4 h-4" />
            <span>18 Carat Gold (750 Purity)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Composed of 75% pure gold and 25% other metals. Preferred for diamond-studded jewellery, modern rings, and watches due to its superior scratch resistance and gemstone-holding strength.
          </p>
        </div>
      </div>

      {/* Calculator Integration */}
      <JewelleryCalculator />

      <PriceAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        defaultMetal="gold"
        defaultCarat={targetCarat}
      />

    </div>
  );
};

