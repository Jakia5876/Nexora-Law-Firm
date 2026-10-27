import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabase';

// GET /api/admin/cases — Fetch case registry (Role-gated)
export async function GET() {
  const auth = await verifyAdminSession();
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('cases')
    .select('*, court:court_id(court_name), case_type:case_type_id(case_type), assistant:assistant_id(assistant_name)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cases: data });
}

// POST /api/admin/cases — Create case (Role-gated mutating endpoint)
export async function POST(request: Request) {
  const auth = await verifyAdminSession();
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized: Server-side admin verification required on mutations.' }, { status: 401 });
  }

  const body = await request.json();
  const { case_no, plaintiff_name, defendants_name, under_section, court_id, case_type_id, client_mobile } = body;

  if (!case_no || !plaintiff_name || !defendants_name) {
    return NextResponse.json({ error: 'Missing required case metadata fields.' }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase.from('cases').insert([
    {
      case_no,
      plaintiff_name,
      defendants_name,
      under_section: under_section || 'General Litigation',
      court_id: court_id || 1,
      case_type_id: case_type_id || 1,
      client_mobile: client_mobile || '+1-800-555-0100',
      user_id: 1,
      filing_date: new Date().toISOString().split('T')[0],
      status: 'active',
    },
  ]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, case: data }, { status: 201 });
}

// DELETE /api/admin/cases — Delete case (Role-gated mutating endpoint)
export async function DELETE(request: Request) {
  const auth = await verifyAdminSession();
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized: Server-side admin verification required on deletions.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Case ID is required.' }, { status: 400 });
  }

  const supabase = getServiceSupabase();
  const { error } = await supabase.from('cases').delete().eq('case_id', Number(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, deletedId: id });
}
