'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/admin-auth';
import {
  LayoutDashboard, Package, ShoppingBag, Users, LogOut, Zap, ChevronRight,
} from 'lucide-react';

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Customers (CRM)', href: '/admin/customers', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  return (
    <aside className="w-60 h-full flex flex-col bg-surface-900 border-r border-gray-800 flex-shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm leading-none">ChinaHut</p>
            <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-brand-600 text-white shadow-brand'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
