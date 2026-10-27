// ==============================================================================
// Nexora Law Firm — Global Firm Configuration & Site Metadata
// ==============================================================================

export const FIRM_CONFIG = {
  name: 'Nexora Law Firm',
  tagline: 'Advocates & Legal Consultants',
  legalName: 'Nexora Legal Advocacy & Advisory Chambers LLC',
  phone: process.env.FIRM_PHONE || '+1-800-555-0199',
  email: process.env.FIRM_EMAIL || 'contact@nexoralaw.com',
  address: process.env.FIRM_OFFICE_ADDRESS || '742 Evergreen Terrace, Suite 500, New York, NY 10001',
  officeHours: 'Monday – Friday, 8:30 AM – 6:30 PM EST',
  canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://nexoralaw.vercel.app',
  social: {
    linkedin: 'https://linkedin.com/company/nexora-law',
    twitter: 'https://twitter.com/nexoralaw',
  },
  disclaimer:
    'The legal information presented on this site is for general informational purposes only and does not establish an attorney-client relationship. Prior case results do not guarantee similar outcomes.',
};

export type FirmConfig = typeof FIRM_CONFIG;
