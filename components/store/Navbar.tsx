'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { ShoppingCart, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Electronics', href: '/category/electronics' },
  { label: 'Fashion', href: '/category/fashion-costume' },
  { label: 'Beauty', href: '/category/beauty-products' },
  { label: 'Baby Goods', href: '/category/baby-goods' },
  { label: 'Pet Goods', href: '/category/pet-goods' },
  { label: 'More', href: '/category/miscellaneous' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Top bar */}
      <div className="bg-brand-600 text-white text-center text-xs py-1.5 font-medium tracking-wide">
        🚀 Free Delivery on Orders Over ৳1000 &nbsp;|&nbsp; Cash on Delivery Available
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
              China<span className="text-brand-600">Hut</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 hover:bg-brand-50 text-gray-700 hover:text-brand-600 transition-all duration-150 text-sm font-medium"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-fade-in">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-up">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
