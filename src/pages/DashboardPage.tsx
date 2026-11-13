import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Coins, 
  CircleDot, 
  Bell, 
  Star, 
  TrendingUp, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRates } from '../context/RatesContext';
import { formatINR } from '../services/rateService';
import { PriceAlertModal } from '../components/PriceAlertModal';
import { InteractiveChart } from '../components/InteractiveChart';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { 
    goldRates, 
    silverRate, 
    selectedCity, 
    favorites, 
    priceAlerts, 
    deletePriceAlert,
    notifications,
    lastUpdated 
  } = useRates();

  const [alertModalOpen, setAlertModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0b1528] to-slate-900 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Investor Dashboard
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400">Market Open (09:00 - 23:30 IST)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Hello, {profile?.full_name || user?.email?.split('@')[0] || 'Bullion Investor'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Your primary market hub is set to <span className="text-amber-400 font-semibold">{selectedCity}</span>. Tracking live rates & customized price thresholds.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAlertModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Alert</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 24K Gold */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">24K Gold (1g)</span>
            <div className="text-xl font-extrabold text-white font-mono mt-1">
              {goldRates ? formatINR(goldRates[24].rate_per_gram) : '₹7,850.00'}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">+₹45.00 (+0.58%)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* 22K Gold */}
        <div className="p-4 rounded-xl border border-amber-500/20 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">22K Gold (10g)</span>
            <div className="text-xl font-extrabold text-white font-mono mt-1">
              {goldRates ? formatINR(goldRates[22].rate_per_10g) : '₹71,960.00'}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Standard Jewellery</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Silver */}
        <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Silver 99.9% (1 kg)</span>
            <div className="text-xl font-extrabold text-slate-200 font-mono mt-1">
              {silverRate ? formatINR(silverRate.rate_per_kg) : '₹94,500.00'}
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">+₹800.00 (+0.85%)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-700/40 text-slate-300">
            <CircleDot className="w-5 h-5" />
          </div>
        </div>

        {/* Active Alerts */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Active Price Alerts</span>
            <div className="text-xl font-extrabold text-amber-400 font-mono mt-1">
              {priceAlerts.length} Active
            </div>
            <span className="text-[10px] text-slate-400">Automated Monitoring</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
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
                        {formatINR(alert.target_rate)} / g
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
            <Link to="/notifications" className="text-xs text-amber-400 hover:underline">
              View All Market Notification Logs →
            </Link>
          </div>
        </div>

      </div>

      {/* Favorites Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <h3 className="font-bold text-sm text-white">Your Pinned Favorites</h3>
          </div>
          <Link to="/favorites" className="text-xs text-amber-400 hover:underline">
            Manage Pinned Items →
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Gold 24K (Benchmark)</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {goldRates ? formatINR(goldRates[24].rate_per_10g) : '₹78,500.00'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">10 Grams Fine Gold Bar</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Gold 22K (Jewellery)</div>
            <div className="text-xl font-bold text-amber-300 font-mono mt-1">
              {goldRates ? formatINR(goldRates[22].rate_per_8g) : '₹57,568.00'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">8g (1 Pavan Sovereign)</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Silver 99.9%</div>
            <div className="text-xl font-bold text-slate-200 font-mono mt-1">
              {silverRate ? formatINR(silverRate.rate_per_kg) : '₹94,500.00'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1">1 Kilogram Silver Bar</div>
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
