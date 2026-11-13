import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  RefreshCw, 
  Sun, 
  Moon, 
  MapPin, 
  Scale, 
  CheckCircle2, 
  Clock, 
  WifiOff, 
  User as UserIcon,
  X
} from 'lucide-react';
import { useRates } from '../context/RatesContext';
import { useAuth } from '../context/AuthContext';
import { SupportedCity, WeightUnit, Currency } from '../types';

const CITIES: SupportedCity[] = [
  'Coimbatore',
  'National',
  'Mumbai',
  'Delhi',
  'Chennai',
  'Bangalore',
  'Kolkata',
  'Hyderabad',
  'Ahmedabad',
  'Jaipur',
  'Pune',
  'Lucknow'
];

const UNITS: WeightUnit[] = ['1g', '8g', '10g', '100g', '1kg'];

export const Navbar: React.FC = () => {
  const { 
    selectedCity, 
    setSelectedCity, 
    selectedUnit, 
    setSelectedUnit, 
    currency,
    setCurrency,
    connectionStatus, 
    isSyncing, 
    refreshRates, 
    theme, 
    toggleTheme, 
    notifications,
    markNotificationAsRead,
    clearNotifications
  } = useRates();

  const { user, profile } = useAuth();
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#070d19]/90 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <img src="/gold-coin.svg" alt="Gold & Silver Rate" className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-amber-400">GOLD</span>
                <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-100">&</span>
                <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-300">SILVER</span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium hidden sm:block">
                Live Multi-Metals Bullion Platform
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Controls: City, Unit & Status */}
        <div className="hidden md:flex items-center space-x-3">
          {/* City Selector */}
          <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus-within:border-amber-500/60 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value as SupportedCity)}
              aria-label="Select Market City"
              className="bg-transparent border-none text-xs text-slate-100 focus:outline-none cursor-pointer pr-4"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-slate-100">
                  {c} {c === 'National' ? '(Benchmark)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-xs">
            <div className="px-2 py-1 text-slate-400 flex items-center">
              <Scale className="w-3.5 h-3.5 text-slate-400 mr-1" />
              <span className="hidden lg:inline text-[11px]">Unit:</span>
            </div>
            {UNITS.map((u) => (
              <button
                key={u}
                onClick={() => setSelectedUnit(u)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  selectedUnit === u
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-800 bg-slate-900/60">
            {connectionStatus === 'live' && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-400">Live Market</span>
              </>
            )}
            {connectionStatus === 'cached' && (
              <>
                <Clock className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300">Updated</span>
              </>
            )}
            {connectionStatus === 'syncing' && (
              <>
                <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                <span className="text-cyan-300">Syncing...</span>
              </>
            )}
            {connectionStatus === 'offline' && (
              <>
                <WifiOff className="w-3 h-3 text-rose-400" />
                <span className="text-rose-400">Offline</span>
              </>
            )}
          </div>
        </div>

        {/* Right Actions: Currency Toggle, Refresh, Notifications, Theme, Profile */}
        <div className="flex items-center space-x-2">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                currency === 'INR'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refreshRates()}
            disabled={isSyncing}
            title="Refresh Live Rates"
            aria-label="Refresh live rates"
            className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/60 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Notifications Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              title="Notifications"
              aria-label="View notifications"
              className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/60 rounded-lg transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-sm text-slate-100">Notifications</span>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 my-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No new notifications right now.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                          n.is_read ? 'opacity-70 hover:bg-slate-800/30' : 'bg-slate-800/40 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-amber-300">{n.title}</span>
                          {!n.is_read && (
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 mt-3 text-center">
                  <Link 
                    to="/notifications" 
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs text-amber-400 hover:underline font-medium"
                  >
                    View All Notifications & Price Alerts →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Navy Theme'}
            aria-label="Toggle theme mode"
            className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User Account / Profile */}
          {user ? (
            <Link
              to="/profile"
              className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-800 hover:border-amber-500/50 bg-slate-900/60 transition-colors group"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-xs font-medium text-slate-200 group-hover:text-amber-400 max-w-[100px] truncate hidden sm:inline">
                {profile?.full_name || 'My Account'}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-semibold shadow-md transition-all"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;
