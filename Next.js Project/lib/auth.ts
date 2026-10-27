import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'nexora_admin_token';
const DEFAULT_SESSION_SECRET = 'nexora-firm-secure-jwt-hmac-sha256-signing-key-2026';

function getJwtSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET || DEFAULT_SESSION_SECRET;
  return new TextEncoder().encode(secret);
}

export interface AdminSession {
  email: string;
  role: 'admin';
  exp?: number;
}

/**
 * Sign an Edge-compatible cryptographically secured HMAC-SHA256 JWT
 */
export async function createAdminToken(email: string): Promise<string> {
  const secret = getJwtSecret();
  return await new SignJWT({ email: email.toLowerCase(), role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

/**
 * Verify a signed JWT token string (Edge-compatible, used in middleware and server actions)
 */
export async function verifyToken(token: string): Promise<{ isValid: boolean; session?: AdminSession }> {
  try {
    if (!token) return { isValid: false };
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    if (payload && payload.role === 'admin' && typeof payload.email === 'string') {
      return {
        isValid: true,
        session: {
          email: payload.email,
          role: 'admin',
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
 * Verify that the caller has an authenticated, cryptographically signed admin session
 */
export async function verifyAdminSession(): Promise<{ isValid: boolean; session?: AdminSession }> {
  try {
    const cookieStore = cookies();
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
