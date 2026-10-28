import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getClientSupabase } from './supabase';
import { CONFIG } from './config';

export const ADMIN_COOKIE_NAME = 'nexora_admin_token';

// In-memory revocation cache for instant sub-millisecond lookups
const inMemoryRevokedTokens = new Set<string>();

// হার্ডকোডেড কোনো ডিফল্ট স্ট্রিং থাকবে না
function getJwtSecretKey(): Uint8Array {
  const secret = CONFIG.admin.sessionSecret;
  return new TextEncoder().encode(secret);
}
const getJwtSecret = getJwtSecretKey;

// টাইমিং-সেফ পাসওয়ার্ড ভেরিফিকেশন (প্লেইনটেক্সট === পরিহার)
export function verifyAdminPassword(inputPassword: string): boolean {
  const expectedPassword = CONFIG.admin.defaultPassword;
  
  const inputBuffer = Buffer.from(inputPassword);
  const expectedBuffer = Buffer.from(expectedPassword);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

export interface AdminSession {
  email: string;
  role: 'admin';
  jti?: string;
  exp?: number;
}

/**
 * Sign an Edge-compatible cryptographically secured HMAC-SHA256 JWT
 * Includes unique jti (JWT ID) and an 8-hour session lifetime.
 */
export async function createAdminToken(email: string): Promise<string> {
  const secret = getJwtSecretKey();
  const jti = crypto.randomUUID();
  return await new SignJWT({ email: email.toLowerCase(), role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret);
}

/**
 * Revoke an admin session by token jti so it cannot be reused.
 * Updates both the in-memory cache and the persistent Supabase database store.
 */
export async function revokeAdminToken(token: string): Promise<void> {
  try {
    const { session } = await verifyToken(token);
    if (session?.jti) {
      // 1. Mark in memory cache immediately
      inMemoryRevokedTokens.add(session.jti);

      // 2. Persist to PostgreSQL database
      const supabase = getClientSupabase();
      await supabase.from('revoked_tokens').insert([
        {
          jti: session.jti,
          revoked_at: new Date().toISOString(),
          expires_at: session.exp ? new Date(session.exp * 1000).toISOString() : null,
        },
      ]);
    }
  } catch {
    // Ignore invalid tokens during revocation
  }
}

/**
 * Verify a signed JWT token string (Edge-compatible, used in middleware, actions, and routes).
 * Checks cryptographic HMAC-SHA256 signature, expiration, in-memory cache, and persistent DB revocation store.
 */
export async function verifyToken(token: string): Promise<{ isValid: boolean; session?: AdminSession }> {
  try {
    if (!token) return { isValid: false };
    const secret = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secret);

    // 1. Check in-memory revocation cache (fast path)
    if (payload.jti && inMemoryRevokedTokens.has(payload.jti as string)) {
      return { isValid: false };
    }

    // 2. Check persistent database revocation store (cross-instance verification)
    if (payload.jti) {
      try {
        const supabase = getClientSupabase();
        const { data } = await supabase
          .from('revoked_tokens')
          .select('jti')
          .eq('jti', payload.jti as string)
          .maybeSingle();

        if (data?.jti) {
          inMemoryRevokedTokens.add(data.jti);
          return { isValid: false };
        }
      } catch {
        // Fallback gracefully to memory cache if database query encounters network delay
      }
    }

    if (payload && payload.role === 'admin' && typeof payload.email === 'string') {
      return {
        isValid: true,
        session: {
          email: payload.email,
          role: 'admin',
          jti: typeof payload.jti === 'string' ? payload.jti : undefined,
          exp: payload.exp,
        },
      };
    }
  } catch {
    // Cryptographic signature invalid, expired token, or malformed payload
  }
  return { isValid: false };
}

/**
 * Verify that the caller has an authenticated, cryptographically signed admin session.
 * Uses async cookies() API per Next.js 15+ requirements.
 */
export async function verifyAdminSession(): Promise<{ isValid: boolean; session?: AdminSession }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) {
      return { isValid: false };
    }
    return await verifyToken(token);
  } catch (err) {
    console.error('Server-side admin session verification error:', err);
    return { isValid: false };
  }
}

/**
 * Centralized admin guard helper. Throws redirect to login page for unauthenticated requests,
 * or returns the validated AdminSession.
 */
export async function requireAdmin(redirectTo: string = '/admin/login'): Promise<AdminSession> {
  const auth = await verifyAdminSession();
  if (!auth.isValid || !auth.session) {
    redirect(redirectTo);
  }
  return auth.session;
}

/**
 * Helper to construct standardized login redirect URL with search params
 */
export function buildLoginRedirect(baseUrl: string, pathname: string, reason?: string): URL {
  const loginUrl = new URL('/admin/login', baseUrl);
  loginUrl.searchParams.set('redirect', pathname);
  if (reason) {
    loginUrl.searchParams.set('error', reason);
  }
  return loginUrl;
}
