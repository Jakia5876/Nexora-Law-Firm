'use server';

import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { notifyCaseClients } from '@/lib/notify';

// Input Validation Schemas
const CreateCaseSchema = z.object({
  case_no: z.string().trim().min(2, 'Case number is required').max(100),
  plaintiff_name: z.string().trim().min(2, 'Moving party / plaintiff name is required').max(150),
  defendants_name: z.string().trim().min(2, 'Respondent / defendant name is required').max(150),
  under_section: z.string().trim().max(150).default('General Law'),
  court_id: z.coerce.number().int().positive().default(1),
  case_type_id: z.coerce.number().int().positive().default(1),
  client_mobile: z.string().trim().min(5, 'Valid contact number is required').max(30),
});

const UpdateCaseStatusSchema = z.object({
  caseId: z.number().int().positive('Valid positive case ID is required'),
  status: z.enum(['active', 'inactive']),
});

const DeleteCaseSchema = z.object({
  caseId: z.number().int().positive('Valid positive case ID is required'),
});

const UploadDocumentSchema = z.object({
  caseId: z.coerce.number().int().positive('Valid positive case ID is required'),
  title: z.string().trim().min(2, 'Document title is required').max(255),
  category: z.string().trim().max(100).default('Pleading'),
  fileName: z.string().trim().max(255).default('document.pdf'),
  fileUrl: z.string().trim().url('Valid document URL is required'),
});

// Mutation 1: Create Case Docket (Server-side Role-Gated)
export async function createCaseAction(formData: FormData) {
  // Guard 1: Verify admin session before any database interaction
  const admin = await requireAdmin();
  if (!admin || admin.role !== 'admin') {
    return { success: false, error: 'Unauthorized: Administrator verification required.' };
  }

  const raw = {
    case_no: formData.get('case_no')?.toString(),
    plaintiff_name: formData.get('plaintiff_name')?.toString(),
    defendants_name: formData.get('defendants_name')?.toString(),
    under_section: formData.get('under_section')?.toString() || 'General Law',
    court_id: formData.get('court_id'),
    case_type_id: formData.get('case_type_id'),
    client_mobile: formData.get('client_mobile')?.toString() || '+1-800-555-0100',
  };

  const parsed = CreateCaseSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid case docket input.' };
  }

  const { case_no, plaintiff_name, defendants_name, under_section, court_id, case_type_id, client_mobile } = parsed.data;

  const supabase = getServiceSupabase();

  // The case belongs to the same firm user that owns the chosen court (no hard-coded user id)
  const { data: court } = await supabase.from('court').select('user_id').eq('court_id', court_id).maybeSingle();
  if (!court) return { success: false, error: 'Selected court was not found.' };

  const { data, error } = await supabase.from('cases').insert([
    {
      case_no,
      plaintiff_name,
      defendants_name,
      under_section,
      court_id,
      case_type_id,
      client_mobile,
      user_id: court.user_id,
      filing_date: new Date().toISOString().split('T')[0],
      status: 'active',
    },
  ]).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/cases');
  revalidatePath('/admin/cases');
  return { success: true, message: `Case ${case_no} created.`, case: data };
}

// Mutation 2: Update Case Status (Server-side Role-Gated)
export async function updateCaseStatusAction(caseId: number, status: 'active' | 'inactive') {
  // Guard 1: Verify admin session before any database interaction
  const admin = await requireAdmin();
  if (!admin || admin.role !== 'admin') {
    return { success: false, error: 'Unauthorized: Administrator verification required.' };
  }

  const parsed = UpdateCaseStatusSchema.safeParse({ caseId, status });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid status parameters.' };
  }

  const validatedId = parsed.data.caseId;
  const validatedStatus = parsed.data.status;

  const supabase = getServiceSupabase();
  const { data: updated, error } = await supabase
    .from('cases')
    .update({ status: validatedStatus, updated_at: new Date().toISOString() })
    .eq('case_id', validatedId)
    .select('case_no')
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }
  if (!updated) {
    return { success: false, error: 'Case not found.' };
  }

  // Record the change on the client-visible timeline and notify the linked clients
  const title = `Case status changed to ${validatedStatus}`;
  await supabase.from('case_events').insert([{ case_id: validatedId, event_type: 'status', title, client_visible: true }]);
  const notified = await notifyCaseClients(validatedId, updated.case_no, title, `The status of case ${updated.case_no} is now ${validatedStatus}.`);

  revalidatePath('/cases');
  revalidatePath('/admin/cases');
  revalidatePath(`/admin/cases/${validatedId}`);
  return { success: true, message: `Status updated. ${notified} client(s) notified.` };
}

// Mutation 3: Delete Case Record (Server-side Role-Gated)
export async function deleteCaseAction(caseId: number) {
  // Guard 1: Verify admin session before any database interaction
  const admin = await requireAdmin();
  if (!admin || admin.role !== 'admin') {
    return { success: false, error: 'Unauthorized: Administrator verification required.' };
  }

  const parsed = DeleteCaseSchema.safeParse({ caseId });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid case ID for deletion.' };
  }

  const validatedId = parsed.data.caseId;

  const supabase = getServiceSupabase();
  const { error } = await supabase.from('cases').delete().eq('case_id', validatedId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/cases');
  revalidatePath('/admin/cases');
  return { success: true };
}

// Mutation 4: Upload Vault Document (Server-side Role-Gated)
export async function uploadVaultDocumentAction(formData: FormData) {
  // Guard 1: Verify admin session before any database interaction
  const admin = await requireAdmin();
  if (!admin || admin.role !== 'admin') {
    return { success: false, error: 'Unauthorized: Administrator verification required.' };
  }

  const raw = {
    caseId: formData.get('case_id'),
    title: formData.get('title')?.toString(),
    category: formData.get('category')?.toString() || 'Pleading',
    fileName: formData.get('file_name')?.toString() || 'document.pdf',
    fileUrl: formData.get('file_url')?.toString(),
  };

  const parsed = UploadDocumentSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Invalid document vault parameters.' };
  }

  const { caseId, title, category, fileName, fileUrl } = parsed.data;

  const supabase = getServiceSupabase();
  const { data, error } = await supabase.from('case_documents').insert([
    {
      case_id: caseId,
      title,
      category,
      file_name: fileName,
      file_url: fileUrl,
    },
  ]).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/cases');
  return { success: true, document: data };
}

// FormData wrappers used by the admin pages (each re-checks the admin session through the action it calls)
export async function setCaseStatusFormAction(formData: FormData) {
  const caseId = Number(formData.get('case_id'));
  const status = formData.get('status')?.toString();
  if (status !== 'active' && status !== 'inactive') return { success: false, error: 'Choose a valid status.' };
  return updateCaseStatusAction(caseId, status);
}

export async function deleteCaseFormAction(formData: FormData) {
  const result = await deleteCaseAction(Number(formData.get('case_id')));
  if (result.success) redirect('/admin/cases');
  return result;
}
