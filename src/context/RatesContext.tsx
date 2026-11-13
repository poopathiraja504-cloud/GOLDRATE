import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { GoldRate, SilverRate, SupportedCity, WeightUnit, Carat, UserFavorite, UserNotification, UserPriceAlert } from '../types';
import { fetchLiveRates } from '../services/rateService';
import { subscribeToNetworkChanges } from '../lib/capacitor';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface RatesContextType {
  goldRates: Record<Carat, GoldRate> | null;
  silverRate: SilverRate | null;
  selectedCity: SupportedCity;
  setSelectedCity: (city: SupportedCity) => void;
  selectedUnit: WeightUnit;
  setSelectedUnit: (unit: WeightUnit) => void;
  isLoading: boolean;
  isSyncing: boolean;
  lastUpdated: string;
  rateSource: string;
  isIndicative: boolean;
  connectionStatus: 'live' | 'cached' | 'syncing' | 'offline';
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  refreshRates: () => Promise<void>;
  favorites: UserFavorite[];
  toggleFavorite: (metal: 'gold' | 'silver', carat?: Carat) => Promise<void>;
  isFavorite: (metal: 'gold' | 'silver', carat?: Carat) => boolean;
  notifications: UserNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  priceAlerts: UserPriceAlert[];
  addPriceAlert: (metal: 'gold' | 'silver', targetRate: number, condition: 'above' | 'below', carat?: Carat) => Promise<boolean>;
  deletePriceAlert: (id: string) => Promise<void>;
}

const RatesContext = createContext<RatesContextType | undefined>(undefined);

