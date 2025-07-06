import { supabase } from '../config/supabase';
import type { User, AuthError, Session } from '@supabase/supabase-js';

// Types for our auth functions
export interface AuthResult {
  user: User | null;
  error: AuthError | null;
  success: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  options?: {
    data?: {
      full_name?: string;
      display_name?: string;
    };
  };
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  password: string;
}

// Core authentication functions
export const authUtils = {
  /**
   * Sign up a new user with email and password
   */
  async signUp(email: string, password: string, userData = {}): Promise<AuthResult> { 
    try {
      console.log('[AuthUtils] Signing up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData, 
          emailRedirectTo: options?.emailRedirectTo || 'https://www.colonaive.ai/login?verified=true'
        },
      });

      if (error) {
        console.error('[AuthUtils] Sign up error:', error);
        
        // Provide more user-friendly error messages 
        if (error.message.includes('already registered')) {
          return {
            user: null,
            error: { 
              ...error, 
              message: 'This email is already registered. Please try logging in instead.' 
            },
            success: false
          };
        }
        
        if (error.message.includes('Invalid email')) {
          return {
            user: null,
            error: {  
              ...error, 
              message: 'Please enter a valid email address.' 
            },
            success: false
          };
        }
        
        if (error.message.includes('Password should be')) {
          return {
            user: null,
            error: {  
              ...error, 
              message: 'Password must be at least 6 characters long.' 
            },
            success: false
          };
        }
        
        return {
          user: null,
          error,
          success: false,
        };
      }

      console.log('[AuthUtils] Sign up successful');
      return {
        user: data.user,
        error: null,
        success: !!data.user,
      };
    } catch (err) {
      console.error('[AuthUtils] Sign up exception:', err);
      return {
        user: null,
        error: err as AuthError,
        success: false,
      };
    }
  },

  /**
   * Sign in an existing user
   */
  async signIn({ email, password }: SignInData): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return {
        user: data.user,
        error,
        success: !error && !!data.user,
      };
    } catch (err) {
      return {
        user: null,
        error: err as AuthError,
        success: false,
      };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null; success: boolean }> {
    try {
      const { error } = await supabase.auth.signOut();
      return {
        error,
        success: !error,
      };
    } catch (err) {
      return {
        error: err as AuthError,
        success: false,
      };
    }
  },

  /**
   * Send password reset email
   */
  async resetPassword({ email }: ResetPasswordData): Promise<{ error: AuthError | null; success: boolean }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      return {
        error,
        success: !error,
      };
    } catch (err) {
      return {
        error: err as AuthError,
        success: false,
      };
    }
  },

  /**
   * Update user password (used after reset)
   */
  async updatePassword({ password }: UpdatePasswordData): Promise<{ error: AuthError | null; success: boolean }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      return {
        error,
        success: !error,
      };
    } catch (err) {
      return {
        error: err as AuthError,
        success: false,
      };
    }
  },

  /**
   * Get current user session
   */
  async getCurrentSession(): Promise<{ session: Session | null; user: User | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return { session: null, user: null };
      }

      return {
        session,
        user: session?.user || null,
      };
    } catch (err) {
      console.error('Error getting session:', err);
      return { session: null, user: null };
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting user:', error);
        return null;
      }

      return user;
    } catch (err) {
      console.error('Error getting user:', err);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { session } = await this.getCurrentSession();
    return !!session;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  /**
   * Helper to format auth errors for user display
   */
  formatAuthError(error: AuthError | null): string {
    if (!error) return '';

    // Common Supabase auth error messages and user-friendly alternatives
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password. Please check your credentials and try again.',
      'Email not confirmed': 'Please check your email and click the confirmation link before signing in.',
      'User already registered': 'An account with this email already exists. Try signing in instead.',
      'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
      'Unable to validate email address: invalid format': 'Please enter a valid email address.',
      'signup disabled': 'New account registration is currently disabled.',
      'email rate limit exceeded': 'Too many emails sent. Please wait before requesting another.',
    };

    return errorMessages[error.message] || error.message || 'An unexpected error occurred. Please try again.';
  },

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  validatePassword(password: string): { isValid: boolean; message: string } { 
    if (!password) {
      return { isValid: false, message: 'Password is required' };
    } else if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    if (password.length > 128) {
      return { isValid: false, message: 'Password must be less than 128 characters' };
    }
     
    // Check password strength
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 3) {
      return { 
        isValid: true, 
        message: 'Consider using a stronger password with uppercase letters, numbers, and special characters' 
      };
    }
    
    return { isValid: true, message: '' };
  },
};