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
