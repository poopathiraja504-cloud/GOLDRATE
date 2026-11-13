# 🌟 Gold & Silver Rate Tracking Platform + Android APK

A modern, high-performance financial tracking web application and native Android APK built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, **Recharts**, **Supabase** (Auth, PostgreSQL, Row Level Security, Edge Functions), and **Capacitor**.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Features Implemented](#features-implemented)
4. [Supabase Setup & Database Migration](#supabase-setup--database-migration)
5. [Authentication Setup Guide](#authentication-setup-guide)
   - [Google OAuth](#1-google-oauth)
   - [Email & Password](#2-email--password)
   - [Email OTP](#3-email-otp)
   - [Phone SMS OTP (+91)](#4-phone-sms-otp-91)
   - [Forgot & Reset Password](#5-forgot--reset-password)
6. [Live Market Feed & Supabase Edge Functions](#live-market-feed--supabase-edge-functions)
7. [Running the Website Locally](#running-the-website-locally)
8. [Building the Android APK with Capacitor](#building-the-android-apk-with-capacitor)
9. [Deployment Guide (Vercel & Netlify)](#deployment-guide-vercel--netlify)
10. [Completed Deliverables Checklist](#completed-deliverables-checklist)

---

## 1. Project Overview
- **Application Name**: Gold and Silver Rate
- **Type**: Live Bullion Rate & Jewellery Cost Estimation Platform
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Backend & Database**: Supabase PostgreSQL with strict Row Level Security (RLS)
- **Authentication**: Supabase Auth (Google OAuth, Email/Password, Email OTP, Phone SMS OTP)
- **Mobile**: Android APK powered by Capacitor (`com.goldsilverrate.app`) + PWA (Progressive Web App with Service Worker & Offline Cache)
- **Currency**: Indian Rupees (₹) with Indian Lakhs/Crores numbering formatting

---

## 2. Folder Structure
```
gold-silver-rate/
├── android/                             # Complete Native Android Capacitor Studio Project
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/AndroidManifest.xml # Permissions (INTERNET, ACCESS_NETWORK_STATE)
│   └── build.gradle
├── public/
│   ├── gold-coin.svg                    # Brand bullion logo & high-res vector icon
│   ├── manifest.json                    # PWA Web App Manifest
│   ├── sw.js                            # PWA Service Worker (Offline Cache & Network First)
│   ├── offline.html                     # Elegant Offline Fallback Page
│   └── _redirects                       # Netlify SPA client routing
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                   # Top navigation with City & Unit toggles & Notifications
│   │   ├── Sidebar.tsx                  # 12 Navigation Items specified in Master Prompt
│   │   ├── MobileBottomNav.tsx          # Mobile bottom navigation bar
│   │   ├── GoldPriceCard.tsx            # 24K, 22K, 18K Price cards with 24h change & tabs
│   │   ├── SilverPriceCard.tsx          # Silver 1g, 10g, 100g, 1kg cards with silver theme
│   │   ├── InteractiveChart.tsx         # Recharts: Today, 7D, 30D, 6M, 1Y Area gradients
│   │   ├── JewelleryCalculator.tsx      # Retail Jewellery Invoice Estimator (Making charges + 3% GST + Hallmark)
│   │   ├── PriceAlertModal.tsx          # Modal to create user price alerts
│   │   ├── PWAInstallPrompt.tsx         # Add to Home Screen banner
│   │   └── Layout.tsx                   # Master responsive app layout wrapper
│   ├── context/
│   │   ├── AuthContext.tsx              # Supabase Auth provider (Google, Email, OTP, Phone)
│   │   └── RatesContext.tsx             # Rates state, city offsets, auto-refresh & notifications
│   ├── lib/
│   │   ├── supabase.ts                  # Supabase client with graceful offline fallback
│   │   └── capacitor.ts                 # Android status bar, splash screen & back button handler
│   ├── pages/                           # All 22 Required Pages
│   │   ├── HomePage.tsx                 # Live hero, ticker, cards, chart teaser, calculator
│   │   ├── LoginPage.tsx                # Email, password, show/hide, Google OAuth button
│   │   ├── RegisterPage.tsx             # Full name, email, strong password validator
│   │   ├── GoogleCallbackPage.tsx       # OAuth redirection handler
│   │   ├── EmailOtpPage.tsx             # 6-digit OTP verification with 60s cooldown
│   │   ├── PhoneOtpPage.tsx             # Indian (+91) 6-digit SMS OTP verification
│   │   ├── ForgotPasswordPage.tsx       # Password recovery email request
│   │   ├── ResetPasswordPage.tsx        # Password update with new password confirmation
│   │   ├── DashboardPage.tsx            # Complete investor dashboard with watchlist
│   │   ├── GoldRatePage.tsx             # Dedicated 24K, 22K, 18K city comparison dashboard
│   │   ├── SilverRatePage.tsx           # Dedicated Silver rate slab & city comparison
│   │   ├── LiveMarketPage.tsx           # Bullion terminal, LBMA spot, USD/INR & formula transparency
│   │   ├── PriceChartsPage.tsx          # Full-size technical price chart station
│   │   ├── RateHistoryPage.tsx          # Historical archives, closing prices & spreads
│   │   ├── FavoritesPage.tsx            # Pinned items watchlist
│   │   ├── NotificationsPage.tsx        # Notification center & price alerts management
│   │   ├── ProfilePage.tsx              # Investor profile & city/unit preferences
│   │   ├── SettingsPage.tsx             # Theme toggler (Navy/Gold vs Light), cache clearer
│   │   ├── DownloadApkPage.tsx          # Android APK download portal with install guide
│   │   ├── AboutUsPage.tsx              # Mission and bullion methodology
│   │   ├── ContactUsPage.tsx            # Dealer and investor inquiries form
│   │   ├── PrivacyPolicyPage.tsx        # Privacy policy & data protection
│   │   └── TermsConditionsPage.tsx      # Statutory financial disclaimer
│   ├── services/
│   │   └── rateService.ts               # Spot market algorithms, city offsets, caching & GST math
│   ├── types/
│   │   └── index.ts                     # TypeScript interfaces
│   ├── App.tsx                          # App routing structure
│   ├── index.css                        # Tailwind v4 setup & custom theme variables
│   └── main.tsx                         # React 19 root
├── supabase/
│   ├── schema.sql                       # Complete PostgreSQL schema, RLS, triggers & seed data
│   └── functions/
│       └── fetch-rates/
│           └── index.ts                 # Deno Edge Function for automated market updates
├── capacitor.config.ts                  # Capacitor Android configuration
├── vercel.json                          # Vercel SPA routing rules
└── .env.example                         # Environment variables guide
```

---

## 3. Features Implemented

### 🎨 Premium UI/UX Design
- **Theme**: Premium Dark Navy (`#070d19`) with Gold (`#eab308`) and Silver (`#cbd5e1`) accents.
- **Light Theme Toggle**: Seamless switch to crisp daylight mode.
- **Responsive Navigation**: Full 12-item sidebar for desktop and streamlined 5-tab bottom navigation for mobile/Android APK.
- **Smooth Animations**: Pulse indicators, area chart gradient fills, and subtle gold/silver glow effects.

### 💰 Gold & Silver Rate Tracking
- **Gold Purity Tiers**:
  - **24K Gold**: 99.9% Fine Bullion
  - **22K Gold**: 91.6% BIS Hallmark Jewellery Standard
  - **18K Gold**: 75.0% Modern Gemstone Jewellery
- **Units**: 1 Gram, 8 Grams (1 Pavan / Sovereign), 10 Grams (Tola), 100 Grams, 1 Kilogram.
- **Silver Tracking**: Per Gram, 10g, 100g, and 1 kg.
- **City Benchmarks**: National, Mumbai, Delhi, Chennai, Bangalore, Kolkata, Hyderabad, Ahmedabad, Jaipur, Pune, Lucknow.
- **Indian Jewellery Calculator**: Calculates base metal value + Making charges (0-30%) + 3% GST + ₹53.10 BIS hallmarking fee.

### 📈 Price Charts (Recharts)
- Intraday Today (Hourly from 09:00 to 22:00 IST)
- 7-Day Trend
- 30-Day Historical Trend
- 6-Month Multi-Week Trend
- 1-Year Multi-Month Trajectory
- Gold / Silver switcher with hover tooltips formatted in INR (`₹`).

---

## 4. Supabase Setup & Database Migration

1. Create a free Supabase project at [https://supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository, copy the entire SQL script, paste it into the SQL Editor, and click **Run**.
4. The script creates:
   - `profiles` (automatically synchronized with `auth.users` via trigger)
   - `gold_rates` (publicly readable, service-role write)
   - `silver_rates` (publicly readable, service-role write)
   - `rate_history` (stores historical time series)
   - `user_favorites` (private per user via RLS)
   - `user_notifications` (private per user via RLS)
   - `user_price_alerts` (private per user via RLS)
   - `app_settings` (market hours & GST rules)
   - Automated `on_auth_user_created` trigger for user profile creation.

---

## 5. Authentication Setup Guide

In your Supabase project dashboard (**Authentication** -> **Providers**):

### 1. Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/) -> **APIs & Services** -> **Credentials**.
2. Create an **OAuth 2.0 Client ID** (Web Application).
3. In Authorized Redirect URIs, add:
   ```
   https://<your-supabase-project-id>.supabase.co/auth/v1/callback
   ```
4. Copy the Client ID and Client Secret into Supabase Dashboard -> **Authentication** -> **Providers** -> **Google** and toggle **Enable**.

### 2. Email & Password
- Enabled by default in Supabase.
- Password minimum length and strength validation are enforced both client-side and in PostgreSQL.

### 3. Email OTP
1. In Supabase Dashboard -> **Authentication** -> **Providers** -> **Email**:
   - Enable Email provider.
   - Turn on **Enable Email OTP**.
2. In **Email Templates** -> **Magic Link / OTP**, customize the email with your 6-digit code `{{ .Token }}`.

### 4. Phone SMS OTP (+91)
1. In Supabase Dashboard -> **Authentication** -> **Providers** -> **Phone**:
   - Turn on **Enable Phone provider**.
   - Choose your SMS provider (Twilio, MessageBird, Vonage, or Fast2SMS via Twilio-compatible API).
   - Enter your Account SID and Auth Token.
2. The frontend formats all Indian phone numbers with `+91` automatically.

### 5. Forgot & Reset Password
1. In Supabase Dashboard -> **Authentication** -> **URL Configuration**:
   - Set Site URL: `https://your-domain.vercel.app` (or `http://localhost:3000` for development).
   - Add Redirect URL: `https://your-domain.vercel.app/reset-password`.

---

## 6. Live Market Feed & Supabase Edge Functions

To deploy the automated rate-fetching function:
1. Install Supabase CLI:
   ```powershell
   npm install -g supabase
   ```
2. Login and link your project:
   ```powershell
   supabase login
   supabase link --project-ref <your-supabase-project-id>
   ```
3. Set Edge Function secrets in Supabase Dashboard (or via CLI):
   ```powershell
   supabase secrets set GOLD_API_KEY=<your-key-if-using-goldapi-or-metals-api>
   ```
4. Deploy the function:
   ```powershell
   supabase functions deploy fetch-rates --no-verify-jwt
   ```
5. Set up a Cron trigger in Supabase (or external webhook) to invoke `https://<your-project>.supabase.co/functions/v1/fetch-rates` every 15 minutes.

---

## 7. Running the Website Locally

1. Clone or open the repository directory:
   ```powershell
   cd "C:\Users\PRO PLUS\.gemini\antigravity\scratch\gold-silver-rate"
   ```
2. Configure `.env`:
   ```env
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
4. Open your browser at `http://localhost:3000`.

---

## 8. Building the Android APK with Capacitor

This project comes with a configured native Android workspace inside `android/`.

### Prerequisites for building APK binaries:
- **Java Development Kit (JDK 17 or 21)**
- **Android Studio** (or Android SDK command-line tools)

### Step 1: Build the React web bundle
```powershell
npm run build
```

### Step 2: Synchronize web assets with native Android project
```powershell
npm run cap:sync
```

### Step 3: Compile the Android APK

#### Option A: Using Command Line (Gradle)
```powershell
cd android
./gradlew assembleDebug
```
The compiled debug APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

To build a release APK:
```powershell
./gradlew assembleRelease
```
The release APK will be generated at:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

#### Option B: Using Android Studio GUI
```powershell
npm run cap:open
```
In Android Studio:
1. Click **Build** -> **Generate Signed Bundle / APK**.
2. Select **APK** and provide your Keystore credentials.
3. Select **release** destination folder and click **Finish**.

---

## 9. Deployment Guide (Vercel & Netlify)

### Vercel Deployment
1. Push your code to GitHub.
2. In Vercel, click **Add New Project** and import the repository.
3. Set Framework Preset to **Vite**.
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
5. Click **Deploy**. SPA rewrites are handled by the included `vercel.json`.

### Netlify Deployment
1. Import repository into Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Site Configuration.
5. Deploy. SPA redirects are handled by the included `public/_redirects`.

---

## 10. Completed Deliverables Checklist

- [x] **Complete React 19 + Vite + TypeScript Application**
- [x] **Premium Dark Navy & Gold Theme + Light Theme Toggle**
- [x] **12 Navigation Sidebar Items & Mobile Bottom Navigation**
- [x] **Supabase Authentication**:
  - [x] Google OAuth
  - [x] Email & Password with strong password validator
  - [x] 6-digit Email OTP with 60s cooldown timer
  - [x] Indian (+91) Phone SMS OTP verification
  - [x] Functional Forgot Password & Reset Password workflow
- [x] **Dedicated Gold Rate Dashboard** (24K, 22K, 18K across 1g, 8g, 10g, 100g, 1kg)
- [x] **Dedicated Silver Rate Dashboard** (1g, 10g, 100g, 1kg)
- [x] **City-Wise Rate Matrix** (Mumbai, Delhi, Chennai, Bangalore, Kolkata, Hyderabad, Ahmedabad, Jaipur, Pune, Lucknow)
- [x] **Indian Retail Jewellery GST & Making Charges Calculator**
- [x] **Interactive Price Charts** using Recharts (Today, 7D, 30D, 6M, 1Y)
- [x] **Supabase PostgreSQL Schema (`supabase/schema.sql`)** with RLS, triggers & seed data
- [x] **Supabase Edge Function (`supabase/functions/fetch-rates/index.ts`)** for live rates
- [x] **Real-Time Price Alerts & Notifications Center**
- [x] **Native Android Capacitor Project Scaffolded & Synchronized** (`com.goldsilverrate.app`)
- [x] **PWA Support** (Manifest, Service Worker, Offline Fallback Page, Install Prompt)
- [x] **Download APK Portal** (`/download-apk`) with step-by-step install instructions
- [x] **All 22 Required Website Pages**
- [x] **Production Build Verified** with 0 errors
