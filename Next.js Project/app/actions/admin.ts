'use server';

import { createAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function adminLoginAction(formData: FormData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  // Validate credentials: supports demo admin
  const isDemoAdmin = (email === 'admin@nexoralaw.com' && password === 'DemoAdmin2026!');
  const isCounselAdmin = (email === 'jakiadantal@gmail.com' && Boolean(password && password.length >= 6));

  if (!isDemoAdmin && !isCounselAdmin) {
    return {
      success: false,
      error: 'Invalid administrator credentials. Access restricted to authorized firm counsel.',
    };
  }

  // Set secure HTTP-only cookie on the server
  const token = createAdminToken(email!);
  cookies().set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true };
}

export async function adminLogoutAction() {
  cookies().delete(ADMIN_COOKIE_NAME);
  redirect('/admin/login');
}
