import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// POST /api/intake — Public Consultation Intake Endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Name and either email or telephone number are required.' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const recordId = 'cnt_' + Date.now();

    const { error } = await supabase.from('contacts').insert([
      {
        id: recordId,
        name: name.trim(),
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        service: service || 'General Legal Matter',
        message: message ? message.trim() : null,
        status: 'New',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      inquiryId: recordId,
      message: 'Consultation intake received successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
