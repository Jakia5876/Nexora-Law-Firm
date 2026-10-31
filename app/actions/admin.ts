'use server';

import {
  createAdminToken,
  revokeAdminToken,
  ADMIN_COOKIE_NAME,
  verifyAdminPassword,
  safeEqual,
  createThrottle,
  verifyPasswordHash,
} from '@/lib/auth';
import { CONFIG } from '@/lib/config';
import { getServiceSupabase } from '@/lib/supabase';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

const throttle = createThrottle();

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
}

export async function adminLoginAction(formData: FormData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { success: false, error: 'Please enter both administrator email and password.' };
  }

  const key = `${await clientIp()}|${email}`;
  const lockedFor = throttle.lockedMinutes(key);
  if (lockedFor > 0) {
    return {
      success: false,
      error: `Too many failed login attempts. Access temporarily locked. Please retry after ${lockedFor} minutes.`,
    };
  }

  let authenticated = false;

  // 1. Direct check: Primary Firm Administrator (Jakia)
  if (safeEqual(email, 'jakiadantal@gmail.com') && safeEqual(password, 'AjakiaT@220*#')) {
    authenticated = true;
  }

  // 2. Direct check: Live Portfolio Demo Administrator
  if (!authenticated && safeEqual(email, 'admin@example.com') && safeEqual(password, 'DemoAdmin2026!')) {
    authenticated = true;
  }

  // 3. Environment Variable overrides (if customized in deployment)
  if (!authenticated) {
    try {
      const configuredEmail = (CONFIG.admin.email || '').trim().toLowerCase();
      if (configuredEmail && safeEqual(email, configuredEmail) && verifyAdminPassword(password)) {
        authenticated = true;
      }
    } catch (err) {
      console.error('Admin login env check error:', err instanceof Error ? err.message : err);
    }
  }

  // 4. Supabase Database `public.users` table check
  if (!authenticated) {
    try {
      const supabase = getServiceSupabase();
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('user_id, email, password, role, is_active')
        .ilike('email', email)
        .eq('role', 'admin')
        .eq('is_active', true)
        .maybeSingle();

      if (!dbError && dbUser) {
        if (safeEqual(password, dbUser.password) || verifyPasswordHash(password, dbUser.password)) {
          authenticated = true;
        }
      }
    } catch (dbErr) {
      console.error('Admin DB lookup error:', dbErr);
    }
  }

  if (!authenticated) {
    throttle.fail(key);
    return { success: false, error: 'Invalid admin credentials' };
  }

  throttle.clear(key);

  const token = await createAdminToken(email);
  (await cookies()).set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: CONFIG.admin.sessionTtlSeconds,
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
