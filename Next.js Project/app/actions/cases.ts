'use server';

import { verifyAdminSession } from '@/lib/auth';
import { getServiceSupabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

// Mutation 1: Create Case Docket (Server-side Role-Gated)
export async function createCaseAction(formData: FormData) {
  const auth = await verifyAdminSession();
  if (!auth.isValid) {
    throw new Error('Unauthorized: Server-side administrator verification required for case registration.');
  }

  const caseNo = formData.get('case_no')?.toString().trim();
  const plaintiff = formData.get('plaintiff_name')?.toString().trim();
  const defendants = formData.get('defendants_name')?.toString().trim();
  const section = formData.get('under_section')?.toString().trim() || 'General Law';
  const courtId = Number(formData.get('court_id')) || 1;
  const caseTypeId = Number(formData.get('case_type_id')) || 1;
  const clientMobile = formData.get('client_mobile')?.toString().trim() || '+1-800-555-0100';

  if (!caseNo || !plaintiff || !defendants) {
    return { success: false, error: 'Case number, moving party, and respondent fields are required.' };
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase.from('cases').insert([
    {
      case_no: caseNo,
      plaintiff_name: plaintiff,
      defendants_name: defendants,
      under_section: section,
      court_id: courtId,
      case_type_id: caseTypeId,
      client_mobile: clientMobile,
      user_id: 1,
      filing_date: new Date().toISOString().split('T')[0],
      status: 'active',
    },
  ]).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/cases');
  revalidatePath('/admin/cases');
  return { success: true, case: data };
}

// Mutation 2: Update Case Status (Server-side Role-Gated)
export async function updateCaseStatusAction(caseId: number, status: 'active' | 'pending' | 'resolved' | 'inactive') {
  const auth = await verifyAdminSession();
  if (!auth.isValid) {
    throw new Error('Unauthorized: Server-side administrator verification required to modify case status.');
  }

  const supabase = getServiceSupabase();
  const { error } = await supabase
    .from('cases')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('case_id', caseId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/cases');
  revalidatePath('/admin/cases');
  return { success: true };
}

// Mutation 3: Delete Case Record (Server-side Role-Gated)
export async function deleteCaseAction(caseId: number) {
  const auth = await verifyAdminSession();
  if (!auth.isValid) {
    throw new Error('Unauthorized: Server-side administrator verification required to delete case records.');
  }

  const supabase = getServiceSupabase();
  const { error } = await supabase.from('cases').delete().eq('case_id', caseId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/cases');
  revalidatePath('/admin/cases');
  return { success: true };
}

// Mutation 4: Upload Vault Document (Server-side Role-Gated)
export async function uploadVaultDocumentAction(formData: FormData) {
  const auth = await verifyAdminSession();
  if (!auth.isValid) {
    throw new Error('Unauthorized: Only verified firm counsel can upload to client document vaults.');
  }

  const caseId = Number(formData.get('case_id'));
  const title = formData.get('title')?.toString().trim();
  const category = formData.get('category')?.toString().trim() || 'Pleading';
  const fileName = formData.get('file_name')?.toString().trim() || 'document.pdf';
  const fileUrl = formData.get('file_url')?.toString().trim() || 'https://storage.placeholder.url';

  if (!caseId || !title) {
    return { success: false, error: 'Case ID and document title are required.' };
  }

  const supabase = getServiceSupabase();
  const { data, error } = await supabase.from('case_documents').insert([
    {
      case_id: caseId,
      title,
      category,
      file_name: fileName,
      file_size: '1.5 MB',
      file_url: fileUrl,
      uploaded_by: 1,
    },
  ]).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/cases');
  return { success: true, document: data };
}
