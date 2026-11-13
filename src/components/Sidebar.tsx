import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Coins, 
  CircleDot, 
  TrendingUp, 
  LineChart, 
  History, 
  Star, 
  Bell, 
  User, 
  Settings, 
  Smartphone, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRates } from '../context/RatesContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, signOut } = useAuth();
  const { notifications, favorites } = useRates();
  const navigate = useNavigate();

  const unreadNotifCount = notifications.filter(n => !n.is_read).length;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Gold Rate', path: '/gold-rate', icon: Coins, highlight: 'gold' },
    { label: 'Silver Rate', path: '/silver-rate', icon: CircleDot, highlight: 'silver' },
    { label: 'Live Market', path: '/live-market', icon: TrendingUp },
    { label: 'Price Charts', path: '/charts', icon: LineChart },
    { label: 'Rate History', path: '/history', icon: History },
    { label: 'Favorites', path: '/favorites', icon: Star, badge: favorites.length > 0 ? favorites.length : undefined },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotifCount > 0 ? unreadNotifCount : undefined },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Download Android App', path: '/download-apk', icon: Smartphone, special: true },
  ];

  const handleLogout = async () => {
    await signOut();
    if (onCloseMobile) onCloseMobile();
    navigate('/login');
  };

  return (
    <aside className="w-64 flex flex-col h-[calc(100vh-4rem)] sticky top-16 border-r border-slate-800 bg-[#070d19]/95 backdrop-blur-md p-4 transition-colors">
      
      {/* Navigation Links */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                ${isActive 
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border-l-2 border-amber-400 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }
                ${item.special ? 'border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  item.highlight === 'gold' ? 'text-amber-400' :
                  item.highlight === 'silver' ? 'text-slate-300' :
                  item.special ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-300'
                }`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}

              {item.special && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                  APK
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bullion Market Badge Box */}
      <div className="my-3 p-3 rounded-xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-transparent">
        <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India Bullion Tracking</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
          Real-time MCX & retail jewellery spot prices with 3% GST computation.
        </p>
      </div>

      {/* Logout Action (Item #12) */}
      <div className="pt-2 border-t border-slate-800">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout</span>
          </button>
        ) : (
          <NavLink
            to="/login"
            onClick={onCloseMobile}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
          >
            <span>Sign In / Register</span>
          </NavLink>
        )}
      </div>

    </aside>
  );
};
