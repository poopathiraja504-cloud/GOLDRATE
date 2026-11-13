import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Coins, 
  CircleDollarSign, 
  Factory, 
  Layers, 
  Gem, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRates } from '../context/RatesContext';
import { PriceAlertModal } from '../components/PriceAlertModal';
import { InteractiveChart } from '../components/InteractiveChart';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { 
    goldRates, 
    silverRate, 
    copperRate,
    aluminiumRate,
    platinumRate,
    palladiumRate,
    currency,
    formatPrice,
    selectedCity, 
    priceAlerts, 
    deletePriceAlert,
    lastUpdated,
    isSyncing,
    refreshRates
  } = useRates();

  const [alertModalOpen, setAlertModalOpen] = useState(false);

  const metalsGrid = [
    {
      title: 'Gold 24K (99.9%)',
      price: goldRates ? goldRates[24].rate_per_10g : 78500,
      unit: currency === 'USD' ? '/ 10g' : '/ 10g',
      change: '+0.58%',
      isPositive: true,
      color: '#d4af37',
      link: '/gold-rate',
      icon: Coins,
      subtext: 'Fine Bullion Benchmark'
    },
    {
      title: 'Gold 22K (91.6%)',
      price: goldRates ? goldRates[22].rate_per_10g : 71960,
      unit: '/ 10g',
      change: '+0.57%',
      isPositive: true,
      color: '#f5d47a',
      link: '/gold-rate',
      icon: Sparkles,
      subtext: 'Standard Hallmarked Jewellery'
    },
    {
      title: 'Gold 18K (75.0%)',
      price: goldRates ? goldRates[18].rate_per_10g : 58875,
      unit: '/ 10g',
      change: '+0.58%',
      isPositive: true,
      color: '#e6ca65',
      link: '/gold-rate',
      icon: Coins,
      subtext: 'Modern Diamond Jewellery'
    },
    {
      title: 'Silver 99.9%',
      price: silverRate ? silverRate.rate_per_kg : 94500,
      unit: '/ 1kg',
      change: '+0.85%',
      isPositive: true,
      color: '#c0c0c0',
      link: '/silver-rate',
      icon: CircleDollarSign,
      subtext: 'Fine Investment Silver'
    },
    {
      title: 'Copper (LME/MCX)',
      price: copperRate.perKg || 720,
      unit: '/ 1kg',
      change: '+0.34%',
      isPositive: true,
      color: '#b87333',
      link: '/copper-rates',
      icon: Factory,
      subtext: 'High-Grade Cathode Copper'
    },
    {
      title: 'Aluminium',
      price: aluminiumRate.perKg || 220,
      unit: '/ 1kg',
      change: '-0.18%',
      isPositive: false,
      color: '#aaaaaa',
      link: '/aluminium-rates',
      icon: Layers,
      subtext: 'Standard Extrusion Grade'
    },
    {
      title: 'Platinum (Pt 999.5)',
      price: platinumRate.perGram ? platinumRate.perGram * 10 : 28500,
      unit: '/ 10g',
      change: '+0.85%',
      isPositive: true,
      color: '#e5e4e2',
      link: '/platinum-palladium',
      icon: Gem,
      subtext: 'Precious Investment Grade'
    },
    {
      title: 'Palladium (Pd 999.5)',
      price: palladiumRate.perGram ? palladiumRate.perGram * 10 : 29800,
      unit: '/ 10g',
      change: '-0.42%',
      isPositive: false,
      color: '#90cdf4',
      link: '/platinum-palladium',
      icon: Gem,
      subtext: 'Catalytic & Bullion Bar'
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0b1528] to-slate-900 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Live Financial Market Hub
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">Trading Session Active ({currency})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome, {profile?.full_name || user?.email?.split('@')[0] || 'Bullion Investor'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking 8 live commodities in <span className="text-amber-400 font-semibold">{selectedCity}</span>. Prices formatted in {currency}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => refreshRates()}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh Rates</span>
          </button>
          <button
            onClick={() => setAlertModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Set Alert</span>
          </button>
        </div>
      </div>

      {/* 8 Metal Rate Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <span>Primary Commodity Spot Benchmarks</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-normal">
              8 Live Assets
            </span>
          </h2>
          <span className="text-xs text-slate-500">
            Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Live'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metalsGrid.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Link
                key={idx}
                to={m.link}
                className="group p-4 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-amber-300 transition-colors">
                      {m.title}
                    </span>
                    <div
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: `${m.color}15`, color: m.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-xl font-black text-white font-mono tracking-tight">
                      {formatPrice(m.price)}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {m.unit}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className={`flex items-center text-xs font-bold ${m.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {m.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {m.change}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-amber-400 flex items-center gap-0.5 transition-colors">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Chart & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column (2 cols) */}
        <div className="lg:col-span-2">
          <InteractiveChart initialMetal="gold" initialTimeframe="7d" />
        </div>

        {/* Price Alerts Panel (1 col) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Your Price Alerts</h3>
              </div>
              <button
                onClick={() => setAlertModalOpen(true)}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                + New Alert
              </button>
            </div>

            <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {priceAlerts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-40" />
                  No custom price alerts configured.
                  <p className="mt-1 text-slate-400">Set a target to be notified when rates drop or rise.</p>
                </div>
              ) : (
                priceAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-1.5 font-semibold text-white">
                        <span className="capitalize">{alert.metal}</span>
                        {alert.carat && <span>{alert.carat}K</span>}
                        <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                          alert.condition === 'below' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {alert.condition.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-amber-400 font-mono font-bold mt-1">
                        {formatPrice(alert.target_rate)} / g
                      </div>
                    </div>

                    <button
                      onClick={() => deletePriceAlert(alert.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                      title="Remove Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <Link to="/price-alerts" className="text-xs text-amber-400 hover:underline">
              Manage All Price Alerts & Push Subscriptions →
            </Link>
          </div>
        </div>

      </div>

      <PriceAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        defaultMetal="gold"
      />

    </div>
  );
};

export default DashboardPage;
