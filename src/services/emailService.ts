// Transactional & Welcome Email Service for GOLDSILVERRATE
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const WELCOME_EMAIL_SENT_KEY = 'gsr_welcome_email_last_sent';
const COOLDOWN_HOURS = 12; // Rate-limit welcome-back emails

export const emailService = {
  /**
   * Triggers a personalized welcome or welcome-back email to the authenticated user.
   * Rate-limited to prevent sending on every page refresh.
   */
  async sendWelcomeNotification(email: string, displayName: string, isFirstTime = false): Promise<void> {
    if (!email) return;

    try {
      // Check client-side cooldown
      const lastSent = localStorage.getItem(`${WELCOME_EMAIL_SENT_KEY}_${email}`);
      if (lastSent && !isFirstTime) {
        const hoursSince = (Date.now() - Number(lastSent)) / (1000 * 60 * 60);
        if (hoursSince < COOLDOWN_HOURS) {
          return; // Skip repeated welcome-back emails
        }
      }

      localStorage.setItem(`${WELCOME_EMAIL_SENT_KEY}_${email}`, String(Date.now()));

      // If Supabase is configured, trigger the Edge Function securely
      if (isSupabaseConfigured) {
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            email,
            displayName: displayName || email.split('@')[0],
            isFirstTime,
            marketLink: `${window.location.origin}/dashboard`,
            websiteLink: window.location.origin,
          },
        });
      } else {
        console.log(`[Dev Mode] Transactional email queued for ${email}: ${isFirstTime ? 'Welcome to GOLDSILVERRATE!' : 'Welcome Back to GOLDSILVERRATE!'}`);
      }
    } catch (err) {
      console.warn('Welcome email trigger notice:', err);
    }
  },
};

export default emailService;

