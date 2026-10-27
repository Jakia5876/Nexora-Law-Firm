# Changelog

All notable changes to the Nexora Law Firm project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-10-26

### Added
- **`Next.js Project/`** — Production Next.js 16 App Router application:
  - Role-gated admin dashboard (`/admin`) and secure authentication (`/admin/login`)
  - Server actions for public consultation intake (`app/actions/intake.ts`) and role-verified mutations (`app/actions/cases.ts`)
  - Edge middleware protecting administrative routes (`middleware.ts`)
  - Dynamic practice area routes (`/practice-areas/[slug]`) and attorney directory (`/attorneys`)
  - Pinned zero-vulnerability dependencies in `package-lock.json`
- **`index.html`** — Full-featured luxury law firm landing page with:
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
- **Practice & Legal Pages**:
  - `accelerator.html` — Corporate growth & acquisition practice landing page
  - `odegard.html` — Trial & personal injury practice landing page
  - `service-terms.html` — Hosting & support terms of service
  - `license.html` — Commercial licensing terms
  - `seller-agreement.html` — Marketplace and vendor agreement
  - `privacy.html` — Data protection & GDPR-aligned privacy policy
- **Database Architecture & Supabase Engine**:
  - `database/schema.sql` — PostgreSQL DDL with `practice_areas`, `attorneys`, `site_content`, `cases`, `users`, and strict role-based RLS
  - `database/seed.sql` — Seed data with demo admin (`admin@nexoralaw.com`), attorneys, and sample practice areas
  - `supabase-setup.sql` — Automated one-step database provisioner
- **Architecture & Setup Documentation**:
  - `docs/erd.md` — Entity Relationship Diagram and table schema documentation
  - `docs/architecture.md` — Dual-layer system architecture overview
  - `HowToSetup.md` — Step-by-step installation for VPS and Docker targets
  - `LICENSE-NOTE.md` — Commercial licensing terms for buyers and third-party components
  - `CLAUDE.md` & `AGENTS.md` — AI assistant instructions and coding conventions
- **Containerization**:
  - `Dockerfile` & `docker-compose.yml` — Production Node.js 20 container running Next.js application server with health checks

### Security & Privacy
- Row Level Security (RLS) enabled across 100% of tables with strict intake isolation (`anon` INSERT only on `contacts`; all mutations restricted to authenticated `admin`).
- Zero hardcoded production credentials in codebase; all sensitive secrets managed via environment variables.

---

## [Unreleased]

### Planned
- Automated SMS and calendar sync for courtroom hearing dates
- Multilingual client consultation intake (English, Spanish, French)
- End-to-end encrypted document sharing for attorney-client privilege
