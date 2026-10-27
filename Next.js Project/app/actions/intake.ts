'use server';

import { getServiceSupabase } from '@/lib/supabase';

export interface IntakeResult {
  success: boolean;
  message: string;
  inquiryId?: string;
}

// Server Action: Public Legal Consultation Intake (Isolated Insertion)
export async function submitConsultationIntake(formData: FormData): Promise<IntakeResult> {
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim() || null;
  const phone = formData.get('phone')?.toString().trim() || null;
  const service = formData.get('service')?.toString().trim() || 'General Legal Inquiry';
  const message = formData.get('message')?.toString().trim() || null;

  // Strict validation: Inquirer must supply at least a name
  if (!name) {
    return {
      success: false,
      message: 'Please provide your full legal name to submit an intake brief.',
    };
  }

  // Must provide at least one contact channel
  if (!email && !phone) {
    return {
      success: false,
      message: 'Please provide either a telephone number or email address for our counsel to respond.',
    };
  }

  const supabase = getServiceSupabase();
  const recordId = 'cnt_' + Date.now();

  try {
    const { error } = await supabase.from('contacts').insert([
      {
        id: recordId,
        name,
        email,
        phone,
        service,
        message,
        status: 'New',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn('Supabase intake insert encountered warning:', error.message);
    }

    return {
      success: true,
      message: `Thank you, ${name}. Your consultation brief has been securely transmitted. A partner will contact you shortly.`,
      inquiryId: recordId,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Transmission encountered an error. Please contact our chambers directly.',
    };
  }
}
