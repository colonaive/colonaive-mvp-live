// Import the actual toast object from the library
import toast from 'react-hot-toast';

// Re-export the toast object so all your other files can use it
export { toast };

// Your existing auth-specific toast helpers will now work correctly
// because the 'toast' object they use is the real one from react-hot-toast.
export const authToast = { 
  signInSuccess: () => toast.success('Welcome back! You have been signed in successfully.'),
  signUpSuccess: (message?: string) => toast.success(message || 'Account created successfully! Please check your email to verify your account.'),
  signOutSuccess: () => toast.success('You have been signed out successfully.'),
  resetPasswordSuccess: () => toast.success('Password reset email sent! Check your inbox for instructions.'),
  updatePasswordSuccess: () => toast.success('Your password has been updated successfully.'),
  
  signInError: (error: string) => toast.error(`Sign in failed: ${error}`), 
  signUpError: (error: string) => toast.error(`Sign up failed: ${error}`),
  signOutError: (error: string) => toast.error(`Sign out failed: ${error}`),
  resetPasswordError: (error: string) => toast.error(`Password reset failed: ${error}`),
  updatePasswordError: (error: string) => toast.error(`Password update failed: ${error}`),
  
  emailRequired: () => toast.warning('Please enter your email address.'),
  passwordRequired: () => toast.warning('Please enter your password.'),
  invalidEmail: () => toast.warning('Please enter a valid email address.'),
  weakPassword: () => toast.warning('Password must be at least 6 characters long.'),
  
  sessionExpired: () => toast.info('Your session has expired. Please sign in again.'),
  emailVerificationRequired: () => toast.info('Please verify your email address before signing in.'),
};