export const RatesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState<SupportedCity>('National');
  const [selectedUnit, setSelectedUnit] = useState<WeightUnit>('10g');
  const [goldRates, setGoldRates] = useState<Record<Carat, GoldRate> | null>(null);
  const [silverRate, setSilverRate] = useState<SilverRate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [rateSource, setRateSource] = useState<string>('Verified Bullion Market');
  const [isIndicative, setIsIndicative] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Favorites & Alerts
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([
    {
      id: 'notif-1',
      user_id: 'system',
      title: 'Bullion Market Opening',
      message: 'MCX & International bullion markets are active. Today 24K Gold opened at ₹7,850/g (+0.58%).',
      metal: 'gold',
      notification_type: 'market_update',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'notif-2',
      user_id: 'system',
      title: 'Silver Crosses ₹94/g',
      message: 'Silver 99.9% spot rate moved +₹0.80/g today, trading near ₹94,500/kg.',
      metal: 'silver',
      notification_type: 'rate_alert',
      is_read: false,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    }
  ]);
  const [priceAlerts, setPriceAlerts] = useState<UserPriceAlert[]>([]);

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem('gsr_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    } else {
      document.documentElement.className = 'dark';
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('gsr_theme', next);
    document.documentElement.className = next;
  };

  // Network monitoring
  useEffect(() => {
    const unsubscribe = subscribeToNetworkChanges((connected) => {
      setIsOnline(connected);
    });
    return unsubscribe;
  }, []);

  // Fetch rates callback
  const loadRates = useCallback(async (city: SupportedCity, showSpinner = false) => {
    if (showSpinner) setIsSyncing(true);
    try {
      const data = await fetchLiveRates(city);
      setGoldRates(data.gold);
      setSilverRate(data.silver);
      setRateSource(data.source);
      setIsIndicative(data.isIndicative);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      console.error('Failed to load rates:', err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Initial and city change load
  useEffect(() => {
    loadRates(selectedCity, !goldRates);
  }, [selectedCity, loadRates]);

  // Periodic automatic refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && isOnline) {
        loadRates(selectedCity, false);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [selectedCity, isOnline, loadRates]);

  const refreshRates = async () => {
    await loadRates(selectedCity, true);
  };

  // Connection status computation
  const connectionStatus = !isOnline
    ? 'offline'
    : isSyncing
    ? 'syncing'
    : isIndicative
    ? 'cached'
    : 'live';

  // Favorites handling
  useEffect(() => {
    const saved = localStorage.getItem('gsr_local_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.warn('Error reading favorites:', e);
      }
    }
  }, []);

  const toggleFavorite = async (metal: 'gold' | 'silver', carat?: Carat) => {
    const exists = favorites.some(
      (f) => f.metal === metal && (metal === 'silver' || f.carat === carat)
    );

    let updated: UserFavorite[];
    if (exists) {
      updated = favorites.filter(
        (f) => !(f.metal === metal && (metal === 'silver' || f.carat === carat))
      );
    } else {
      const newFav: UserFavorite = {
        id: 'fav-' + Date.now(),
        user_id: user?.id || 'guest',
        metal,
        carat,
        city: selectedCity,
        created_at: new Date().toISOString(),
      };
      updated = [...favorites, newFav];
    }

    setFavorites(updated);
    localStorage.setItem('gsr_local_favorites', JSON.stringify(updated));

    if (user && isSupabaseConfigured) {
      try {
        if (exists) {
          await supabase
            .from('user_favorites')
            .delete()
            .match({ user_id: user.id, metal, ...(carat ? { carat } : {}) });
        } else {
          await supabase.from('user_favorites').insert({
            user_id: user.id,
            metal,
            carat: carat ?? null,
            city: selectedCity,
          });
        }
      } catch (e) {
        console.warn('Supabase favorite sync error:', e);
      }
    }
  };

  const isFavorite = (metal: 'gold' | 'silver', carat?: Carat) => {
    return favorites.some(
      (f) => f.metal === metal && (metal === 'silver' || f.carat === carat)
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Price Alerts
  const addPriceAlert = async (
    metal: 'gold' | 'silver',
    targetRate: number,
    condition: 'above' | 'below',
    carat?: Carat
  ): Promise<boolean> => {
    const newAlert: UserPriceAlert = {
      id: 'alert-' + Date.now(),
      user_id: user?.id || 'guest',
      metal,
      carat,
      target_rate: targetRate,
      condition,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setPriceAlerts((prev) => [...prev, newAlert]);

    if (user && isSupabaseConfigured) {
      try {
        await supabase.from('user_price_alerts').insert({
          user_id: user.id,
          metal,
          carat: carat ?? null,
          target_rate: targetRate,
          condition,
          is_active: true,
        });
      } catch (e) {
        console.warn('Supabase price alert save error:', e);
      }
    }

    // Add immediate confirmation notification
    setNotifications((prev) => [
      {
        id: 'notif-alert-' + Date.now(),
        user_id: user?.id || 'guest',
        title: 'Price Alert Set',
        message: `We will notify you when ${metal.toUpperCase()} (${carat ? carat + 'K' : '99.9%'}) goes ${condition} ₹${targetRate}/g.`,
        metal,
        notification_type: 'system',
        is_read: false,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    return true;
  };

  const deletePriceAlert = async (id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
    if (user && isSupabaseConfigured) {
      try {
        await supabase.from('user_price_alerts').delete().eq('id', id);
      } catch (e) {
        console.warn('Error deleting alert:', e);
      }
    }
  };

  return (
    <RatesContext.Provider
      value={{
        goldRates,
        silverRate,
        selectedCity,
        setSelectedCity,
        selectedUnit,
        setSelectedUnit,
        isLoading,
        isSyncing,
        lastUpdated,
        rateSource,
        isIndicative,
        connectionStatus,
        theme,
        toggleTheme,
        refreshRates,
        favorites,
        toggleFavorite,
        isFavorite,
        notifications,
        markNotificationAsRead,
        clearNotifications,
        priceAlerts,
        addPriceAlert,
        deletePriceAlert,
      }}
    >
      {children}
    </RatesContext.Provider>
  );
};

export const useRates = () => {
  const context = useContext(RatesContext);
  if (!context) {
    throw new Error('useRates must be used within a RatesProvider');
  }
  return context;
};
