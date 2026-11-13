import { supabase, isSupabaseConfigured } from '../lib/supabase';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const pushNotificationService = {
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  },

  async getSubscriptionStatus(): Promise<'subscribed' | 'denied' | 'default' | 'unsupported'> {
    if (!this.isSupported()) return 'unsupported';
    if (Notification.permission === 'denied') return 'denied';
    if (Notification.permission === 'default') return 'default';

    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) return 'default';
      const sub = await reg.pushManager.getSubscription();
      return sub ? 'subscribed' : 'default';
    } catch {
      return 'default';
    }
  },

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  async subscribeToPush(userId?: string): Promise<PushSubscription | null> {
    if (!this.isSupported()) return null;

    try {
      const granted = await this.requestPermission();
      if (!granted) return null;

      const reg = await navigator.serviceWorker.ready;
      let subscription = await reg.pushManager.getSubscription();

      if (!subscription) {
        const subscribeOptions: PushSubscriptionOptionsInit = {
          userVisibleOnly: true,
        };

        if (VAPID_PUBLIC_KEY) {
          subscribeOptions.applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        }

        subscription = await reg.pushManager.subscribe(subscribeOptions);
      }

      if (subscription && userId && isSupabaseConfigured) {
        await this.saveSubscriptionToServer(subscription, userId);
      }

      return subscription;
    } catch (err) {
      console.warn('Web push registration fallback / unsupported env:', err);
      return null;
    }
  },

  async unsubscribeFromPush(userId?: string): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        if (userId && isSupabaseConfigured) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', subscription.endpoint);
        }
      }
      return true;
    } catch (err) {
      console.error('Failed to unsubscribe:', err);
      return false;
    }
  },

  async saveSubscriptionToServer(subscription: PushSubscription, userId: string): Promise<void> {
    const rawSub = subscription.toJSON();
    const endpoint = subscription.endpoint;
    const p256dh = rawSub.keys?.p256dh || '';
    const auth = rawSub.keys?.auth || '';

    try {
      await supabase.from('push_subscriptions').upsert({
        user_id: userId,
        endpoint,
        p256dh,
        auth,
        created_at: new Date().toISOString(),
      }, { onConflict: 'endpoint' });
    } catch (err) {
      console.warn('Supabase push subscription sync notice:', err);
    }
  },

  sendLocalNotification(title: string, options?: NotificationOptions) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    try {
      new Notification(title, {
        icon: '/gold-coin.svg',
        badge: '/gold-coin.svg',
        ...options,
      });
    } catch (err) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, options);
      }).catch(e => console.warn('Notification error:', e));
    }
  }
};

export default pushNotificationService;

