import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RatesProvider } from './context/RatesContext';
import { initCapacitorApp } from './lib/capacitor';

import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Auth & Info Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { GoogleCallbackPage } from './pages/GoogleCallbackPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';

// Protected Live Financial Market & Feature Pages
import { DashboardPage } from './pages/DashboardPage';
import { GoldRatePage } from './pages/GoldRatePage';
import { SilverRatePage } from './pages/SilverRatePage';
import { LiveMarketPage } from './pages/LiveMarketPage';
import { PriceChartsPage } from './pages/PriceChartsPage';
import { RateHistoryPage } from './pages/RateHistoryPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { DownloadApkPage } from './pages/DownloadApkPage';
import { CopperRatesPage } from './pages/CopperRatesPage';
import { AluminiumRatesPage } from './pages/AluminiumRatesPage';
import { PlatinumPalladiumPage } from './pages/PlatinumPalladiumPage';
import { PriceAlertsPage } from './pages/PriceAlertsPage';
import { DailyReportsPage } from './pages/DailyReportsPage';
import { LiveMarketChartsPage } from './pages/LiveMarketChartsPage';
import { MarketNewsPage } from './pages/MarketNewsPage';

// Root gate component: redirects to /dashboard if logged in, /login if not
function RootGate() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

export function App() {
  useEffect(() => {
    // Initialize Capacitor native handlers (Android status bar, splash screen, back button)
    initCapacitorApp();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <RatesProvider>
          <Routes>
            <Route element={<Layout />}>
              
              {/* Root redirect gate */}
              <Route path="/" element={<RootGate />} />
              
              {/* Public Authentication & Policy Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<GoogleCallbackPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
              
              {/* Protected Routes (Login Mandatory) */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/gold-rate" element={<ProtectedRoute><GoldRatePage /></ProtectedRoute>} />
              <Route path="/silver-rate" element={<ProtectedRoute><SilverRatePage /></ProtectedRoute>} />
              <Route path="/copper-rates" element={<ProtectedRoute><CopperRatesPage /></ProtectedRoute>} />
              <Route path="/aluminium-rates" element={<ProtectedRoute><AluminiumRatesPage /></ProtectedRoute>} />
              <Route path="/platinum-palladium" element={<ProtectedRoute><PlatinumPalladiumPage /></ProtectedRoute>} />
              
              {/* Markets, Candlestick Charts & News */}
              <Route path="/live-market" element={<ProtectedRoute><LiveMarketPage /></ProtectedRoute>} />
              <Route path="/charts" element={<ProtectedRoute><PriceChartsPage /></ProtectedRoute>} />
              <Route path="/live-charts" element={<ProtectedRoute><LiveMarketChartsPage /></ProtectedRoute>} />
              <Route path="/news" element={<ProtectedRoute><MarketNewsPage /></ProtectedRoute>} />
              <Route path="/price-alerts" element={<ProtectedRoute><PriceAlertsPage /></ProtectedRoute>} />
              <Route path="/daily-reports" element={<ProtectedRoute><DailyReportsPage /></ProtectedRoute>} />
              
              {/* User Account & History */}
              <Route path="/history" element={<ProtectedRoute><RateHistoryPage /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/download-apk" element={<ProtectedRoute><DownloadApkPage /></ProtectedRoute>} />
              
              {/* Fallback route */}
              <Route path="*" element={<RootGate />} />
            </Route>
          </Routes>
        </RatesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
