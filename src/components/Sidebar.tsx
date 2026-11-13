import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Coins, 
  CircleDollarSign, 
  Factory, 
  Layers, 
  Gem, 
  ChartNoAxesCombined, 
  Bell, 
  FileText, 
  BellRing, 
  Settings, 
  User, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRates } from '../context/RatesContext';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, profile, signOut } = useAuth();
  const { notifications } = useRates();
  const navigate = useNavigate();

  const unreadNotifCount = notifications.filter(n => !n.is_read).length;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Gold Rates', path: '/gold-rate', icon: Coins, color: 'text-amber-400' },
    { label: 'Silver Rates', path: '/silver-rate', icon: CircleDollarSign, color: 'text-slate-300' },
    { label: 'Copper Rates', path: '/copper-rates', icon: Factory, color: 'text-orange-400' },
    { label: 'Aluminium Rates', path: '/aluminium-rates', icon: Layers, color: 'text-slate-400' },
    { label: 'Platinum & Palladium', path: '/platinum-palladium', icon: Gem, color: 'text-blue-300' },
    { label: 'Live Market Charts', path: '/live-charts', icon: ChartNoAxesCombined },
    { label: 'Price Alerts', path: '/price-alerts', icon: Bell },
    { label: 'Daily Reports', path: '/daily-reports', icon: FileText },
    { label: 'Notifications', path: '/notifications', icon: BellRing, badge: unreadNotifCount > 0 ? unreadNotifCount : undefined },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  const handleLogout = async () => {
    await signOut();
    if (onCloseMobile) onCloseMobile();
    navigate('/login');
  };

  return (
    <aside className="w-64 flex flex-col h-[calc(100vh-4rem)] sticky top-16 border-r border-slate-800 bg-[#070d19]/95 backdrop-blur-md p-4 transition-colors">
      
      {/* Navigation Links (12 items) */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Marketplace Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group
                ${isActive 
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-300 border-l-2 border-amber-400 font-semibold' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${item.color || 'text-slate-400 group-hover:text-amber-300'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* 13. Logout item */}
        <div className="pt-2 border-t border-slate-800/60 mt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-4 h-4 transition-transform group-hover:scale-110 text-rose-400" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>

      {/* User Footer Profile Status */}
      <div className="pt-3 border-t border-slate-800 mt-2">
        {user ? (
          <div className="flex items-center space-x-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs uppercase">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{profile?.full_name || 'Active Investor'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-xs text-slate-500">Guest Visitor</span>
            <NavLink to="/login" className="text-xs font-bold text-amber-400 hover:underline">
              Sign In
            </NavLink>
          </div>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;
