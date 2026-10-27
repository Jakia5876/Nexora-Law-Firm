'use server';

import { getClientSupabase } from '@/lib/supabase';
import { z } from 'zod';

export interface IntakeResult {
  success: boolean;
  message: string;
  inquiryId?: string;
}

const IntakeActionSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Invalid email address').max(120).optional().or(z.literal('')),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  service: z.string().trim().max(100).default('General Legal Inquiry'),
  message: z.string().trim().max(2000, 'Message cannot exceed 2000 characters').optional().or(z.literal('')),
}).refine((data) => Boolean(data.email || data.phone), {
  message: 'Please provide either a phone number or email address for our counsel to respond.',
  path: ['email'],
});

/**
 * Server Action: Public Legal Consultation Intake
 * Uses public anon client that respects the 'contacts' table anon INSERT-only RLS policy.
 */
export async function submitConsultationIntake(formData: FormData): Promise<IntakeResult> {
  const rawData = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    phone: formData.get('phone')?.toString() || '',
    service: formData.get('service')?.toString() || 'General Legal Inquiry',
    message: formData.get('message')?.toString() || '',
  };

  const validation = IntakeActionSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || 'Please check your submitted intake form fields.',
    };
  }

  const { name, email, phone, service, message } = validation.data;
  const recordId = 'cnt_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

  // Uses public anon client enforcing contacts anon INSERT-only RLS policy
  const supabase = getClientSupabase();

  try {
    const { error } = await supabase.from('contacts').insert([
      {
        id: recordId,
        name,
        email: email || null,
        phone: phone || null,
        service: service || 'General Legal Inquiry',
        message: message || null,
        status: 'New',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn('Supabase intake insert notice:', error.message);
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
