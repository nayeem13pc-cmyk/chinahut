import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', params.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ product: data });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updateFields: Record<string, any> = {};

    const allowed = [
      'name', 'description', 'category_id', 'cost_price',
      'selling_price', 'stock_count', 'image_url', 'is_active',
    ];

    for (const key of allowed) {
      if (body[key] !== undefined) updateFields[key] = body[key];
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updateFields)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Soft delete: just deactivate
    const { error } = await supabaseAdmin
      .from('products')
      .update({ is_active: false })
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
