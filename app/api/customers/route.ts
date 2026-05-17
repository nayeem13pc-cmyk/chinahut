import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const repeatOnly = searchParams.get('repeat') === 'true';

    let query = supabaseAdmin
      .from('customers')
      .select('*')
      .order('purchase_count', { ascending: false });

    if (repeatOnly) {
      query = query.gte('purchase_count', 2);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ customers: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
