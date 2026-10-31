## Demo Access
Live URL: https://nexoralaw.vercel.app/

Demo credentials are **not published in this repository**. They are supplied
separately in the buyer datasheet / on request (see `SECURITY.md`).
Seeded demo case reference: `NEX-2026-001`.


# Nexora Case Manager

> **Case management and client portal software for law firms.** Staff manage cases and timelines; clients sign in to follow their own matters and get notified when something changes. A configurable demo firm website is included.

[![CI](https://github.com/Jakia5876/Nexora-Law-Firm/actions/workflows/ci.yml/badge.svg)](https://github.com/Jakia5876/Nexora-Law-Firm/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](CHANGELOG.md)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://nexoralaw.vercel.app/)

**Live Demo**: [nexoralaw.vercel.app](https://nexoralaw.vercel.app/)

## What you get

| Module | Who uses it | What it does |
|---|---|---|
| **Case register** (`/admin/cases`) | Firm staff | Open, search and manage cases; update status; document links |
| **Case timeline** (`/admin/cases/[id]`) | Firm staff | Add hearings, orders and notes; choose what clients may see |
| **Client accounts** (`/admin/clients`) | Firm staff | Create client logins (temporary password shown once), reset, deactivate, grant access per case |
| **Client portal** (`/client`) | Clients | Sign in, see only their own cases, read the timeline, see notifications |
| **Notifications** | Clients | Stored in the portal; optional email through Resend (generic text, no case details) |
| **Branding** | The buyer | Firm name, tagline, colors and contact details come from environment variables |
| **Public intake & status check** | Visitors | Consultation form (anon insert only) and a case-status lookup (case no. + mobile) |
| **Demo firm website** | Optional | Home, practice areas, attorneys: sample content you can replace or remove |

## Security model
- Separate admin and client sessions (different JWT roles and cookies); a client token can never pass the admin guard.
- Every admin server action and API route verifies the session itself; middleware is a second layer.
- Clients are checked against an explicit access list on every page (no guessable ids).
- Passwords are salted scrypt hashes; login is throttled; session revocation fails closed.
- All tables have RLS enabled and the private ones have no policies: data is reached only through server code.

## Configure the branding
Set `FIRM_NAME`, `FIRM_SHORT_NAME`, `FIRM_SUBTITLE`, `FIRM_TAGLINE`, `BRAND_PRIMARY_COLOR`, `BRAND_ACCENT_COLOR` and the `FIRM_*` contact variables (see `.env.example`). The sample page copy lives in `app/page.tsx` and `app/attorneys/`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.4.3 (App Router, Server Actions, Server Components) |
| UI Library | React 19.3.1 |
| Styling | Tailwind CSS 3.4.14 + Vanilla CSS |
| Icons | Lucide React 0.453.0 / Lucide CDN |
| Fonts | Google Fonts — Playfair Display, Inter |
| Backend & DB | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Container | Docker (Node.js 20 Alpine) & Docker Compose |
| Deployment | Vercel (Production Live Demo) |
| CI/CD | GitHub Actions (Build & Security Audit) |

---

## 👥 Administrator Access

### Admin Setup
Set `ADMIN_PASSWORD_HASH` (or `ADMIN_DEFAULT_PASSWORD`) and `SESSION_SECRET` in your `.env.local` or host settings before logging in at `/admin/login`.

- **Admin Portal**: `/admin/login`
- **Session Verification**: Server-side Edge JWT with cryptographic HMAC-SHA256 signature verification, timing-safe credential validation, and brute-force throttling.

---

## ⚡ Quick Start & App Selection

The repository contains two operational modes. Follow the commands for your intended target:

### Prerequisites
- **Node.js**: `>= 20.x`
- **Package Manager**: `npm >= 10.x`
- **Database**: PostgreSQL 14+ or a [Supabase](https://supabase.com) project instance

### Option A: Next.js App (Vercel or local)

1. **Initialize Database**: In the Supabase SQL Editor run `database/schema.sql`, then `database/seed.sql`.
2. **Configure Environment**:
   ```bash
   cp .env.example .env.local
   # Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY,
   # SESSION_SECRET (>= 32 chars), ADMIN_EMAIL and ADMIN_PASSWORD_HASH (npm run hash-password)
   ```
3. **Install & Run**:
   ```bash
   npm ci
   npm run build
   npm start
   # http://localhost:3000
   ```

### Option B: Docker

```bash
docker compose up -d --build
# http://localhost:3000
```

See [HowToSetup.md](HowToSetup.md) for full VPS (Ubuntu + Nginx) and Docker installation guides.

---

## 📁 Project Structure

```
.
├── app/                       # App Router pages, server actions, API routes
├── components/                # Reusable UI components
├── lib/                       # Supabase clients, config & server auth utilities
├── middleware.ts              # Edge middleware admin guard
├── database/
│   ├── schema.sql             # Tables, indexes, RLS
│   └── seed.sql               # Demo seed data
├── docs/                      # api.md, erd.md, architecture.md
├── docker/nginx.conf
├── Dockerfile
├── docker-compose.yml
├── .github/workflows/ci.yml
├── .env.example
├── package.json / package-lock.json
├── HowToSetup.md
├── AGENTS.md / CLAUDE.md
├── CHANGELOG.md
├── LICENSE / LICENSE-NOTE.md / SECURITY.md
└── README.md
```

---

## 🗄️ Database Schema & Tables

All tables are created from scratch in `database/schema.sql`:

| Table | Purpose | Indexes / Keys |
|---|---|---|
| `users` | Multi-role accounts (admin, lawyer, client, assistant) | PK `id`, UNIQUE `email`, `role` |
| `practice_areas` | Law firm practice areas and specialty descriptions | PK `id`, UNIQUE `slug`, INDEX `slug`, `status`, `created_at` |
| `attorneys` | Attorney bios, bar admissions, titles, and photos | PK `id`, UNIQUE `slug`, INDEX `slug`, `status`, `created_at` |
| `site_content` | Dynamic firm content, hero copy, and metadata | PK `id`, UNIQUE `section_key`, INDEX `section_key`, `status` |
| `court` | Court registry and jurisdictions | PK `id`, `name` |
| `case_type` | Case categorization | PK `id`, `name` |
| `assistant` | Legal assistant profiles | PK `id`, `user_id` FK |
| `cases` | Core client litigation records | PK `id`, `case_number`, `client_id` FK |
| `case_detail` | Hearing history, orders, diary | PK `id`, `case_id` FK |
| `case_documents` | Document vault (Supabase Storage) | PK `id`, `case_id` FK |
| `contacts` | Website consultation inquiry submissions | PK `id`, INDEX `status`, `created_at` |
| `subscriptions` | Subscription plans & retainer records | PK `id`, `user_id` FK |

---

## 🔐 Security & RLS Policy Isolation

- **Row Level Security (RLS)** is enabled across 100% of tables.
- **Intake Isolation**: The `contacts` table strictly allows `anon` role **INSERT ONLY**. Anonymous visitors cannot SELECT, UPDATE, or DELETE consultation entries.
- **Role Verification**: All mutating endpoints verify administrative roles server-side using cryptographic session validation.
- See [SECURITY.md](SECURITY.md) for vulnerability reporting.
- See [docs/erd.md](docs/erd.md) for full ERD and RLS policy design notes.

---

## 📜 License & Notes

- **License**: MIT License — see [LICENSE](LICENSE)
- **Buyer & Third-Party Notice**: See [LICENSE-NOTE.md](LICENSE-NOTE.md)

---

## 📌 Versions

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

Current version: **1.0.0**
