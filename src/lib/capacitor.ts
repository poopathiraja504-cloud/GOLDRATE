import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';

export const isNative = Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform();

export async function initCapacitorApp(onBackPress?: () => void) {
  if (!isNative) return;

  try {
    // 1. Status Bar Setup
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#070d19' });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (e) {
    console.debug('StatusBar not supported on this platform:', e);
  }

  try {
    // 2. Hide Splash Screen after initial load
    setTimeout(async () => {
      await SplashScreen.hide({ fadeOutDuration: 400 });
    }, 800);
  } catch (e) {
    console.debug('SplashScreen not supported:', e);
  }

  try {
    // 3. Android Back Button handling
    App.addListener('backButton', ({ canGoBack }) => {
      if (onBackPress) {
        onBackPress();
      } else if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  } catch (e) {
    console.debug('App back button listener error:', e);
  }
}

export async function checkNetworkStatus(): Promise<boolean> {
  if (isNative) {
    const status = await Network.getStatus();
    return status.connected;
  }
  return navigator.onLine;
}

export function subscribeToNetworkChanges(callback: (connected: boolean) => void) {
  if (isNative) {
    const handle = Network.addListener('networkStatusChange', (status) => {
      callback(status.connected);
    });
    return () => {
      handle.then(h => h.remove());
    };
  } else {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}
