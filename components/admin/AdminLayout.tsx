'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { ToastProvider } from './Toast';
import { LoadingState } from './LoadingState';
import { AdminInactivityManager } from './AdminInactivityManager';

export interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <LoadingState label="Authenticating Session..." />
      </div>
    );
  }

  return (
    <ToastProvider>
      <AdminInactivityManager>
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e6] font-sans antialiased flex flex-col lg:flex-row">
          {}
          <AdminSidebar
            userRole={(session?.user as { role?: string })?.role}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {}
          <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
            <AdminHeader
              user={session?.user}
              onToggleSidebar={() => setSidebarOpen(true)}
              pageTitle={pageTitle}
            />

            <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      </AdminInactivityManager>
    </ToastProvider>
  );
};

export default AdminLayout;