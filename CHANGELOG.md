# Changelog

All notable changes to the Nexora Law Firm project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-10-26

### Added
- **`index.html`** — Full-featured law firm landing page with:
  - High-conversion hero section with animated background
  - Practice area showcase (Corporate, Criminal, Family, Property law)
  - Attorney roster with profile cards
  - AI rulebook briefings section
  - Client testimonials carousel
  - Consultation inquiry form connected to Supabase `contacts` table
  - Supabase client portal login modal
- **`cases.html`** — Authenticated case management dashboard:
  - Full CRUD for cases, courts, case types, and assistants
  - Hearing date tracking and order details
  - Document vault with Supabase Storage integration
  - Subscription plan enforcement
  - Print-ready case reports
- **`accelerator.html`** — Corporate growth & acquisition practice landing page
- **`odegard.html`** — Trial & personal injury practice landing page
- **`service-terms.html`** — Hosting & support terms of service
- **`license.html`** — Commercial licensing terms
- **`seller-agreement.html`** — Marketplace and vendor agreement
- **`privacy.html`** — Data protection & GDPR-aligned privacy policy
- **`supabase-setup.sql`** — Combined PostgreSQL schema + seed data for Supabase
- **`database/schema.sql`** — Standalone schema file (tables, indexes, triggers, RLS)
- **`database/seed.sql`** — Standalone seed file (default admin, courts, case types)
- **`.env.example`** — Environment variable template for Supabase credentials
- **`vercel.json`** — Vercel deployment configuration
- **`README.md`** — Project overview and deployment instructions
- **`AGENTS.md`** — Agent & contributor guide
- **`CHANGELOG.md`** — This file

### Design System
- Color palette: Burgundy `#800020`, Obsidian Dark `#0D0D0D`, Metallic Gold `#C9A84C`
- Typography: Playfair Display (headings), Inter (body)
- Responsive breakpoints: 375px, 768px, 1024px, 1440px

### Database Schema
- `users` — Multi-role user accounts (admin, lawyer, client, assistant)
- `court` — Court registry
- `subscriptions` — Subscription plans and payment records
- `case_type` — Categorization for case types
- `assistant` — Legal assistant profiles
- `cases` — Core case records with full metadata
- `case_detail` — Hearing history, orders, and diary notes
- `case_documents` — Private document vault with Supabase Storage URLs
- `contacts` — Website consultation inquiry submissions

### Security
- Row Level Security (RLS) enabled on all tables
- Supabase Auth integration for session management
- Role-based access control at application layer

---

## [Unreleased]

### Planned
- Email notification system for upcoming hearing dates
- PDF generation for case reports
- Multi-language support (English, Bengali)
- Advanced analytics dashboard for firm administrators
- Mobile app companion (React Native)
