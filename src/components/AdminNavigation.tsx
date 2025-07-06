// /home/project/src/components/AdminNavigation.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, Users, FileText, Database, Settings, 
  Calendar, MessageSquare, Shield, LogOut 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

export const AdminNavigation: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      // Log admin logout
      await supabase.from('activity_logs').insert([{
        admin_id: user?.id,
        action: 'admin_logout',
        details: { logout_time: new Date().toISOString() }
      }]);

      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
    { path: '/admin/users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { path: '/admin/content', label: 'Content', icon: <FileText className="h-4 w-4" /> },
    { path: '/admin/events', label: 'Events', icon: <Calendar className="h-4 w-4" /> },
    { path: '/admin/stories', label: 'Stories', icon: <MessageSquare className="h-4 w-4" /> },
    { path: '/admin/system', label: 'System', icon: <Database className="h-4 w-4" /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <nav className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-6 w-6 text-blue-400" />
          <span className="font-bold text-lg">Admin Portal</span>
        </div>
        <p className="text-sm text-gray-400">COLONAiVE™ Administration</p>
      </div>

      <div className="space-y-2 mb-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>

      <div className="border-t border-gray-700 pt-4 mt-auto">
        <div className="mb-4">
          <p className="text-sm text-gray-400">Logged in as:</p>
          <p className="text-sm font-medium truncate">{user?.email}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </nav>
  );
};