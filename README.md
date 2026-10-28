# Nexora Law Firm Platform

Enterprise Legal Management Platform built with Next.js 16 (App Router), Tailwind CSS, and Supabase.

[![CI](https://github.com/Jakia5876/Nexora-Law-Firm/actions/workflows/ci.yml/badge.svg)](https://github.com/Jakia5876/Nexora-Law-Firm/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://nexoralaw.vercel.app/)

## Live Demo Access
- **Live Demo URL:** https://nexoralaw.vercel.app/
- **Admin Portal:** `/admin/login`
- **Client Portal:** `/cases`

> **Note for Reviewers & Buyers:**
> Demo access is pre-configured on the live deployment. Per security compliance standards, all production credentials and administrative passwords must be provisioned via environment variables (`ADMIN_DEFAULT_PASSWORD`, `SESSION_SECRET`) and are never committed to version control.

---




## ✨ System Architecture & Application

Nexora Law Firm is a production-grade full-stack Next.js App Router application:

- **Next.js 16 App Router Application**:
  - Production React Server Components & Server Actions
  - Role-gated administrative dashboard (`/admin`) and secure authentication (`/admin/login`)
  - Strict intake data isolation: anonymous visitors can submit consultations (`anon` INSERT only), while reads/edits/deletions require server-verified admin sessions
  - Dynamic practice area routes (`/practice-areas/[slug]`) and attorney directory (`/attorneys`)
  - Pinned zero-vulnerability dependencies verified with `npm audit`

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
Set `ADMIN_DEFAULT_PASSWORD` and `SESSION_SECRET` in your `.env.local` or host settings before logging in at `/admin/login`.

- **Admin Portal**: `/admin/login` or `/cases.html?session=admin`
- **Session Verification**: Server-side Edge JWT with cryptographic HMAC-SHA256 signature verification, timing-safe credential validation, and brute-force throttling.

---

## ⚡ Quick Start & App Selection

The repository contains two operational modes. Follow the commands for your intended target:

### Prerequisites
- **Node.js**: `>= 20.x`
- **Package Manager**: `npm >= 10.x`
- **Database**: PostgreSQL 14+ or a [Supabase](https://supabase.com) project instance

### Option A: Next.js App Router Application (Primary Production App)

1. **Initialize Database**:
   Open your Supabase SQL Editor and execute `database/schema.sql` first to establish tables, foreign keys, indexes, and RLS policies, then run `database/seed.sql`.
2. **Configure Environment**:
   ```bash
   cd "Next.js Project"
   cp .env.example .env.local
   # Supply NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SESSION_SECRET, and ADMIN_DEFAULT_PASSWORD
   ```
3. **Install Dependencies & Run**:
   ```bash
   cd "Next.js Project"
   npm ci
   npm run build
   npm start
   # Production server listens at http://localhost:3000
   ```

### Option B: Docker Container Deployment

```bash
docker compose up -d --build
# Production containerized server running at http://localhost:3000
```

### Option C: Zero-Build Static Web Previews (Root Directory)

```bash
# Run at repository root:
npm ci
npm start
# Serves static preview templates on http://localhost:8080
```

See [HowToSetup.md](HowToSetup.md) for full VPS (Ubuntu + Nginx) and Docker installation guides.

---

## 📁 Project Structure

```
.
├── Next.js Project/           # Next.js App Router application
│   ├── app/                   # App Router pages, server actions, and API routes
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Supabase clients & server auth utilities
│   ├── middleware.ts          # Edge middleware role guard
│   ├── .env.example           # Environment configuration template
│   ├── package.json           # Pinned dependencies
│   ├── package-lock.json      # Committed lockfile (0 audit vulnerabilities)
│   └── Dockerfile             # Standalone Next.js container
├── index.html                 # Main landing page + client login
├── cases.html                 # Case management dashboard
├── accelerator.html           # Corporate practice page
├── odegard.html               # Trial & injury practice page
├── service-terms.html         # Terms of service
├── license.html               # Commercial license
├── seller-agreement.html      # Vendor agreement
├── privacy.html               # Privacy policy
├── supabase-setup.sql         # Combined schema + seed (one-step setup)
├── database/
│   ├── schema.sql             # Database schema (tables, triggers, RLS)
│   └── seed.sql               # Initial seed data
├── docs/
│   ├── erd.md                 # Entity Relationship Diagram & table schema
│   └── architecture.md        # Architecture overview
├── Dockerfile                 # Production Next.js server container
├── docker-compose.yml         # 1-command Docker Compose orchestration
├── .github/workflows/ci.yml   # GitHub Actions CI pipeline
├── .env.example               # Root environment variable template
├── HowToSetup.md              # Step-by-step setup guide (VPS + Docker)
├── LICENSE-NOTE.md            # Commercial licensing terms for buyers
├── CLAUDE.md                  # AI assistant coding guide
├── AGENTS.md                  # AI agent & contributor guide
├── CHANGELOG.md               # Version history (starts at 1.0.0)
├── LICENSE                    # MIT License
└── README.md                  # This file
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
