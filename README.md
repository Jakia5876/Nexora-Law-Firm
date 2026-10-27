# Nexora Law Firm

> A luxury, fully-responsive legal firm web application and multi-practice suite built for modern legal advocacy and consultation.

[![CI](https://github.com/Jakia5876/Nexora-Law-Firm/actions/workflows/ci.yml/badge.svg)](https://github.com/Jakia5876/Nexora-Law-Firm/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](CHANGELOG.md)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://nexoralaw.vercel.app/)

**Live Demo**: [nexoralaw.vercel.app](https://nexoralaw.vercel.app/)

---

## ✨ Features

- **Full-Service Firm Landing Page** (`index.html`):
  - High-conversion hero with animated background
  - Practice area showcases (Corporate, Criminal, Family, Property)
  - Attorney roster with profile cards
  - AI rulebook briefings section
  - Client testimonials
  - Consultation inquiry form → Supabase `contacts` table

- **Case Management Dashboard** (`cases.html`):
  - Full CRUD: cases, courts, case types, assistants
  - Hearing date tracking and order diary
  - Document vault with Supabase Storage
  - Subscription enforcement
  - Print-ready case reports

- **Specialized Practice Templates**:
  - `accelerator.html` — Corporate growth & acquisition practice
  - `odegard.html` — Trial & personal injury practice

- **Legal Document Pages**:
  - `service-terms.html`, `license.html`, `seller-agreement.html`, `privacy.html`

- **Responsive Design**: Optimized for 375px → 1440px+ viewports

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 (semantic) |
| Styling | Tailwind CSS 3.x (CDN) + Vanilla CSS |
| Icons | Lucide Icons (CDN) |
| Fonts | Google Fonts — Playfair Display, Inter |
| Backend | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

**Design System:**
- 🔴 Burgundy `#800020` — primary brand
- ⚫ Obsidian Dark `#0D0D0D` — dark mode base
- 🥇 Metallic Gold `#C9A84C` — accent

---

## ⚡ Quick Start

### Option A: Docker (Fastest)

```bash
cp .env.example .env
docker compose up -d
# Open http://localhost:8080 in your browser
```

### Option B: Local Node.js

```bash
# 1. Clone the repo
git clone https://github.com/Jakia5876/Nexora-Law-Firm.git
cd Nexora-Law-Firm

# 2. Copy environment template
cp .env.example .env

# 3. Add your Supabase credentials to .env

# 4. Run database setup in Supabase SQL Editor:
#    → database/schema.sql first, then database/seed.sql

# 5. Start a local server
npm start
```

See [HowToSetup.md](HowToSetup.md) for full VPS (Ubuntu + Nginx) and Docker installation guides.

---

## 📁 Project Structure

```
.
├── index.html              # Main landing page + client login
├── cases.html              # Case management dashboard
├── accelerator.html        # Corporate practice page
├── odegard.html            # Trial & injury practice page
├── service-terms.html      # Terms of service
├── license.html            # Commercial license
├── seller-agreement.html   # Vendor agreement
├── privacy.html            # Privacy policy
├── supabase-setup.sql      # Combined schema + seed (one-step setup)
├── database/
│   ├── schema.sql          # Database schema (tables, triggers, RLS)
│   └── seed.sql            # Initial seed data
├── Dockerfile              # Production multi-stage Docker container
├── docker-compose.yml      # 1-command Docker Compose orchestration
├── docker/
│   └── nginx.conf          # Nginx reverse proxy & cache configuration
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI pipeline
├── .env.example            # Environment variable template
├── package.json            # Project metadata & scripts
├── vercel.json             # Vercel deployment configuration
├── HowToSetup.md           # Step-by-step setup guide (VPS + Docker)
├── AGENTS.md               # AI agent & contributor guide
├── CONTRIBUTING.md         # How to contribute
├── SECURITY.md             # Vulnerability reporting policy
├── CHANGELOG.md            # Version history
├── LICENSE                 # MIT License
└── README.md               # This file
```

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Multi-role accounts (admin, lawyer, client, assistant) |
| `court` | Court registry |
| `subscriptions` | Subscription plans & payment records |
| `case_type` | Case categorization |
| `assistant` | Legal assistant profiles |
| `cases` | Core case records |
| `case_detail` | Hearing history, orders, diary |
| `case_documents` | Document vault (Supabase Storage) |
| `contacts` | Website inquiry submissions |

---

## 🚀 Deployment

### One-click Vercel Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jakia5876/Nexora-Law-Firm)

### Manual Vercel
```bash
npm install -g vercel
vercel deploy --prod
```

### GitHub Pages / Netlify
Upload all `.html` files and assets. No build step required.

---

## 🔐 Security

- Row Level Security (RLS) enabled on all Supabase tables
- See [SECURITY.md](SECURITY.md) for vulnerability reporting
- See [CONTRIBUTING.md](CONTRIBUTING.md) for secure development practices

---

## 📋 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- How to set up your development environment
- Commit message conventions
- Code style guidelines
- How to submit a pull request

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 📌 Versions

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

Current version: **1.0.1**
