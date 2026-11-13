-- ====================================================================
-- GOLD & SILVER RATE PLATFORM - COMPLETE SUPABASE DATABASE SCHEMA
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing triggers/tables if re-running migration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    phone TEXT,
    full_name TEXT,
    avatar_url TEXT,
    preferred_currency TEXT DEFAULT 'INR',
    preferred_city TEXT DEFAULT 'National',
    preferred_unit TEXT DEFAULT '10g', -- '1g', '8g', '10g', '100g', '1kg'
    theme_preference TEXT DEFAULT 'navy-gold', -- 'navy-gold' or 'light'
    sms_notifications_enabled BOOLEAN DEFAULT FALSE,
    email_notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on profiles email & phone
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- 4. GOLD RATES TABLE (Latest verified & indicative rates)
CREATE TABLE IF NOT EXISTS public.gold_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carat INTEGER NOT NULL CHECK (carat IN (24, 22, 18)),
    purity_label TEXT NOT NULL, -- '99.9% Pure', '91.6% Pure (Jewellery)', '75.0% Pure'
    rate_per_gram NUMERIC(12, 2) NOT NULL,
    rate_per_8g NUMERIC(12, 2) NOT NULL,    -- 1 Pavan / Sovereign
    rate_per_10g NUMERIC(12, 2) NOT NULL,
    rate_per_100g NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    city TEXT DEFAULT 'National',
    change_24h NUMERIC(10, 2) DEFAULT 0.0,
    change_percentage_24h NUMERIC(5, 2) DEFAULT 0.0,
    high_24h NUMERIC(12, 2),
    low_24h NUMERIC(12, 2),
    source TEXT DEFAULT 'Verified Bullion Feeds',
    is_indicative BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gold_carat_city ON public.gold_rates(carat, city);

-- 5. SILVER RATES TABLE
CREATE TABLE IF NOT EXISTS public.silver_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purity_label TEXT DEFAULT '99.9% Pure Fine Silver',
    rate_per_gram NUMERIC(12, 2) NOT NULL,
    rate_per_10g NUMERIC(12, 2) NOT NULL,
    rate_per_100g NUMERIC(12, 2) NOT NULL,
    rate_per_kg NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    city TEXT DEFAULT 'National',
    change_24h NUMERIC(10, 2) DEFAULT 0.0,
    change_percentage_24h NUMERIC(5, 2) DEFAULT 0.0,
    high_24h NUMERIC(12, 2),
    low_24h NUMERIC(12, 2),
    source TEXT DEFAULT 'Verified Bullion Feeds',
    is_indicative BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_silver_city ON public.silver_rates(city);

-- 6. RATE HISTORY TABLE (For interactive financial charts)
CREATE TABLE IF NOT EXISTS public.rate_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metal TEXT NOT NULL CHECK (metal IN ('gold', 'silver')),
    carat INTEGER CHECK (carat IS NULL OR carat IN (24, 22, 18)),
    rate_per_gram NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    city TEXT DEFAULT 'National',
    period TEXT DEFAULT 'daily', -- 'intraday', 'daily', 'monthly'
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_metal_time ON public.rate_history(metal, carat, recorded_at DESC);

-- 7. USER FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    metal TEXT NOT NULL CHECK (metal IN ('gold', 'silver')),
    carat INTEGER,
    city TEXT DEFAULT 'National',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_metal_city_unique UNIQUE (user_id, metal, carat, city)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.user_favorites(user_id);

-- 8. USER NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    metal TEXT,
    notification_type TEXT DEFAULT 'rate_alert', -- 'rate_alert', 'system', 'market_update'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.user_notifications(user_id, is_read);

-- 9. USER PRICE ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.user_price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    metal TEXT NOT NULL CHECK (metal IN ('gold', 'silver')),
    carat INTEGER,
    target_rate NUMERIC(12, 2) NOT NULL,
    condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
    is_active BOOLEAN DEFAULT TRUE,
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_active ON public.user_price_alerts(metal, is_active);

-- 10. APP SETTINGS & METADATA
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gold_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.silver_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can view and update only their own profile
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 2. Gold Rates & Silver Rates: Publicly readable by everyone
CREATE POLICY "Gold rates are publicly readable" 
    ON public.gold_rates FOR SELECT 
    USING (true);

