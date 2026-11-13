import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Coins, 
  CircleDollarSign, 
  ChartNoAxesCombined, 
  User 
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const tabs = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Gold', path: '/gold-rate', icon: Coins, highlight: 'gold' },
    { label: 'Silver', path: '/silver-rate', icon: CircleDollarSign, highlight: 'silver' },
    { label: 'Charts', path: '/live-charts', icon: ChartNoAxesCombined },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070d19]/95 backdrop-blur-xl border-t border-slate-800 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-all
                ${isActive 
                  ? 'text-amber-400 font-bold scale-105' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-1 ${
                  tab.highlight === 'gold' ? 'text-amber-400' :
                  tab.highlight === 'silver' ? 'text-slate-300' : ''
                }`} />
              </div>
              <span className="truncate max-w-[64px]">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
