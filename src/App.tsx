import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RatesProvider } from './context/RatesContext';
import { initCapacitorApp } from './lib/capacitor';

import { Layout } from './components/Layout';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { GoogleCallbackPage } from './pages/GoogleCallbackPage';
import { EmailOtpPage } from './pages/EmailOtpPage';
import { PhoneOtpPage } from './pages/PhoneOtpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
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
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';

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
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<GoogleCallbackPage />} />
              <Route path="/email-otp" element={<EmailOtpPage />} />
              <Route path="/phone-otp" element={<PhoneOtpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/gold-rate" element={<GoldRatePage />} />
              <Route path="/silver-rate" element={<SilverRatePage />} />
              <Route path="/live-market" element={<LiveMarketPage />} />
              <Route path="/charts" element={<PriceChartsPage />} />
              <Route path="/history" element={<RateHistoryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/download-apk" element={<DownloadApkPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </RatesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
