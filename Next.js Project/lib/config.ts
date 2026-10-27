// ==============================================================================
// Nexora Law Firm — Typed Server & Client Environment Configuration Module
// Central single source of truth for runtime environment variables
// ==============================================================================

export const CONFIG = {
  // Administrator Identification
  admin: {
    email: (process.env.ADMIN_EMAIL || 'admin@nexoralaw.com').trim().toLowerCase(),
    defaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || '',
  },

  // Security Configuration
  security: {
    sessionSecret: process.env.SESSION_SECRET || '',
  },

  // Firm Branding & Contact Details (sourced from environment with luxury fallbacks)
  firm: {
    name: process.env.FIRM_NAME || 'Nexora Law Firm',
    tagline: 'Advocates & Legal Consultants',
    legalName: 'Nexora Legal Advocacy & Advisory Chambers LLC',
    phone: process.env.FIRM_PHONE || '+1-800-555-0199',
    email: process.env.FIRM_EMAIL || 'contact@nexoralaw.com',
    address: process.env.FIRM_OFFICE_ADDRESS || '742 Evergreen Terrace, Suite 500, New York, NY 10001',
    officeHours: 'Monday – Friday, 8:30 AM – 6:30 PM EST',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://nexoralaw.vercel.app',
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'case-documents',
  },

  // Supabase Credentials
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
} as const;

export type AppConfig = typeof CONFIG;
