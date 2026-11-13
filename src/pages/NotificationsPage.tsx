import React, { useState } from 'react';
import { Bell, Check, Trash2, Plus, Sparkles, ShieldCheck, Mail, Smartphone } from 'lucide-react';
import { useRates } from '../context/RatesContext';
import { useAuth } from '../context/AuthContext';
import { PriceAlertModal } from '../components/PriceAlertModal';
import { formatINR } from '../services/rateService';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearNotifications,
    priceAlerts,
    deletePriceAlert
  } = useRates();

  const { profile, updateProfile } = useAuth();
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  // Preference switches
  const [emailNotif, setEmailNotif] = useState(profile?.email_notifications_enabled ?? true);
  const [smsNotif, setSmsNotif] = useState(profile?.sms_notifications_enabled ?? false);

  const handleToggleEmail = async () => {
    const next = !emailNotif;
    setEmailNotif(next);
    await updateProfile({ email_notifications_enabled: next });
  };

  const handleToggleSms = async () => {
    const next = !smsNotif;
    setSmsNotif(next);
    await updateProfile({ sms_notifications_enabled: next });
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Notifications & Price Alerts
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Stay updated with automated market shifts, morning opening prices, and user-defined price alerts.
          </p>
        </div>

        <button
          onClick={() => setAlertModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Price Alert</span>
        </button>
      </div>

      {/* Delivery Channel Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Email Digest & Alerts</h3>
              <p className="text-[11px] text-slate-400">Receive morning market opening briefing & major breakout alerts.</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={emailNotif}
            onChange={handleToggleEmail}
            className="w-5 h-5 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
          />
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">SMS / Android Push Alerts</h3>
              <p className="text-[11px] text-slate-400">Instant SMS dispatch to +91 verified Indian phone number.</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={smsNotif}
            onChange={handleToggleSms}
            className="w-5 h-5 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
          />
        </div>

      </div>

      {/* Active User Price Alerts Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-bold text-base text-white">Active Custom Price Alerts</h2>
            <p className="text-xs text-slate-400 mt-0.5">Automated triggers sent the moment market reaches your price target.</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
            {priceAlerts.length} Active
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {priceAlerts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-2">
              <Bell className="w-8 h-8 text-slate-600 mx-auto opacity-40" />
              <p>You haven't created any custom price alerts yet.</p>
              <button
                onClick={() => setAlertModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold"
              >
                + Set First Alert
              </button>
            </div>
          ) : (
            priceAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white capitalize text-sm">{alert.metal}</span>
                    {alert.carat && <span className="text-xs text-slate-300">{alert.carat}K</span>}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alert.condition === 'below' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {alert.condition.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-amber-400 font-mono font-extrabold text-base mt-1">
                    {formatINR(alert.target_rate)} / gram
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Created {new Date(alert.created_at).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => deletePriceAlert(alert.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                  title="Delete Alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notification Activity Log */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="font-bold text-base text-white">Notification History Log</h2>
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-xs text-slate-400 hover:text-amber-400"
            >
              Clear Log
            </button>
          )}
        </div>

        <div className="mt-4 divide-y divide-slate-800">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`py-3.5 px-3 rounded-xl transition-colors cursor-pointer ${
                n.is_read ? 'opacity-60 hover:bg-slate-800/30' : 'bg-slate-800/40 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">{n.title}</span>
                <span className="text-[10px] text-slate-500">
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{n.message}</p>
            </div>
          ))}
        </div>
      </div>

      <PriceAlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />

    </div>
  );
};
