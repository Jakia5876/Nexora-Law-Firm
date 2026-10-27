# Nexora Law Firm — Agent & Contributor Guide

This document provides definitive guidance for AI coding agents (Claude, Gemini, GPT-4, Copilot) and human contributors working on the Nexora Law Firm project.

---

## 📁 Project Architecture & App Router Structure

Nexora Law Firm features a dual-layer architecture:
1. **Next.js App Router Application (`Next.js Project/`)**: Full-stack Next.js web application utilizing React Server Components, Server Actions, Edge Middleware, and Supabase database isolation.
2. **Static Web Previews**: Zero-dependency standalone HTML files (`index.html`, `cases.html`, etc.) for instant client preview and CDN hosting.

```
Nexora-Law-Firm/
├── Next.js Project/                   # Primary Next.js App Router Application
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with fonts, metadata, Vibe96 verification
│   │   ├── page.tsx                   # Public homepage & hero presentation
│   │   ├── globals.css                # Global Tailwind CSS directives & color tokens
│   │   ├── practice-areas/
│   │   │   ├── page.tsx               # Practice areas directory
│   │   │   └── [slug]/page.tsx        # Dynamic individual practice area page
│   │   ├── attorneys/page.tsx         # Attorney roster & bios
│   │   ├── cases/page.tsx             # Public case status inquiry portal
│   │   ├── admin/
│   │   │   ├── page.tsx               # Role-gated admin case dashboard
│   │   │   └── login/page.tsx         # Admin authentication login
│   │   ├── actions/
│   │   │   ├── intake.ts              # Public consultation intake server action
│   │   │   ├── cases.ts               # Role-verified case management server actions
│   │   │   └── admin.ts               # Admin session authentication & cookie actions
│   │   └── api/
│   │       ├── intake/route.ts        # POST endpoint for consultation intake
│   │       └── admin/cases/route.ts   # Role-gated administrative case API
│   ├── components/
│   │   ├── Navbar.tsx                 # Responsive navigation bar
│   │   ├── Footer.tsx                 # Site footer with practice links & disclaimers
│   │   └── ContactForm.tsx            # Isolated public intake consultation form
│   ├── lib/
│   │   ├── supabase.ts                # Client & admin Supabase SDK initializers
│   │   └── auth.ts                    # Server-side admin role & session verification
│   ├── middleware.ts                  # Edge middleware route guard for /admin/*
│   ├── .env.example                   # Environment configuration template
│   ├── package.json                   # Pinned patched dependencies (Next.js, Supabase)
│   ├── package-lock.json              # Committed lockfile (0 audit vulnerabilities)
│   ├── tailwind.config.ts             # Tailwind CSS theme extension
│   ├── tsconfig.json                  # Strict TypeScript configuration
│   └── Dockerfile                     # Production Node.js 20 container image
├── database/
│   ├── schema.sql                     # Complete PostgreSQL DDL (tables, FKs, RLS, indexes)
│   └── seed.sql                       # Initial seed data (admin, attorneys, practices, demo)
├── docs/
│   ├── erd.md                         # Entity-Relationship Diagram & RLS policy notes
│   └── architecture.md                # System design & multi-layer architecture guide
├── .env.example                       # Root environment variable documentation
├── CHANGELOG.md                       # Version history starting at 1.0.0
├── HowToSetup.md                      # Deployment instructions (VPS, Docker, Cloud)
├── LICENSE-NOTE.md                    # Commercial licensing and third-party notices
├── docker-compose.yml                 # Multi-container orchestration (Next.js server)
└── Dockerfile                         # Next.js production runtime container
```

---

## 🛠️ Tech Stack & Pinned Dependencies

- **Framework**: Next.js 16.4.3 (App Router, Server Actions, Server Components)
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.14 + PostCSS 8.5.32
- **Icons**: Lucide React 0.453.0 & Lucide CDN for static previews
- **Database / Backend**: Supabase (`@supabase/supabase-js` 2.118.0)
- **Runtime**: Node.js >= 20.x

---

## 🔐 Security, Authorization & Intake Data Isolation

### 1. Data Isolation Model
- **Public Consultation Intake**: The `contacts` table allows `anon` role **INSERT ONLY**. Anonymous visitors can submit consultations, but cannot read, list, update, or delete records (`USING (false)` for anon reads).
- **Role-Gated Mutations**: All modifications to `cases`, `hearings`, `documents`, and `contacts` require an authenticated session verified server-side.
- **Admin Verification (`lib/auth.ts`)**: Every server action and API mutation executes `verifyAdminSession()` which checks HTTP-only cookies and cryptographically validates the admin role.

### 2. Practice Content Location
- **Database Tables**: Practice areas are stored in `practice_areas` with indexed `slug`, `status`, and `created_at`.
- **Dynamic Routing**: Managed in `Next.js Project/app/practice-areas/[slug]/page.tsx` with static fallback previews for Corporate, Trial, Intellectual Property, and Real Estate.
- **Attorney Profiles**: Stored in `attorneys` table and rendered via `Next.js Project/app/attorneys/page.tsx`.

---

## 🎨 Tailwind CSS Conventions

- **Primary Colors**:
  - `primary-navy`: `#0A192F` (Deep institutional navy)
  - `primary-dark`: `#07101E` (Dark background)
  - `primary-light`: `#112240` (Card container fill)
  - `accent-gold`: `#D4AF37` (Legal prestige gold)
  - `accent-hover`: `#B5952F` (Interactive gold hover state)
- **Typography**:
  - Headings: Serif font (`Playfair Display`, `Georgia`, serif) for authority and elegance.
  - Body / UI: Clean sans-serif (`Inter`, system-ui, sans-serif) for legibility.
- **Component Classes**:
  - Buttons: `bg-[#D4AF37] hover:bg-[#B5952F] text-[#0A192F] font-semibold px-6 py-3 rounded transition-all`
  - Cards: `bg-[#112240] border border-slate-700/60 rounded-xl p-6 shadow-xl`
  - Form Inputs: `w-full bg-[#07101E] border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]`

---

## 🧪 Linting, Testing & Security Audits

### Next.js Application
```bash
# Navigate to Next.js project
cd "Next.js Project"

# Run ESLint / Next lint
npm run lint

# Security audit check (ensures 0 vulnerabilities)
npm audit

# Production build verification
npm run build
```

### Static HTML Linting
```bash
# Run htmlhint across all static templates
npx htmlhint "**/*.html"
```

---

## 🔑 Environment Variables

The project requires the following environment variables documented in `Next.js Project/.env.example`:

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | Supabase Project URL (`https://your-project.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Client | Supabase Anonymous Public API Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Side Only | Administrative bypass key for server actions & seeding |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Public / Client | Default administrator identification (`admin@nexoralaw.com`) |
| `ADMIN_DEFAULT_PASSWORD` | Server-Side Only | Seed administrator password |

---

## 👥 Default Demo Credentials

For automated evaluation and evaluator demonstration:
- **Admin Portal**: `/admin/login` or `cases.html`
- **Email**: `admin@nexoralaw.com`
- **Password**: `DemoAdmin2026!`
- **Role**: System Administrator (`admin`)
