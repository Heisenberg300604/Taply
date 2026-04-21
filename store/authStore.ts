import { supabase } from '@/utils/supabase';
import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  setSession: (session: Session | null) => void;
  signUp: (email: string, password: string, username: string, name?: string) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  isLoading: true,
  hasCompletedOnboarding: false,

  setSession: (session) => {
    set({ session, user: session?.user ?? null, isLoading: false });
    if (session?.user) {
      supabase
        .from('profiles')
        .select('has_completed_onboarding')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          set({ hasCompletedOnboarding: data?.has_completed_onboarding ?? false });
        });
    }
  },

  signUp: async (email, password, username, name) => {

    // 2. Sign up with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) return { error: signUpError };
    if (!data.user) return { error: { message: 'Sign-up failed' } };

    if (username || name) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ username, name })
      .eq('id', data.user.id);

    if (profileError) {
      // Handle unique constraint error
      if (profileError.code === '23505') {
        return { error: { message: 'Username already taken' } };
      }
      return { error: profileError };
    }
  }

    return { error: null };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },

  completeOnboarding: async () => {
    const { user } = get();
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ has_completed_onboarding: true })
      .eq('id', user.id);
    set({ hasCompletedOnboarding: true });
  },

  initialize: () => {
    const fetchOnboardingStatus = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('has_completed_onboarding')
        .eq('id', userId)
        .single();
      set({ hasCompletedOnboarding: data?.has_completed_onboarding ?? false });
    };

    // Listen to auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, isLoading: false });
      if (session?.user) {
        fetchOnboardingStatus(session.user.id);
      } else {
        set({ hasCompletedOnboarding: false });
      }
    });

    // Also fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, user: session?.user ?? null, isLoading: false });
      if (session?.user) {
        fetchOnboardingStatus(session.user.id);
      }
    });
  },
}));