import React, { useState } from 'react';
import { Bell, BellOff, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRates } from '../context/RatesContext';

interface AlertItem {
  id: string;
  metal: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: string;
}

export function PriceAlertsPage() {
  const { user } = useAuth();
  const { goldRates, silverRate } = useRates();

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: '1',
      metal: 'Gold 24K (per 10g)',
      targetPrice: 75000,
      condition: 'below',
      isActive: true,
      createdAt: new Date().toLocaleDateString(),
    },
    {
      id: '2',
      metal: 'Silver (per 1kg)',
      targetPrice: 92000,
      condition: 'above',
      isActive: true,
      createdAt: new Date().toLocaleDateString(),
    },
  ]);

  const [selectedMetal, setSelectedMetal] = useState<string>('Gold 24K (per 10g)');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice || isNaN(Number(targetPrice))) return;

    const newAlert: AlertItem = {
      id: Date.now().toString(),
      metal: selectedMetal,
      targetPrice: Number(targetPrice),
      condition,
      isActive: true,
      createdAt: new Date().toLocaleDateString(),
    };

    setAlerts([newAlert, ...alerts]);
    setTargetPrice('');
    setSuccessMsg('Price alert configured successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#070d19] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-400">Price Alerts</h1>
          <p className="text-slate-400 text-sm">Instant notifications when metals hit your target levels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Alert Form */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm h-fit">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-amber-400" />
            Set New Alert
          </h2>

          {successMsg && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAddAlert} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Select Metal / Unit
              </label>
              <select
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-400"
              >
                <option value="Gold 24K (per 10g)">Gold 24K (per 10g)</option>
                <option value="Gold 22K (per 10g)">Gold 22K (per 10g)</option>
                <option value="Gold 18K (per 10g)">Gold 18K (per 10g)</option>
                <option value="Silver (per 1kg)">Silver (per 1kg)</option>
                <option value="Silver (per 10g)">Silver (per 10g)</option>
                <option value="Copper (per 1kg)">Copper (per 1kg)</option>
                <option value="Aluminium (per 1kg)">Aluminium (per 1kg)</option>
                <option value="Platinum (per 1g)">Platinum (per 1g)</option>
                <option value="Palladium (per 1g)">Palladium (per 1g)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Alert Condition
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('above')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${condition === 'above' ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}
                >
                  Price Rises Above (≥)
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('below')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${condition === 'below' ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}
                >
                  Price Drops Below (≤)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Target Price (₹)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="e.g. 74500"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-amber-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Create Alert
            </button>
          </form>
        </div>

        {/* Existing Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center justify-between">
            <span>Your Active Alerts ({alerts.filter(a => a.isActive).length})</span>
            <span className="text-xs font-normal text-slate-400">Syncs with Browser Push & Email</span>
          </h2>

          {alerts.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>No price alerts configured yet. Add your first alert from the left panel.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-slate-900/60 border rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between transition-all ${alert.isActive ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/50 opacity-60'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${alert.isActive ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'}`}>
                    {alert.isActive ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200">{alert.metal}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Trigger when price is{' '}
                      <span className="font-semibold text-amber-300">
                        {alert.condition === 'above' ? 'greater than or equal to' : 'less than or equal to'} ₹{alert.targetPrice.toLocaleString('en-IN')}
                      </span>
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1 inline-block">Created: {alert.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${alert.isActive ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-slate-700 bg-slate-800 text-slate-400'}`}
                  >
                    {alert.isActive ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PriceAlertsPage;

