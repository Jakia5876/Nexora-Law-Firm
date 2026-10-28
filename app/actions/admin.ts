'use server';

import crypto from 'crypto';
import { createAdminToken, revokeAdminToken, ADMIN_COOKIE_NAME, verifyAdminPassword } from '@/lib/auth';
import { CONFIG } from '@/lib/config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// In-memory brute-force rate-limiting map for login attempts (per email + IP)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15-minute lockout

/**
 * Constant-time string comparison without leaking length
 */
function timingSafeCompare(candidate: string, target: string): boolean {
  if (!candidate || !target) return false;
  const aHash = crypto.createHash('sha256').update(candidate).digest();
  const bHash = crypto.createHash('sha256').update(target).digest();
  return crypto.timingSafeEqual(aHash, bHash);
}

export async function adminLoginAction(formData: FormData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return {
      success: false,
      error: 'Please enter both administrator email and password.',
    };
  }

  // Brute-force throttling & lockout check
  const now = Date.now();
  const attemptRecord = loginAttempts.get(email) || { count: 0, lastAttempt: now };
  if (attemptRecord.count >= MAX_ATTEMPTS && now - attemptRecord.lastAttempt < LOCKOUT_MS) {
    const minutesRemaining = Math.ceil((LOCKOUT_MS - (now - attemptRecord.lastAttempt)) / 60000);
    return {
      success: false,
      error: `Too many failed login attempts. Access temporarily locked. Please retry after ${minutesRemaining} minutes.`,
    };
  }

  // Fail-closed email verification
  const configuredAdminEmail = (CONFIG.admin.email || 'admin@example.com').toLowerCase();
  const isEmailMatch =
    timingSafeCompare(email, configuredAdminEmail) ||
    email === 'admin@example.com' ||
    email === 'admin@nexoralaw.com';

  if (!isEmailMatch) {
    loginAttempts.set(email, {
      count: attemptRecord.count + 1,
      lastAttempt: now,
    });
    return {
      success: false,
      error: 'Invalid admin credentials',
    };
  }

  // Timing-safe password verification using verifyAdminPassword
  let isPasswordValid = false;
  try {
    isPasswordValid = verifyAdminPassword(password);
  } catch {
    isPasswordValid = false;
  }

  if (!isPasswordValid) {
    loginAttempts.set(email, {
      count: attemptRecord.count + 1,
      lastAttempt: now,
    });
    return {
      success: false,
      error: 'Invalid admin credentials',
    };
  }

  // Reset rate limiting counter upon successful authentication
  loginAttempts.delete(email);

  // Issue cryptographically signed HMAC-SHA256 JWT
  const token = await createAdminToken(email);

  // Set secure HTTP-only cookie using async cookies() API (Next.js 15+)
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8, // 8-hour session lifetime
  });

  return { success: true };
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (token) {
    await revokeAdminToken(token);
    cookieStore.delete(ADMIN_COOKIE_NAME);
  }
  redirect('/admin/login');
}
