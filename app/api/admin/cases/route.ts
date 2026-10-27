import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyAdminSession } from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabase';

const CaseCreateSchema = z.object({
  case_no: z.string().trim().min(2, 'Case number is required').max(100),
  plaintiff_name: z.string().trim().min(2, 'Plaintiff name is required').max(150),
  defendants_name: z.string().trim().min(2, 'Defendant name is required').max(150),
  under_section: z.string().trim().max(150).default('General Litigation'),
  court_id: z.coerce.number().int().positive().default(1),
  case_type_id: z.coerce.number().int().positive().default(1),
  client_mobile: z.string().trim().max(30).default('+1-800-555-0100'),
});

const CaseUpdateSchema = z.object({
  case_id: z.coerce.number().int().positive('Valid case ID is required'),
  status: z.enum(['active', 'pending', 'resolved', 'inactive']).optional(),
  under_section: z.string().trim().max(150).optional(),
});

// GET /api/admin/cases — Paginated Case Registry with Explicit Column Selection
export async function GET(request: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = getServiceSupabase();
  const { data, count, error } = await supabase
    .from('cases')
    .select(
      'case_id, case_no, plaintiff_name, defendants_name, under_section, court_id, case_type_id, assistant_id, client_mobile, status, filing_date, created_at, court:court_id(court_name), case_type:case_type_id(case_type), assistant:assistant_id(assistant_name)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    cases: data || [],
    pagination: {
      page,
      limit,
      totalCount: count ?? data?.length ?? 0,
      totalPages: Math.ceil((count ?? data?.length ?? 0) / limit),
    },
  });
}

// POST /api/admin/cases — Create case (Role-gated mutating endpoint)
export async function POST(request: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parsed = CaseCreateSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid case parameters.' },
        { status: 400 }
      );
    }

    const { case_no, plaintiff_name, defendants_name, under_section, court_id, case_type_id, client_mobile } =
      parsed.data;

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('cases')
      .insert([
        {
          case_no,
          plaintiff_name,
          defendants_name,
          under_section,
          court_id,
          case_type_id,
          client_mobile,
          user_id: 1,
          filing_date: new Date().toISOString().split('T')[0],
          status: 'active',
        },
      ])
      .select('case_id, case_no, plaintiff_name, defendants_name, status, filing_date')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, case: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error creating case.' }, { status: 500 });
  }
}

// PATCH /api/admin/cases — Update case status (Role-gated mutating endpoint)
export async function PATCH(request: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parsed = CaseUpdateSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid update parameters.' },
        { status: 400 }
      );
    }

    const { case_id, status, under_section } = parsed.data;
    const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;
    if (under_section) updatePayload.under_section = under_section;

    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('cases')
      .update(updatePayload)
      .eq('case_id', case_id)
      .select('case_id, case_no, status, updated_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, case: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error updating case.' }, { status: 500 });
  }
}

// DELETE /api/admin/cases — Delete case (Role-gated mutating endpoint)
export async function DELETE(request: NextRequest) {
  const auth = await verifyAdminSession();
  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get('id');
  const parsedId = z.coerce.number().int().positive().safeParse(rawId);

  if (!parsedId.success) {
    return NextResponse.json({ error: 'Valid positive integer case ID is required.' }, { status: 400 });
  }

  const validatedId = parsedId.data;

  const supabase = getServiceSupabase();
  const { error } = await supabase.from('cases').delete().eq('case_id', validatedId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, deletedId: validatedId });
}
