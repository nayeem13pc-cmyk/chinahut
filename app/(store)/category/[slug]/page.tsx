import { supabase } from '@/lib/supabase';
import ProductGrid from '@/components/store/ProductGrid';
import CategoryFilterBar from '@/components/store/CategoryFilterBar';
import { notFound } from 'next/navigation';
import type { Category, Product } from '@/types';
import type { Metadata } from 'next';

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

async function getData(slug: string) {
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) return null;

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .gt('stock_count', 0)
    .order('created_at', { ascending: false });

  const { data: allCategories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return {
    category: category as Category,
    products: (products ?? []) as Product[],
    allCategories: (allCategories ?? []) as Category[],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getData(params.slug);
  if (!data) return {};
  return {
    title: data.category.name,
    description: data.category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const data = await getData(params.slug);
  if (!data) notFound();

  const { category, products, allCategories } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-gray-500">{category.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-400">{products.length} products found</p>
      </div>

      {/* Category Filter Tabs */}
      <CategoryFilterBar categories={allCategories} activeSlug={params.slug} />

      {/* Product Grid */}
      <div className="mt-8">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-lg font-medium">No products in this category yet.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
