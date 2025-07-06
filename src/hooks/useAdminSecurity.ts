// /home/project/src/hooks/useAdminSecurity.ts
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../contexts/AuthContext';

interface AdminSecurityContext {
  isSuperAdmin: boolean;
  isAdmin: boolean;
  permissions: string[];
  logAction: (action: string, details?: any) => Promise<void>;
  checkPermission: (permission: string) => boolean;
}

export const useAdminSecurity = (): AdminSecurityContext => {
  const { user, userType } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  
  const isAdmin = userType === 'admin';
  const isSuperAdmin = isAdmin && user?.email === 'admin@colonaive.com';

  // Fetch admin permissions
  useEffect(() => {
    if (isAdmin && user?.id) {
      fetchPermissions();
    }
  }, [isAdmin, user?.id]);

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('permission_name')
        .eq('admin_id', user?.id)
        .eq('is_active', true);

      if (error) throw error;
      
      const permissionNames = data?.map(p => p.permission_name) || [];
      setPermissions(permissionNames);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setPermissions([]);
    }
  };

  const logAction = async (action: string, details: any = {}) => {
    try {
      const { error } = await supabase.from('activity_logs').insert([{
        admin_id: user?.id,
        action,
        details,
        ip_address: await fetch('https://api.ipify.org').then(r => r.text()).catch(() => 'unknown'),
        user_agent: navigator.userAgent
      }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  const checkPermission = (permission: string): boolean => {
    if (isSuperAdmin) return true; // Super admin has all permissions
    return permissions.includes(permission);
  };

  return {
    isSuperAdmin,
    isAdmin,
    permissions,
    logAction,
    checkPermission
  };
};