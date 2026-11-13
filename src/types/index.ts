export type Carat = 24 | 22 | 18;

export type MetalType = 'gold' | 'silver';

export type WeightUnit = '1g' | '8g' | '10g' | '100g' | '1kg';

export type SupportedCity = 
  | 'National'
  | 'Mumbai'
  | 'Delhi'
  | 'Chennai'
  | 'Bangalore'
  | 'Kolkata'
  | 'Hyderabad'
  | 'Ahmedabad'
  | 'Jaipur'
  | 'Pune'
  | 'Lucknow';

export interface GoldRate {
  id?: string;
  carat: Carat;
  purity_label: string;
  rate_per_gram: number;
  rate_per_8g: number;
  rate_per_10g: number;
  rate_per_100g: number;
  currency: string;
  city: SupportedCity | string;
  change_24h: number;
  change_percentage_24h: number;
  high_24h?: number;
  low_24h?: number;
  source: string;
  is_indicative: boolean;
  last_updated: string;
}

export interface SilverRate {
  id?: string;
  purity_label: string;
  rate_per_gram: number;
  rate_per_10g: number;
  rate_per_100g: number;
  rate_per_kg: number;
  currency: string;
  city: SupportedCity | string;
  change_24h: number;
  change_percentage_24h: number;
  high_24h?: number;
  low_24h?: number;
  source: string;
  is_indicative: boolean;
  last_updated: string;
}

export interface RateHistoryPoint {
  id?: string;
  metal: MetalType;
  carat?: Carat | null;
  rate_per_gram: number;
  currency: string;
  city: string;
  period: 'intraday' | 'daily' | 'monthly';
  recorded_at: string;
  formatted_time?: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  avatar_url?: string;
  preferred_currency: string;
  preferred_city: SupportedCity | string;
  preferred_unit: WeightUnit;
  theme_preference: 'navy-gold' | 'light';
  sms_notifications_enabled: boolean;
  email_notifications_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  metal: MetalType;
  carat?: Carat;
  city: string;
  created_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  metal?: MetalType;
  notification_type: 'rate_alert' | 'system' | 'market_update';
  is_read: boolean;
  created_at: string;
}

export interface UserPriceAlert {
  id: string;
  user_id: string;
  metal: MetalType;
  carat?: Carat;
  target_rate: number;
  condition: 'above' | 'below';
  is_active: boolean;
  triggered_at?: string;
  created_at: string;
}

export interface MarketStatus {
  isOpen: boolean;
  session: string;
  openTime: string;
  closeTime: string;
  sourcePrimary: string;
  lastSync: string;
}

// --- Phase 2 Types ---

export type MetalSymbol = 'XAU' | 'XAG' | 'XCU' | 'XAL' | 'XPT' | 'XPD';

export interface MetalRate {
  id?: string;
  symbol: MetalSymbol;
  name: string;
  price_inr: number;
  price_usd: number;
  price_per_gram_inr: number;
  price_per_10g_inr: number;
  price_per_kg_inr: number;
  price_per_tonne_inr: number;
  change_24h: number;
  change_percent_24h: number;
  last_updated: string;
  source: string;
}

export interface PushSubscription {
  id?: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at?: string;
}

export interface NotificationPreference {
  id?: string;
  user_id: string;
  gold_daily: boolean;
  silver_daily: boolean;
  copper_daily: boolean;
  aluminium_daily: boolean;
  platinum_daily: boolean;
  price_alerts_enabled: boolean;
  alert_time: string;
  created_at?: string;
  updated_at?: string;
}

export type Currency = 'INR' | 'USD' | 'EUR';

export interface PriceAlert {
  id?: string;
  user_id: string;
  metal: MetalSymbol | MetalType;
  target_price: number;
  condition: 'above' | 'below';
  is_active: boolean;
  created_at?: string;
}

