import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { GoldRate, SilverRate, SupportedCity, WeightUnit, Carat, UserFavorite, UserNotification, UserPriceAlert, Currency } from '../types';
import { fetchLiveRates } from '../services/rateService';
import { subscribeToNetworkChanges } from '../lib/capacitor';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface MetalBenchmark {
  perGram: number;
  perKg?: number;
  per10g?: number;
  perTonne?: number;
  change: number;
}

interface RatesContextType {
  goldRates: Record<Carat, GoldRate> | null;
  silverRate: SilverRate | null;
  copperRate: MetalBenchmark;
  aluminiumRate: MetalBenchmark;
  platinumRate: MetalBenchmark;
  palladiumRate: MetalBenchmark;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convertPrice: (inrAmount: number) => number;
  formatPrice: (inrAmount: number) => string;
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
  const [selectedCity, setSelectedCity] = useState<SupportedCity>('Coimbatore');
  const [selectedUnit, setSelectedUnit] = useState<WeightUnit>('10g');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [goldRates, setGoldRates] = useState<Record<Carat, GoldRate> | null>(null);
  const [silverRate, setSilverRate] = useState<SilverRate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [rateSource, setRateSource] = useState<string>('Verified Bullion Market');
  const [isIndicative, setIsIndicative] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Industrial & Precious Metals benchmarks (INR base)
  const [copperRate, setCopperRate] = useState<MetalBenchmark>({
    perGram: 0.72,
    perKg: 720,
    perTonne: 720000,
    change: 0.34,
  });

  const [aluminiumRate, setAluminiumRate] = useState<MetalBenchmark>({
    perGram: 0.22,
    perKg: 220,
    perTonne: 220000,
    change: -0.18,
  });

  const [platinumRate, setPlatinumRate] = useState<MetalBenchmark>({
    perGram: 2850,
    per10g: 28500,
    change: 0.85,
  });

  const [palladiumRate, setPalladiumRate] = useState<MetalBenchmark>({
    perGram: 2980,
    per10g: 29800,
    change: -0.42,
  });

  // USD to INR conversion factor
  const USD_INR_RATE = 84.45;

  const convertPrice = useCallback((inrAmount: number): number => {
    if (currency === 'USD') {
      return Math.round((inrAmount / USD_INR_RATE) * 100) / 100;
    }
    return inrAmount;
  }, [currency]);

  const formatPrice = useCallback((inrAmount: number): string => {
    const converted = convertPrice(inrAmount);
    if (currency === 'USD') {
      return `$${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `₹${converted.toLocaleString('en-IN', { minimumFractionDigits: converted % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })}`;
  }, [currency, convertPrice]);

  // Favorites & Alerts
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([
    {
      id: 'notif-1',
      user_id: 'system',
      title: 'Bullion Market Active',
      message: 'MCX & International bullion markets are active. 24K Gold opened at ₹7,850/g (+0.58%).',
      metal: 'gold',
      notification_type: 'market_update',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'notif-2',
      user_id: 'system',
      title: 'Silver Spot Benchmark',
      message: 'Silver 99.9% spot rate moved +0.85% today, trading near ₹94,500/kg.',
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

  useEffect(() => {
    loadRates(selectedCity, !goldRates);
  }, [selectedCity, loadRates]);

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

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

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
        copperRate,
        aluminiumRate,
        platinumRate,
        palladiumRate,
        currency,
        setCurrency,
        convertPrice,
        formatPrice,
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

export default RatesContext;
