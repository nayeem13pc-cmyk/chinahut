'use client';
// ============================================================
// CategoryGrid.tsx
// ============================================================
import Link from 'next/link';
import type { Category } from '@/types';

const CATEGORY_ICONS: Record<string, string> = {
  'electronics': '⚡',
  'fashion-costume': '👗',
  'beauty-products': '💄',
  'baby-goods': '🍼',
  'pet-goods': '🐾',
  'miscellaneous': '📦',
};

const CATEGORY_COLORS: Record<string, string> = {
  'electronics': 'from-blue-500 to-cyan-400',
  'fashion-costume': 'from-purple-500 to-pink-400',
  'beauty-products': 'from-rose-500 to-orange-400',
  'baby-goods': 'from-yellow-400 to-green-400',
  'pet-goods': 'from-amber-500 to-orange-500',
  'miscellaneous': 'from-gray-500 to-slate-400',
};

interface Props {
  categories: Category[];
}

export function CategoryGrid({ categories }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold text-gray-900">Shop by Category</h2>
        <p className="text-gray-500 mt-2">Browse our curated collection of imported goods</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[cat.slug] || 'from-brand-500 to-brand-400'} flex items-center justify-center text-2xl shadow-md`}
            >
              {CATEGORY_ICONS[cat.slug] || '🛍️'}
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight group-hover:text-brand-600 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryGrid;
