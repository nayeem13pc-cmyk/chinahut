import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-surface-900 via-brand-950 to-surface-900">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-800/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-600/30 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
            <Star size={12} className="text-gold-400" fill="currentColor" />
            <span className="text-sm text-brand-300 font-medium">Premium Imports · Direct from China</span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            Discover
            <span className="text-brand-400"> Amazing</span>
            <br />
            Imported Products
          </h1>

          {/* Sub */}
          <p
            className="text-gray-400 text-lg sm:text-xl mb-8 max-w-xl leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Electronics, Fashion, Beauty, Baby Goods & more — handpicked from China, delivered to your door.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/category/electronics"
              className="btn-primary flex items-center gap-2 text-base"
            >
              Shop Electronics <ArrowRight size={16} />
            </Link>
            <Link
              href="/category/beauty-products"
              className="btn-secondary flex items-center gap-2 text-base"
            >
              Beauty Products
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap gap-8 mt-12 text-sm animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            {[
              ['500+', 'Products'],
              ['1000+', 'Happy Customers'],
              ['6', 'Categories'],
            ].map(([val, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white font-display">{val}</p>
                <p className="text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
