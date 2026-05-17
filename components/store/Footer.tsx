import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-white" fill="white" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                China<span className="text-brand-400">Hut</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted source for premium imported products from China. Quality goods, great prices, fast delivery.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Electronics', '/category/electronics'],
                ['Fashion & Costume', '/category/fashion-costume'],
                ['Beauty Products', '/category/beauty-products'],
                ['Baby Goods', '/category/baby-goods'],
                ['Pet Goods', '/category/pet-goods'],
                ['Miscellaneous', '/category/miscellaneous'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold mb-3">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>📞 Call / WhatsApp for orders</li>
              <li>🚚 Cash on Delivery</li>
              <li>📦 Delivery across Bangladesh</li>
              <li>↩️ Easy return policy</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs">
          © {new Date().getFullYear()} ChinaHut. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
