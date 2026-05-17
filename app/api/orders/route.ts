import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { CartItem, CheckoutFormData } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { form, items }: { form: CheckoutFormData; items: CartItem[] } = body;

    if (!form.name || !form.phone || !form.address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate totals
    const total_amount = items.reduce(
      (sum, i) => sum + i.product.selling_price * i.quantity,
      0
    );
    const total_cost = items.reduce(
      (sum, i) => sum + i.product.cost_price * i.quantity,
      0
    );

    // Upsert customer (CRM tracking)
    const { data: customerData, error: customerError } = await supabaseAdmin.rpc(
      'upsert_customer',
      {
        p_name: form.name,
        p_phone: form.phone,
        p_email: form.email || null,
        p_address: form.address,
        p_order_total: total_amount,
      }
    );

    if (customerError) {
      console.error('Customer upsert error:', customerError);
      // Non-fatal, continue
    }

    // Create order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_id: customerData || null,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || null,
        customer_address: form.address,
        notes: form.notes || null,
        total_amount,
        total_cost,
        status: 'new',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map(({ product, quantity }) => ({
      order_id: order.id,
      product_id: product.id,
      product_name: product.name,
      quantity,
      unit_price: product.selling_price,
      unit_cost: product.cost_price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update stock counts
    for (const { product, quantity } of items) {
      await supabaseAdmin
        .from('products')
        .update({ stock_count: Math.max(0, product.stock_count - quantity) })
        .eq('id', product.id);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('orders')
      .select('*, items:order_items(*, product:products(name, image_url))', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ orders: data, total: count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
