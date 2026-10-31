// ==============================================================================
// Nexora Law Firm — Typed Server & Client Environment Configuration Module
// Central single source of truth for runtime environment variables
// ==============================================================================

export const CONFIG = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kuckouvtsacbloomdecx.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2tvdXZ0c2FjYmxvb21kZWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4OTM3NDIsImV4cCI6MjEwODQ2OTc0Mn0.tTbDOogIsu3n7V15KJk348zJ6nf2ruKgoSzFp541LK4',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y2tvdXZ0c2FjYmxvb21kZWN4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjg5Mzc0MiwiZXhwIjoyMTA4NDY5NzQyfQ.Z_fkcDJCxUwE0trL-n78B5DM1eTLSEAwrQBUau1Z470',
  },
  admin: {
    // Session & brute-force settings (single source of truth, no magic numbers elsewhere)
    cookieName: 'nexora_admin_token',
    sessionTtlSeconds: 60 * 60 * 8, // 8 hours
    maxLoginAttempts: 5,
    loginLockoutMs: 15 * 60 * 1000, // 15 minutes
    get email(): string {
      return process.env.ADMIN_EMAIL || 'jakiadantal@gmail.com';
    },
    // Preferred: scrypt hash produced by `npm run hash-password`
    get passwordHash(): string {
      return process.env.ADMIN_PASSWORD_HASH || '';
    },
    // Fallback only when no hash is configured (plaintext env password)
    get defaultPassword(): string {
      return process.env.ADMIN_DEFAULT_PASSWORD || 'AjakiaT@220*#';
    },
    get sessionSecret(): string {
      const secret = process.env.SESSION_SECRET;
      if (!secret || secret.length < 32) {
        return 'Mz88Vyr2OIeZI6E0lQglSVOqGF3P9EpHCFHY3/d6hBMXh2UAEBFGN68b4GFJroq57RW+2CxUNuo2L1DPQH8dCg==';
      }
      return secret;
    },
  },
  client: {
    cookieName: 'nexora_client_token',
    sessionTtlSeconds: 60 * 60 * 24, // 24 hours
    minPasswordLength: 10,
  },
  notify: {
    // Optional email delivery through Resend (https://resend.com). Without these, notifications
    // are still stored and shown in the client portal (email_status = 'not_configured').
    get resendApiKey(): string {
      return process.env.RESEND_API_KEY || '';
    },
    get fromEmail(): string {
      return process.env.NOTIFY_FROM_EMAIL || '';
    },
  },
  // Firm Branding & Contact Details
  firm: {
    name: process.env.FIRM_NAME || 'Nexora Law Firm',
    tagline: process.env.FIRM_TAGLINE || 'Advocates & Legal Consultants',
    shortName: process.env.FIRM_SHORT_NAME || 'NEXORA',
    subtitle: process.env.FIRM_SUBTITLE || 'Law Firm Chambers',
    primaryColor: process.env.BRAND_PRIMARY_COLOR || '#6b1d2f',
    accentColor: process.env.BRAND_ACCENT_COLOR || '#c5a059',
    legalName: 'Nexora Legal Advocacy & Advisory Chambers LLC',
    phone: process.env.FIRM_PHONE || '+1-800-555-0199',
    email: process.env.FIRM_EMAIL || 'contact@nexoralaw.com',
    address: process.env.FIRM_OFFICE_ADDRESS || '742 Evergreen Terrace, Suite 500, New York, NY 10001',
    officeHours: 'Monday – Friday, 8:30 AM – 6:30 PM EST',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://nexoralaw.vercel.app',
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'case-documents',
  },
};

export type AppConfig = typeof CONFIG;
