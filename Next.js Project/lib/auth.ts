import { cookies } from 'next/headers';

export const ADMIN_COOKIE_NAME = 'nexora_admin_token';

export interface AdminSession {
  email: string;
  role: 'admin';
  authenticatedAt: number;
}

// Verify that the caller is an authenticated administrator on the server side
export async function verifyAdminSession(): Promise<{ isValid: boolean; session?: AdminSession }> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return { isValid: false };
    }

    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (decoded && decoded.role === 'admin' && decoded.email) {
      return {
        isValid: true,
        session: decoded as AdminSession,
      };
    }
  } catch (err) {
    console.error('Server-side admin session verification error:', err);
  }

  return { isValid: false };
}

// Create an authenticated server session token
export function createAdminToken(email: string): string {
  const payload: AdminSession = {
    email: email.toLowerCase(),
    role: 'admin',
    authenticatedAt: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}
