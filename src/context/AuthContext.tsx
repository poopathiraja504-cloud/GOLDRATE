import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  sendEmailOtp: (email: string) => Promise<{ error: AuthError | null }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: AuthError | null }>;

  resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | null }>;
  updateUserPassword: (password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local fallback storage for demo/sandbox mode when Supabase credentials are pending
const MOCK_USER_STORAGE_KEY = 'gsr_mock_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
              await fetchProfile(session.user.id, session.user.email);
            }
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            if (!mounted) return;
            setSession(newSession);
            setUser(newSession?.user ?? null);
            if (newSession?.user) {
              await fetchProfile(newSession.user.id, newSession.user.email);
            } else {
              setProfile(null);
            }
          });

          return () => {
            subscription.unsubscribe();
          };
        } catch (err) {
          console.error('Supabase auth initialization error:', err);
        }
      } else {
        // Load mock/sandbox user if present in localStorage
        const stored = localStorage.getItem(MOCK_USER_STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setUser(parsed.user);
            setProfile(parsed.profile);
          } catch (e) {
            console.warn('Error reading stored mock user:', e);
          }
        }
      }

      if (mounted) setIsLoading(false);
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  async function fetchProfile(userId: string, email?: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        setProfile(data as UserProfile);
      } else {
        // Default profile
        setProfile({
          id: userId,
          email: email || '',
          full_name: 'Gold Investor',
          preferred_currency: 'INR',
          preferred_city: 'National',
          preferred_unit: '10g',
          theme_preference: 'navy-gold',
          sms_notifications_enabled: false,
          email_notifications_enabled: true,
        });
      }
    } catch (e) {
      console.warn('Profile fetch fallback:', e);
    }
  }

  // Google OAuth
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      // Simulate OAuth in sandbox environment
      const mockU: User = {
        id: 'google-user-' + Date.now(),
        app_metadata: { provider: 'google' },
        user_metadata: { full_name: 'Google Investor', avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email: 'investor.google@example.com',
      };
      const mockProf: UserProfile = {
        id: mockU.id,
        email: mockU.email,
        full_name: 'Google Investor',
        avatar_url: mockU.user_metadata.avatar_url,
        preferred_currency: 'INR',
        preferred_city: 'National',
        preferred_unit: '10g',
        theme_preference: 'navy-gold',
        sms_notifications_enabled: false,
        email_notifications_enabled: true,
      };
      localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify({ user: mockU, profile: mockProf }));
      setUser(mockU);
      setProfile(mockProf);
      return { error: null };
    }

    const redirectUrl = window.location.origin + '/auth/callback';
    const res = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
    return { error: res.error };
  };

  // Email & Password Sign In
  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      const mockU: User = {
        id: 'user-' + Date.now(),
        app_metadata: {},
        user_metadata: { full_name: email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        email,
      };
      const mockProf: UserProfile = {
        id: mockU.id,
        email,
        full_name: email.split('@')[0],
        preferred_currency: 'INR',
        preferred_city: 'National',
        preferred_unit: '10g',
        theme_preference: 'navy-gold',
        sms_notifications_enabled: false,
        email_notifications_enabled: true,
      };
      localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify({ user: mockU, profile: mockProf }));
      setUser(mockU);
      setProfile(mockProf);
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.email);
    }
    return { error };
  };

  // Email & Password Sign Up
  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      return signInWithEmail(email, password);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (data.user) {
      setUser(data.user);
    }
    return { error };
  };

  // Send Email OTP
  const sendEmailOtp = async (email: string) => {
    if (!isSupabaseConfigured) {
      console.log(`[Dev Mode] 6-digit Email OTP sent to ${email}: 123456`);
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    return { error };
  };

  // Verify Email OTP
  const verifyEmailOtp = async (email: string, token: string) => {    if (!isSupabaseConfigured) {
      if (token === '123456' || token.length === 6) {
        return signInWithEmail(email, 'demo-otp-pass');
      }
      return { error: { message: 'Invalid OTP code. For demo mode enter 123456' } as AuthError };
    }
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.email);
    }
    return { error };
  };

  // Forgot Password / Reset Link
  const resetPasswordForEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    return { error };
  };

  // Update Password
  const updateUserPassword = async (password: string) => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  // Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(MOCK_USER_STORAGE_KEY);
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Update Profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const merged = { ...profile, ...updates } as UserProfile;
    setProfile(merged);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
        return !error;
      } catch (e) {
        console.error('Update profile error:', e);
        return false;
      }
    } else {
      localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify({ user, profile: merged }));
      return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isConfigured: isSupabaseConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendEmailOtp,
        verifyEmailOtp,
        resetPasswordForEmail,
        updateUserPassword,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

