import { supabase } from '@/lib/supabase';
import HeroBanner from '@/components/store/HeroBanner';
import CategoryGrid from '@/components/store/CategoryGrid';
import FeaturedProducts from '@/components/store/FeaturedProducts';
import TrustBar from '@/components/store/TrustBar';
import type { Category, Product } from '@/types';

export const revalidate = 60; // ISR: revalidate every 60s

async function getData() {
  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .gt('stock_count', 0)
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  return {
    categories: (categoriesRes.data ?? []) as Category[],
    products: (productsRes.data ?? []) as Product[],
  };
}

export default async function HomePage() {
  const { categories, products } = await getData();

  return (
    <>
      <HeroBanner />
      <TrustBar />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={products} />
    </>
  );
}
