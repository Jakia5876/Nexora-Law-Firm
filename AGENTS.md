# Nexora Law Firm — Agent & Contributor Guide

This document provides guidance for AI coding agents (Claude, Gemini, GPT-4, Copilot, etc.) and human contributors working on the Nexora Law Firm project.

---

## 📁 Project Structure

```
.
├── index.html              # Main landing page & client portal login
├── cases.html              # Case management dashboard (authenticated)
├── accelerator.html        # Corporate & acquisition practice page
├── odegard.html            # Trial & personal injury practice page
├── service-terms.html      # Hosting & support terms of service
├── license.html            # Commercial licensing terms
├── seller-agreement.html   # Marketplace & vendor agreement
├── privacy.html            # Data protection & privacy policy
├── supabase-setup.sql      # Full PostgreSQL schema + seed data
├── database/
│   ├── schema.sql          # Database schema (tables, indexes, triggers)
│   └── seed.sql            # Initial seed data for development
├── .env.example            # Environment variable template
├── CHANGELOG.md            # Version history and release notes
├── AGENTS.md               # This file — agent & contributor guide
├── README.md               # Project overview
└── vercel.json             # Vercel deployment config
```

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS, Tailwind CSS (CDN)
- **Icons**: Lucide Icons (CDN)
- **Fonts**: Google Fonts — Playfair Display, Inter
- **Backend**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Deployment**: Vercel (static hosting)

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` — Your Supabase project URL
- `SUPABASE_ANON_KEY` — Your Supabase anon/public key

These are embedded directly in `index.html` and `cases.html` as inline JS constants (since this is a static site with no build step). Update them in the `<script>` sections of those files.

---

## 🗄️ Database Setup

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Open the **SQL Editor**
3. Run `database/schema.sql` first to create all tables, indexes, triggers, and RLS policies
4. Then run `database/seed.sql` to insert default admin, courts, case types, and assistant data

Or run the combined `supabase-setup.sql` file which includes both schema and seed in one step.

---

## 🔐 Security & RLS

- Row Level Security (RLS) is enabled on all tables
- Current policies use `USING (true)` for development — tighten these for production
- Passwords in `seed.sql` are placeholder values — replace before any live deployment
- Never commit real credentials to version control

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```
Or connect the GitHub repository to Vercel for automatic deployments.

### Manual / GitHub Pages
Upload all `.html` files and assets directly. No build step required.

---

## 🧪 Testing & Development

Since this is a zero-build static site:
1. Open `index.html` directly in a browser, or
2. Use a local server: `npx serve .` or `python -m http.server 8080`
3. Update Supabase credentials in the HTML files to point to your own project

---

## 📋 Contribution Guidelines

- **HTML**: Follow existing indentation (2-space) and class naming conventions
- **SQL**: Add `IF NOT EXISTS` guards for all DDL statements
- **Commits**: Use conventional commits format: `feat:`, `fix:`, `docs:`, `chore:`
- **Branching**: Use `feature/<name>` or `fix/<name>` branches
- **Security**: Never hardcode real credentials; use placeholder values in examples

---

## 🤖 For AI Agents

When modifying this project:
1. **Read `README.md`** for project context and feature overview
2. **Check `CHANGELOG.md`** before making changes to understand version history
3. **Run schema.sql** before seed.sql — order matters due to foreign key dependencies
4. **Preserve RLS policies** — do not remove security policies without explicit instruction
5. **No build step** — this is a static HTML project, avoid adding build tooling unless requested
