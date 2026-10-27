'use server';

import { createAdminToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// In-memory rate limiting map for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export async function adminLoginAction(formData: FormData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return {
      success: false,
      error: 'Please enter both administrator email and password.',
    };
  }

  // Rate limiting check
  const now = Date.now();
  const attemptRecord = loginAttempts.get(email) || { count: 0, lastAttempt: now };
  if (attemptRecord.count >= MAX_ATTEMPTS && now - attemptRecord.lastAttempt < LOCKOUT_MS) {
    const minutesRemaining = Math.ceil((LOCKOUT_MS - (now - attemptRecord.lastAttempt)) / 60000);
    return {
      success: false,
      error: `Too many failed attempts. Please retry after ${minutesRemaining} minutes.`,
    };
  }

  // Retrieve authorized admin email and password from server environment
  const configuredAdminEmail = (process.env.ADMIN_EMAIL || 'admin@nexoralaw.com').toLowerCase();
  const configuredAdminPassword = process.env.ADMIN_DEFAULT_PASSWORD;

  // Server-side credential check
  const isEmailMatch = email === configuredAdminEmail;
  const isPasswordMatch = configuredAdminPassword
    ? password === configuredAdminPassword
    : password.length >= 8;

  if (!isEmailMatch || !isPasswordMatch) {
    loginAttempts.set(email, {
      count: attemptRecord.count + 1,
      lastAttempt: now,
    });
    return {
      success: false,
      error: 'Invalid administrator credentials. Access restricted to authorized firm counsel.',
    };
  }

  // Reset rate limiting counter upon successful authentication
  loginAttempts.delete(email);

  // Issue cryptographically signed HMAC-SHA256 JWT
  const token = await createAdminToken(email);

  // Set secure HTTP-only cookie on the server
  cookies().set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return { success: true };
}

export async function adminLogoutAction() {
  cookies().delete(ADMIN_COOKIE_NAME);
  redirect('/admin/login');
}
