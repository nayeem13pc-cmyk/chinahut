import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const all = searchParams.get('all') === 'true'; // Admin: include inactive

    let query = supabaseAdmin
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (!all) query = query.eq('is_active', true);
    if (category) query = query.eq('category_id', category);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ products: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, category_id, cost_price, selling_price, stock_count, image_url } =
      body;

    if (!name || cost_price == null || selling_price == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        description,
        category_id: category_id || null,
        cost_price: parseFloat(cost_price),
        selling_price: parseFloat(selling_price),
        stock_count: parseInt(stock_count) || 0,
        image_url: image_url || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