CREATE POLICY "Silver rates are publicly readable" 
    ON public.silver_rates FOR SELECT 
    USING (true);

-- Only service role can modify gold/silver rates
CREATE POLICY "Service role can manage gold rates" 
    ON public.gold_rates FOR ALL 
    TO service_role 
    USING (true);

CREATE POLICY "Service role can manage silver rates" 
    ON public.silver_rates FOR ALL 
    TO service_role 
    USING (true);

-- 3. Rate History: Publicly readable
CREATE POLICY "Rate history is publicly readable" 
    ON public.rate_history FOR SELECT 
    USING (true);

CREATE POLICY "Service role can insert rate history" 
    ON public.rate_history FOR INSERT 
    TO service_role 
    WITH CHECK (true);

-- 4. User Favorites: Private per user
CREATE POLICY "Users can view own favorites" 
    ON public.user_favorites FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" 
    ON public.user_favorites FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" 
    ON public.user_favorites FOR DELETE 
    USING (auth.uid() = user_id);

-- 5. Notifications: Private per user
CREATE POLICY "Users can view own notifications" 
    ON public.user_notifications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
    ON public.user_notifications FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" 
    ON public.user_notifications FOR DELETE 
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications" 
    ON public.user_notifications FOR INSERT 
    TO service_role 
    WITH CHECK (true);

-- 6. Price Alerts: Private per user
CREATE POLICY "Users can view own price alerts" 
    ON public.user_price_alerts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own price alerts" 
    ON public.user_price_alerts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own price alerts" 
    ON public.user_price_alerts FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own price alerts" 
    ON public.user_price_alerts FOR DELETE 
    USING (auth.uid() = user_id);

-- 7. App Settings: Public read, service_role write
CREATE POLICY "App settings publicly readable" 
    ON public.app_settings FOR SELECT 
    USING (true);

CREATE POLICY "Service role can manage app settings" 
    ON public.app_settings FOR ALL 
    TO service_role 
    USING (true);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, phone, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.phone,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Valued Investor'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- INITIAL VERIFIED SEED DATA (Indian Spot Reference)
-- ====================================================================

-- Gold Rates Seed
INSERT INTO public.gold_rates (carat, purity_label, rate_per_gram, rate_per_8g, rate_per_10g, rate_per_100g, currency, city, change_24h, change_percentage_24h, high_24h, low_24h, source, is_indicative)
VALUES 
(24, '99.9% Pure Fine Gold', 7850.00, 62800.00, 78500.00, 785000.00, 'INR', 'National', 45.00, 0.58, 7890.00, 7795.00, 'Verified Bullion Market Feeds', false),
(22, '91.6% Pure Standard Jewellery Gold', 7196.00, 57568.00, 71960.00, 719600.00, 'INR', 'National', 41.00, 0.57, 7235.00, 7145.00, 'Verified Bullion Market Feeds', false),
(18, '75.0% Pure Modern Jewellery Gold', 5888.00, 47104.00, 58880.00, 588800.00, 'INR', 'National', 34.00, 0.58, 5920.00, 5845.00, 'Verified Bullion Market Feeds', false)
ON CONFLICT DO NOTHING;

