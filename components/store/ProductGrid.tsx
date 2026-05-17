import ProductCard from './ProductCard';
import type { Product, Category } from '@/types';
import Link from 'next/link';

// ── ProductGrid ───────────────────────────────────────────
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;

// ── FeaturedProducts ──────────────────────────────────────
export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-gray-900">New Arrivals</h2>
          <p className="text-gray-500 mt-1">Freshly imported, just for you</p>
        </div>
        <Link
          href="/category/electronics"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors hidden sm:block"
        >
          View all →
        </Link>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}

// ── CategoryFilterBar ─────────────────────────────────────
export function CategoryFilterBar({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
            cat.slug === activeSlug
              ? 'bg-brand-600 text-white shadow-brand'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600'
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
