// /home/project/src/components/AdminLayout.tsx
import React from 'react';
import { AdminNavigation } from './AdminNavigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNavigation />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};