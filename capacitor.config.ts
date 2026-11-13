import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.goldsilverrate.app',
  appName: 'Gold and Silver Rate',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#070d19',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#eab308'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#070d19'
    }
  }
};

export default config;
