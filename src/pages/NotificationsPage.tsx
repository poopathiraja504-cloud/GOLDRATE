import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  BellOff, 
  Check, 
  Trash2, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useRates } from '../context/RatesContext';
import { useAuth } from '../context/AuthContext';
import { PriceAlertModal } from '../components/PriceAlertModal';
import { formatINR } from '../services/rateService';
import { pushNotificationService } from '../services/pushNotificationService';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearNotifications,
    priceAlerts,
    deletePriceAlert
  } = useRates();

  const { user } = useAuth();
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  // Push subscription state
  const [pushStatus, setPushStatus] = useState<'subscribed' | 'denied' | 'default' | 'unsupported'>('default');
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Metal notification preferences
  const [prefs, setPrefs] = useState({
    goldDaily: true,
    silverDaily: true,
    copperDaily: false,
    aluminiumDaily: false,
    platinumDaily: false,
    priceMovementAlerts: true,
    alertTime: '09:00',
  });

  useEffect(() => {
    pushNotificationService.getSubscriptionStatus().then(status => {
      setPushStatus(status);
    });

    const saved = localStorage.getItem('gsr_push_preferences');
    if (saved) {
      try {
        setPrefs(JSON.parse(saved));
      } catch (e) {
        console.warn('Prefs error:', e);
      }
    }
  }, []);

  const handleTogglePush = async () => {
    setIsSubscribing(true);
    setStatusMessage('');
    try {
      if (pushStatus === 'subscribed') {
        await pushNotificationService.unsubscribeFromPush(user?.id);
        setPushStatus('default');
        setStatusMessage('Browser push notifications disabled.');
      } else {
        const sub = await pushNotificationService.subscribeToPush(user?.id);
        if (sub) {
          setPushStatus('subscribed');
          setStatusMessage('Browser push notifications enabled! You will receive daily metal rate updates.');
          pushNotificationService.sendLocalNotification('Notifications Active', {
            body: 'You are now subscribed to live GOLDSILVERRATE market updates.'
          });
        } else {
          setPushStatus('denied');
          setStatusMessage('Permission was denied or push is unsupported in this browser window.');
        }
      }
    } catch (e) {
      setStatusMessage('Error updating push subscription.');
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  const handleTogglePref = (key: keyof typeof prefs) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    localStorage.setItem('gsr_push_preferences', JSON.stringify(updated));
  };

  const handleTimeChange = (time: string) => {
    const updated = { ...prefs, alertTime: time };
    setPrefs(updated);
    localStorage.setItem('gsr_push_preferences', JSON.stringify(updated));
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <BellRing className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Browser Push & Rate Alerts
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Web Push notifications for daily gold, silver, industrial metals and custom price breaches.
          </p>
        </div>

        <button
          onClick={() => setAlertModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-md shadow-amber-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Price Alert</span>
        </button>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-2 text-sm ${pushStatus === 'subscribed' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Push Notification Activation Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 to-[#0c182e] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2.5 h-2.5 rounded-full ${pushStatus === 'subscribed' ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <h2 className="text-lg font-bold text-white">Browser Push Notifications</h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pushStatus === 'subscribed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'}`}>
              {pushStatus === 'subscribed' ? 'Subscribed' : pushStatus === 'denied' ? 'Permission Denied' : 'Disabled'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Powered by Web Push API and Service Workers. Receive alerts even when the browser tab is closed.
          </p>
        </div>

        <button
          onClick={handleTogglePush}
          disabled={isSubscribing}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            pushStatus === 'subscribed'
              ? 'bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 border border-slate-700'
              : 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-105'
          }`}
        >
          {isSubscribing ? (
            'Processing...'
          ) : pushStatus === 'subscribed' ? (
            <>
              <BellOff className="w-4 h-4" />
              <span>Disable Push</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              <span>Enable Browser Push</span>
            </>
          )}
        </button>
      </div>

      {/* Notification Categories & Preferences */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-6">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>Automated Daily Updates Subscription</span>
          <span className="text-xs text-slate-500 font-normal">Choose which daily rates to receive</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <div>
              <span className="text-sm font-semibold text-amber-300">Daily Gold Rate Updates</span>
              <p className="text-[11px] text-slate-400">24K, 22K & 18K morning market bench</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.goldDaily}
              onChange={() => handleTogglePref('goldDaily')}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <div>
              <span className="text-sm font-semibold text-slate-200">Daily Silver Rate Updates</span>
              <p className="text-[11px] text-slate-400">99.9% fine silver per 10g & 1kg</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.silverDaily}
              onChange={() => handleTogglePref('silverDaily')}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <div>
              <span className="text-sm font-semibold text-orange-400">Copper Rate Updates</span>
              <p className="text-[11px] text-slate-400">LME & MCX industrial cathode</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.copperDaily}
              onChange={() => handleTogglePref('copperDaily')}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <div>
              <span className="text-sm font-semibold text-slate-300">Aluminium Rate Updates</span>
              <p className="text-[11px] text-slate-400">Standard industrial ingot rate</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.aluminiumDaily}
              onChange={() => handleTogglePref('aluminiumDaily')}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <div>
              <span className="text-sm font-semibold text-blue-300">Platinum & Palladium</span>
              <p className="text-[11px] text-slate-400">Investment & catalyst metals</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.platinumDaily}
              onChange={() => handleTogglePref('platinumDaily')}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <div>
              <span className="text-sm font-semibold text-emerald-400">Significant Price Volatility</span>
              <p className="text-[11px] text-slate-400">Immediate alert on &gt;1.5% swings</p>
            </div>
            <input
              type="checkbox"
              checked={prefs.priceMovementAlerts}
              onChange={() => handleTogglePref('priceMovementAlerts')}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Time Picker */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">Preferred Daily Notification Time:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={prefs.alertTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
            />
            <span className="text-xs text-slate-500">IST (Indian Standard Time)</span>
          </div>
        </div>
      </div>

      {/* User Custom Price Alerts */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white">Configured Target Price Thresholds</h3>
            <p className="text-xs text-slate-400">Instant browser alert trigger when live price breaches your target</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            {priceAlerts.length} Active
          </span>
        </div>

        <div className="mt-4">
          {priceAlerts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-40" />
              No price thresholds active. Click "New Price Alert" above to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {priceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-1.5 font-bold text-sm text-white">
                      <span className="capitalize">{alert.metal}</span>
                      {alert.carat && <span>{alert.carat}K</span>}
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                        alert.condition === 'below' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {alert.condition}
                      </span>
                    </div>
                    <div className="text-amber-400 font-mono font-bold text-base mt-1">
                      {formatINR(alert.target_rate)} / g
                    </div>
                    <span className="text-[10px] text-slate-500">Created {new Date(alert.created_at).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => deletePriceAlert(alert.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Remove Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification Logs */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white">Notification History</h3>
            <p className="text-xs text-slate-400">Archive of market updates and trigger messages</p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-xs text-slate-400 hover:text-rose-400 font-medium"
            >
              Clear Log History
            </button>
          )}
        </div>

        <div className="mt-4 divide-y divide-slate-800/60">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No notifications logged.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="py-4 flex items-start justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-400">{n.title}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(n.created_at).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{n.message}</p>
                </div>

                {!n.is_read && (
                  <button
                    onClick={() => markNotificationAsRead(n.id)}
                    className="p-1.5 text-slate-500 hover:text-emerald-400 rounded transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
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

export default NotificationsPage;
