import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp, 
  Smartphone, 
  ShieldCheck, 
  Coins, 
  CircleDot, 
  Clock, 
  ArrowRight,
  Download,
  Scale,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { useRates } from '../context/RatesContext';
import { GoldPriceCard } from '../components/GoldPriceCard';
import { SilverPriceCard } from '../components/SilverPriceCard';
import { InteractiveChart } from '../components/InteractiveChart';
import { JewelleryCalculator } from '../components/JewelleryCalculator';
import { PriceAlertModal } from '../components/PriceAlertModal';
import { Carat } from '../types';

export const HomePage: React.FC = () => {
  const { goldRates, silverRate, selectedCity, lastUpdated, rateSource } = useRates();
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedAlertCarat, setSelectedAlertCarat] = useState<Carat>(24);

  const openAlert = (carat: Carat = 24) => {
    setSelectedAlertCarat(carat);
    setAlertModalOpen(true);
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-950 p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-300/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Real-Time Bullion & Jewellery Market Tracker</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Live Gold & Silver Rates in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400">India</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Track verified 24K, 22K, 18K Gold and 99.9% Pure Silver rates across Mumbai, Delhi, Chennai and major Indian hubs. Calculate accurate jewellery costs with GST and setup real-time SMS/email alerts.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/gold-rate"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              <Coins className="w-4 h-4" />
              <span>Explore Gold Rates</span>
            </Link>

            <Link
              to="/silver-rate"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
            >
              <CircleDot className="w-4 h-4 text-slate-300" />
              <span>Explore Silver</span>
            </Link>

            <Link
              to="/download-apk"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-500/30 transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Download Android APK</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-400 pt-3">
            <span className="flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1" />
              BIS 916 Hallmark Calibrated
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 text-amber-400 mr-1" />
              Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Live'}
            </span>
          </div>
        </div>
      </section>

      {/* Primary Gold Cards Section (24K, 22K, 18K) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Today's Gold Rates</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Benchmark city: <span className="text-amber-400 font-semibold">{selectedCity}</span>. Purity breakdown for investments and jewellery.
            </p>
          </div>

          <Link to="/gold-rate" className="text-xs font-semibold text-amber-400 hover:underline flex items-center">
            <span>City Comparison</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {goldRates ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <GoldPriceCard rate={goldRates[24]} onAlertClick={() => openAlert(24)} />
            <GoldPriceCard rate={goldRates[22]} onAlertClick={() => openAlert(22)} />
            <GoldPriceCard rate={goldRates[18]} onAlertClick={() => openAlert(18)} />
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">Loading live gold prices...</div>
        )}
      </section>

      {/* Primary Silver Card Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <CircleDot className="w-5 h-5 text-slate-300" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Today's Silver Rate</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Spot physical silver bullion price per gram, 10g, 100g and 1 kg in {selectedCity}.
            </p>
          </div>

          <Link to="/silver-rate" className="text-xs font-semibold text-slate-300 hover:underline flex items-center">
            <span>Detailed Silver Table</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {silverRate ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SilverPriceCard rate={silverRate} onAlertClick={() => openAlert(24)} />
            
            {/* Quick Bullion Comparison Banner */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Gold to Silver Ratio
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {( (goldRates?.[24]?.rate_per_gram || 7850) / (silverRate.rate_per_gram || 94.5) ).toFixed(1)} : 1
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  The current gold-to-silver ratio indicates the number of silver ounces required to buy one ounce of gold. Historically, levels above 80 indicate silver is undervalued relative to gold.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Data Source: {rateSource}</span>
                <Link to="/live-market" className="text-amber-400 font-medium hover:underline">
                  Live Market Feed →
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Price Charts Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Interactive Price Charts</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect intraday hourly trends, 7-day, 30-day, and multi-month historical trajectories.
            </p>
          </div>
          <Link to="/charts" className="text-xs font-semibold text-amber-400 hover:underline flex items-center">
            <span>Full Chart Station</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <InteractiveChart initialMetal="gold" initialTimeframe="7d" />
      </section>

      {/* Jewellery Calculator Section */}
      <section className="space-y-4">
        <JewelleryCalculator />
      </section>

      {/* Android Mobile App Promotion Banner */}
      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 flex-shrink-0 flex items-center justify-center shadow-xl">
            <img src="/gold-coin.svg" alt="Gold & Silver App" className="w-14 h-14" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Download the Official Android App</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-lg">
              Get live push notifications for price drops, access offline rates, and track your bullion portfolio anytime on your Android device. Built with Capacitor.
            </p>
          </div>
        </div>

        <Link
          to="/download-apk"
          className="flex-shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl transition-all flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Android APK</span>
        </Link>
      </section>

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        defaultMetal="gold"
        defaultCarat={selectedAlertCarat}
      />

    </div>
  );
};
