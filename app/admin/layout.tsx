'use client';

import { AdminAuthProvider, useAdminAuth } from '@/lib/admin-auth';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminSidebar from '@/components/admin/AdminSidebar';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
