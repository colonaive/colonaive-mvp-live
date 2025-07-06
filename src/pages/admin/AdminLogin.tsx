// /home/project/src/pages/admin/AdminLogin.tsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { user, userType, isSuperAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in as admin
  if (user && (userType === 'admin' || isSuperAdmin)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('[AdminLogin] Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log('[AdminLogin] Login successful, checking admin privileges...');

      // Check if user has admin privileges
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type, is_super_admin, email')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      console.log('[AdminLogin] Profile data:', {
        user_type: profile.user_type,
        is_super_admin: profile.is_super_admin,
        email: profile.email,
        user_email: data.user.email
      });

      // Check admin status with multiple criteria
      const isAdminByType = profile.user_type === 'admin';
      const isAdminByFlag = profile.is_super_admin === true;
      const isAdminByEmail = data.user.email === 'info@colonaive.ai' || data.user.email === 'admin@colonaive.com';

      if (!isAdminByType && !isAdminByFlag && !isAdminByEmail) {
        console.log('[AdminLogin] User is not admin, signing out...');
        await supabase.auth.signOut();
        throw new Error('Admin privileges required. Please contact the administrator if you believe this is an error.');
      }

      console.log('[AdminLogin] Admin access confirmed, proceeding...');

      // Log successful admin login (if activity_logs table exists)
      try {
        await supabase.from('activity_logs').insert([{
          admin_id: data.user.id,
          action: 'admin_login_success',
          details: { 
            is_super_admin: profile.is_super_admin,
            user_type: profile.user_type,
            login_time: new Date().toISOString()
          },
          ip_address: await fetch('https://api.ipify.org').then(r => r.text()).catch(() => 'unknown')
        }]);
      } catch (logError) {
        console.warn('[AdminLogin] Could not log activity (table may not exist):', logError);
      }

    } catch (err: any) {
      console.error('[AdminLogin] Login failed:', err);
      setError(err.message || 'Login failed');
      
      // Log failed login attempt (if activity_logs table exists)
      if (email) {
        try {
          await supabase.from('activity_logs').insert([{
            action: 'admin_login_failed',
            details: { email, error: err.message },
            ip_address: await fetch('https://api.ipify.org').then(r => r.text()).catch(() => 'unknown')
          }]);
        } catch (logError) {
          console.warn('[AdminLogin] Could not log failed attempt:', logError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-600 mt-2">Secure access to COLONAiVE™ administration</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="info@colonaive.ai"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing In...' : 'Access Admin Portal'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              All login attempts are logged and monitored for security.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Use: info@colonaive.ai for admin access
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};