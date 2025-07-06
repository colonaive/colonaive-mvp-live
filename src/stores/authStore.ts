// src/stores/authStore.ts
import { create } from 'zustand';
import { supabase, Profile } from '../config/supabase';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        set({ user: data.user, isAuthenticated: true });
        await get().fetchProfile();
      }
    } catch (error: any) {
      set({ error: error.message, isAuthenticated: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string, userData: any) => {
    try {
      set({ isLoading: true, error: null });
      
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile based on user type
        const profileData = {
          id: authData.user.id,
          email: authData.user.email!,
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (profileError) throw profileError;

        set({ user: authData.user, isAuthenticated: true });
        await get().fetchProfile();
      }
    } catch (error: any) {
      set({ error: error.message, isAuthenticated: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({ 
        user: null, 
        profile: null, 
        isAuthenticated: false 
      });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProfile: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        set({ profile });
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        set({ user, isAuthenticated: true });
        await get().fetchProfile();
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error: any) {
      set({ error: error.message, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

// Auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    useAuthStore.getState().fetchProfile();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ 
      user: null, 
      profile: null, 
      isAuthenticated: false 
    });
  }
});