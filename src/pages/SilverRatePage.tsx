import React, { useState } from 'react';
import { 
  CircleDot, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Scale, 
  Sparkles 
} from 'lucide-react';
import { useRates } from '../context/RatesContext';
import { SilverPriceCard } from '../components/SilverPriceCard';
import { formatINR } from '../services/rateService';
import { PriceAlertModal } from '../components/PriceAlertModal';
import { SupportedCity } from '../types';

export const SilverRatePage: React.FC = () => {
  const { silverRate, selectedCity, setSelectedCity, lastUpdated, rateSource } = useRates();
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  const cityComparison = [
    { city: 'Chennai', ratePerKg: 98000, ratePerGram: 98.00, change: '+₹1,000.00' },
    { city: 'Mumbai', ratePerKg: 94600, ratePerGram: 94.60, change: '+₹750.00' },
    { city: 'Delhi', ratePerKg: 94750, ratePerGram: 94.75, change: '+₹900.00' },
    { city: 'Bangalore', ratePerKg: 94500, ratePerGram: 94.50, change: '+₹800.00' },
    { city: 'Kolkata', ratePerKg: 94500, ratePerGram: 94.50, change: '+₹800.00' },
    { city: 'Hyderabad', ratePerKg: 94900, ratePerGram: 94.90, change: '+₹850.00' },
    { city: 'Ahmedabad', ratePerKg: 94650, ratePerGram: 94.65, change: '+₹780.00' },
    { city: 'Jaipur', ratePerKg: 94700, ratePerGram: 94.70, change: '+₹810.00' },
    { city: 'Pune', ratePerKg: 94620, ratePerGram: 94.62, change: '+₹760.00' },
    { city: 'Lucknow', ratePerKg: 94720, ratePerGram: 94.72, change: '+₹820.00' },
  ];

  const gramRate = silverRate?.rate_per_gram || 94.50;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <CircleDot className="w-6 h-6 text-slate-300" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Silver Rate Today in {selectedCity}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Fine 99.9% pure silver spot prices per gram, 10g, 100g, and 1 kg in Indian Rupees.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="p-2 rounded-xl bg-slate-900 border border-slate-800">
            Source: <span className="text-slate-300 font-medium">{rateSource}</span>
          </span>
        </div>
      </div>

      {/* Silver Card */}
      {silverRate && (
        <div className="max-w-2xl">
          <SilverPriceCard rate={silverRate} onAlertClick={() => setAlertModalOpen(true)} />
        </div>
      )}

      {/* Silver Weight Breakdown Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-bold text-base text-white">Silver Price Weight Chart ({selectedCity})</h2>
            <p className="text-xs text-slate-400 mt-0.5">Bullion wholesale & retail slab breakdown.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">999 PURITY</span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Silver Weight</th>
                <th className="py-3 px-4 text-slate-200">Rate (INR ₹)</th>
                <th className="py-3 px-4">Daily Change</th>
                <th className="py-3 px-4 text-right">Includes 3% GST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {[
                { label: '1 Gram', grams: 1 },
                { label: '10 Grams (1 Tola)', grams: 10, highlight: true },
                { label: '50 Grams', grams: 50 },
                { label: '100 Grams', grams: 100, highlight: true },
                { label: '500 Grams (Half Kg)', grams: 500 },
                { label: '1 Kilogram (1000g Bullion Bar)', grams: 1000, highlight: true },
                { label: '5 Kilograms Industrial Ingot', grams: 5000 },
              ].map((row, idx) => {
                const price = gramRate * row.grams;
                const change = (silverRate?.change_24h || 0.8) * row.grams;
                const withGst = price * 1.03;

                return (
                  <tr key={idx} className={row.highlight ? 'bg-slate-800/40 font-bold' : 'hover:bg-slate-800/20'}>
                    <td className="py-3.5 px-4 font-sans text-slate-200">{row.label}</td>
                    <td className="py-3.5 px-4 text-slate-100 font-bold text-sm">{formatINR(price)}</td>
                    <td className="py-3.5 px-4 text-emerald-400">+{formatINR(change)}</td>
                    <td className="py-3.5 px-4 text-right text-slate-400">{formatINR(withGst)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Major Cities Silver Price Comparison */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-bold text-base text-white">City-Wise Silver Rate Comparison</h2>
            <p className="text-xs text-slate-400 mt-0.5">Southern markets such as Chennai traditionally reflect higher logistics & demand premiums.</p>
          </div>
          <MapPin className="w-5 h-5 text-slate-300" />
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-slate-200">Rate per 1 kg</th>
                <th className="py-3 px-4 text-slate-300">Rate per 10g</th>
                <th className="py-3 px-4">24h Movement</th>
                <th className="py-3 px-4 text-right">Select City</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {cityComparison.map((item) => (
                <tr key={item.city} className={`hover:bg-slate-800/30 ${selectedCity === item.city ? 'bg-slate-800/60 font-bold' : ''}`}>
                  <td className="py-3 px-4 font-sans text-white font-medium flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {item.city}
                  </td>
                  <td className="py-3 px-4 text-slate-100">{formatINR(item.ratePerKg)}</td>
                  <td className="py-3 px-4 text-slate-300">{formatINR(item.ratePerGram * 10)}</td>
                  <td className="py-3 px-4 text-emerald-400">{item.change}</td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedCity(item.city as SupportedCity)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        selectedCity === item.city
                          ? 'bg-slate-200 text-slate-950 font-bold border-slate-200'
                          : 'border-slate-700 text-slate-300 hover:border-slate-300 hover:text-white'
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

      <PriceAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        defaultMetal="silver"
      />

    </div>
  );
};