-- City specific rates (Mumbai, Delhi, Chennai, Bangalore, Kolkata)
INSERT INTO public.gold_rates (carat, purity_label, rate_per_gram, rate_per_8g, rate_per_10g, rate_per_100g, currency, city, change_24h, change_percentage_24h, high_24h, low_24h, source, is_indicative)
VALUES
(24, '99.9% Pure Fine Gold', 7855.00, 62840.00, 78550.00, 785500.00, 'INR', 'Mumbai', 40.00, 0.51, 7895.00, 7800.00, 'IBJA Mumbai Feed', false),
(22, '91.6% Pure Standard Jewellery Gold', 7200.00, 57600.00, 72000.00, 720000.00, 'INR', 'Mumbai', 37.00, 0.52, 7240.00, 7150.00, 'IBJA Mumbai Feed', false),
(24, '99.9% Pure Fine Gold', 7865.00, 62920.00, 78650.00, 786500.00, 'INR', 'Delhi', 50.00, 0.64, 7905.00, 7810.00, 'Delhi Bullion Market', false),
(22, '91.6% Pure Standard Jewellery Gold', 7210.00, 57680.00, 72100.00, 721000.00, 'INR', 'Delhi', 46.00, 0.64, 7250.00, 7160.00, 'Delhi Bullion Market', false),
(24, '99.9% Pure Fine Gold', 7880.00, 63040.00, 78800.00, 788000.00, 'INR', 'Chennai', 55.00, 0.70, 7920.00, 7820.00, 'Madras Jewellers Association', false),
(22, '91.6% Pure Standard Jewellery Gold', 7225.00, 57800.00, 72250.00, 722500.00, 'INR', 'Chennai', 50.00, 0.70, 7265.00, 7170.00, 'Madras Jewellers Association', false),
(24, '99.9% Pure Fine Gold', 7850.00, 62800.00, 78500.00, 785000.00, 'INR', 'Bangalore', 42.00, 0.54, 7890.00, 7795.00, 'Karnataka Bullion Association', false),
(22, '91.6% Pure Standard Jewellery Gold', 7195.00, 57560.00, 71950.00, 719500.00, 'INR', 'Bangalore', 39.00, 0.55, 7235.00, 7145.00, 'Karnataka Bullion Association', false),
(24, '99.9% Pure Fine Gold', 7850.00, 62800.00, 78500.00, 785000.00, 'INR', 'Kolkata', 40.00, 0.51, 7890.00, 7795.00, 'Calcutta Bullion Association', false),
(22, '91.6% Pure Standard Jewellery Gold', 7195.00, 57560.00, 71950.00, 719500.00, 'INR', 'Kolkata', 38.00, 0.53, 7235.00, 7145.00, 'Calcutta Bullion Association', false)
ON CONFLICT DO NOTHING;

-- Silver Rates Seed
INSERT INTO public.silver_rates (purity_label, rate_per_gram, rate_per_10g, rate_per_100g, rate_per_kg, currency, city, change_24h, change_percentage_24h, high_24h, low_24h, source, is_indicative)
VALUES 
('99.9% Pure Fine Silver', 94.50, 945.00, 9450.00, 94500.00, 'INR', 'National', 0.80, 0.85, 95.20, 93.40, 'Verified Bullion Market Feeds', false),
('99.9% Pure Fine Silver', 94.60, 946.00, 9460.00, 94600.00, 'INR', 'Mumbai', 0.75, 0.80, 95.30, 93.50, 'IBJA Mumbai Feed', false),
('99.9% Pure Fine Silver', 94.75, 947.50, 9475.00, 94750.00, 'INR', 'Delhi', 0.90, 0.96, 95.50, 93.60, 'Delhi Bullion Market', false),
('99.9% Pure Fine Silver', 98.00, 980.00, 9800.00, 98000.00, 'INR', 'Chennai', 1.00, 1.03, 98.80, 96.80, 'Madras Jewellers Association', false),
('99.9% Pure Fine Silver', 94.50, 945.00, 9450.00, 94500.00, 'INR', 'Bangalore', 0.80, 0.85, 95.20, 93.40, 'Karnataka Bullion Association', false),
('99.9% Pure Fine Silver', 94.50, 945.00, 9450.00, 94500.00, 'INR', 'Kolkata', 0.80, 0.85, 95.20, 93.40, 'Calcutta Bullion Association', false)
ON CONFLICT DO NOTHING;

-- App Settings Seed
INSERT INTO public.app_settings (key, value)
VALUES 
('market_status', '{"is_open": true, "session": "Regular Trading", "open_time": "09:00 IST", "close_time": "23:30 IST", "source_primary": "MCX / International Bullion Feeds"}'::jsonb),
('tax_rules', '{"gst_percentage": 3.0, "hallmarking_fee": 45.0, "typical_making_charges_percent": 12.0}'::jsonb),
('supported_cities', '["National", "Mumbai", "Delhi", "Chennai", "Bangalore", "Kolkata", "Hyderabad", "Ahmedabad", "Jaipur", "Pune", "Lucknow"]'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
