# How to Set Up Nexora Law Firm

This guide provides complete, step-by-step instructions for deploying and running **Nexora Law Firm** across multiple targets (VPS and Docker), setting up the Supabase / PostgreSQL database, completing your first administrator login, and customizing the firm branding.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Database Setup (PostgreSQL / Supabase)](#2-database-setup-postgresql--supabase)
3. [Environment Configuration (.env)](#3-environment-configuration-env)
4. [Deployment Target 1: Docker (Recommended)](#4-deployment-target-1-docker-recommended)
5. [Deployment Target 2: VPS (Ubuntu Linux + Nginx)](#5-deployment-target-2-vps-ubuntu-linux--nginx)
6. [Alternative Target: Local Development & Vercel](#6-alternative-target-local-development--vercel)
7. [First Administrator Login](#7-first-administrator-login)
8. [Branding & Customization Guide](#8-branding--customization-guide)
9. [Supabase Storage for Private Document Vault](#9-supabase-storage-for-private-document-vault)
10. [Troubleshooting & FAQ](#10-troubleshooting--faq)

---

## 1. Setup Sequence & Quickstart (Required Order)

Follow this exact ordered sequence to configure and deploy Nexora Law Firm:

- **Prerequisites**: Node.js >= 20.9.0
- **Supabase setup**: Create Supabase project
- **Database Migration**: Run database/schema.sql first, then run database/seed.sql
- **Storage**: Create public storage bucket
- **Environment setup**: Copy .env.example to .env.local and set keys
- **Install & Build**: Run npm ci and npm run build

---

## 2. Prerequisites & Required Versions

Before starting, ensure your host environment meets the following specifications:

- **Node.js**: `>= 20.9.0` (verified with `node -v`)
- **Package Manager**: `npm >= 10.x` (verified with `npm -v`)
- **Database**: PostgreSQL 14+ or a [Supabase](https://supabase.com) project instance
- **Docker** (Optional, for containerized hosting): Docker Engine 24+ and Docker Compose v2+

---

## 2. Ordered Setup Workflow

Follow this strict step-by-step sequence to deploy Nexora Law Firm:

### Step 1: Initialize Database Schema & Seed Data
1. Sign in to your [Supabase Dashboard](https://app.supabase.com) and create a **New Project**.
2. Navigate to the **SQL Editor** on the left menu.
3. Open `database/schema.sql`, paste the full text into the query editor, and click **Run**. This establishes all tables (`cases`, `contacts`, `attorneys`, `practice_areas`, `users`, etc.), foreign keys, compound indexes, and Row Level Security (RLS) policies.
4. Open `database/seed.sql`, paste into a new query, and click **Run** to load default firm data.
   > **Note on Execution Order**: Always execute `database/schema.sql` first before running `database/seed.sql`.

### Step 2: Configure Environment Variables
Copy the template before running any build or server command:
```bash
cd "Next.js Project"
cp .env.example .env.local
```

#### Build-Time vs. Runtime Variables Distinction
- **Build-Time Variables (Public)**: Inlined into the client bundle during `npm run build`:
  - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anonymous API key
  - `NEXT_PUBLIC_SITE_URL`: Base application URL
- **Runtime-Only Secrets (Server-Side)**: Never inlined or exposed to client builds; read strictly at server runtime:
  - `SESSION_SECRET`: 32+ character cryptographic key (generate with `openssl rand -base64 32`)
  - `SUPABASE_SERVICE_ROLE_KEY`: Privileged Supabase key for administrative queries
  - `ADMIN_EMAIL`: Administrative counsel email (defaults to `admin@nexoralaw.com`)
  - `ADMIN_DEFAULT_PASSWORD` (or `ADMIN_PASSWORD_HASH`): Secure administrator password configured per deployment

### Step 3: Install Dependencies
Run a reproducible, lockfile-verified installation:
```bash
cd "Next.js Project"
npm ci
```

### Step 4: Build and Launch Production Server
```bash
npm run build
npm start
# Next.js server starts at http://localhost:3000
```

---

## 3. Administrator Portal & Access

Authorized counsel can access the administrative case docket and lead vault:
- **Admin Login URL**: `/admin/login`
- **Authentication**: Verified server-side against `ADMIN_EMAIL` and `ADMIN_DEFAULT_PASSWORD` (or `ADMIN_PASSWORD_HASH`) set in your deployment environment variables. Zero credentials are hardcoded.
- **Features**: Real-time litigation docket, client consultation intake review, hearing scheduling, and secure vault document uploads.

---

## 4. Deployment Target 1: Docker (Recommended)

Docker provides an isolated, zero-dependency deployment that runs anywhere in seconds.

### Step 1: Clone or Extract the Archive

```bash
git clone https://github.com/Jakia5876/Nexora-Law-Firm.git
cd Nexora-Law-Firm
```

### Step 2: Configure Environment Variables

```bash
cp .env.example .env
# Edit .env with your favorite editor (nano, vim)
nano .env
```

### Step 3: Build and Run with Docker Compose

Run the following command to build the production Next.js image and launch the container in the background:

```bash
docker compose up -d --build
```

### Step 4: Verify Container Health & Status

```bash
# Check running containers
docker compose ps

# View container logs
docker compose logs -f

# Test the health endpoint
curl -I http://localhost:3000
```

Expected response:
```
HTTP/1.1 200 OK
```

### Step 5: Access the Application

Open your browser and navigate to:
- **Next.js Application & Consultation**: `http://localhost:3000`
- **Role-Gated Admin Portal**: `http://localhost:3000/admin`
- **Case Management Portal**: `http://localhost:3000/cases`

To stop the container:
```bash
docker compose down
```

---

## 5. Deployment Target 2: VPS (Ubuntu Linux + Nginx)

Follow these steps to deploy Nexora on an Ubuntu 20.04/22.04/24.04 LTS VPS with Nginx, custom domain name, and free Let's Encrypt SSL.

### Step 1: Connect to VPS and Install System Packages

```bash
# Update package list and install Nginx, Git, and Certbot
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git ufw certbot python3-certbot-nginx
```

### Step 2: Configure the Firewall

```bash
sudo ufw allow 'OpenSSH'
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Step 3: Deploy Application Files

```bash
# Create web root directory
sudo mkdir -p /var/www/nexora-law-firm

# Clone the repository (or copy extracted files)
sudo git clone https://github.com/Jakia5876/Nexora-Law-Firm.git /var/www/nexora-law-firm

# Set correct file ownership and permissions
sudo chown -R www-data:www-data /var/www/nexora-law-firm
sudo chmod -R 755 /var/www/nexora-law-firm
```

### Step 4: Configure Nginx Virtual Host

Create a new Nginx server configuration:

```bash
sudo nano /etc/nginx/sites-available/nexora.conf
```

Paste the following block (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/nexora-law-firm;
    index index.html;

    # Gzip compression for fast loading
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # HTML files — no-cache to guarantee latest version
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Static assets caching
    location ~* \.(css|js|jpg|jpeg|png|webp|svg|ico|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Fallback to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site configuration and restart Nginx:

```bash
sudo ln -sf /etc/nginx/sites-available/nexora.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Secure with Let's Encrypt SSL (HTTPS)

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will automatically configure SSL certificates and automatic renewal.

---

## 6. Alternative Target: Local Development & Vercel

### Option A: Local Development Server

```bash
# Install development dependencies
npm install

# Start local server on http://localhost:8080
npm run dev
```

### Option B: Deploy to Vercel

1. Push your repository to GitHub / GitLab.
2. Log in to [Vercel](https://vercel.com) and click **Add New → Project**.
3. Import your repository. The included `vercel.json` will automatically configure routing.
4. Click **Deploy**.

---

## 7. First Administrator Login

Once the application is running and the database seed has been applied:

1. Open `cases.html` (or click **Client Portal** on `index.html`).
2. If prompted, click **Admin Login** or use the authentication modal (or visit `/admin/login` on Next.js).
3. Enter the administrator credentials:
   - **Email**: `admin@nexoralaw.com`
   - **Password**: Configured via `ADMIN_DEFAULT_PASSWORD` in your `.env.local` / environment settings
4. Upon successful login, you have full administrative access to:
   - View, create, and edit litigation cases
   - Upload client case files to the Document Vault
   - Manage hearing dates, court assignments, and case stages
   - Add and assign lawyers and paralegals
   - Review incoming client contact consultations

### Changing the Default Admin Password

To update the admin password to your own secure password:

```sql
-- Run this in the Supabase SQL Editor:
UPDATE public.users 
SET password = 'YOUR_NEW_SECURE_PASSWORD', 
    updated_at = timezone('utc'::text, now())
WHERE email = 'admin@nexoralaw.com';
```

---

## 8. Branding & Customization Guide

Nexora Law Firm is built for straightforward white-labeling and rebranding. Follow these steps to customize the firm's identity:

### 1. Firm Name & Meta Tags
Search and replace `Nexora Law Firm` across the HTML files:
- `index.html` (Lines 10–30): Update `<title>`, `<meta name="description">`, and OpenGraph tags.
- `cases.html` (Lines 15–25): Update `<title>` and portal heading.
- Replace `Nexora` with your firm's name (e.g., `Sterling & Partners Legal Group`).

### 2. Firm Logo & Favicon
- Replace the logo image link in `index.html` (search for `id="brand-logo"` or `<img ... alt="Nexora">`).
- Replace `/favicon.ico` or update the `<link rel="icon">` in the `<head>` of all HTML pages.
- Add your SVG or high-resolution PNG brand mark (recommended size: `320x80px` for header).

### 3. Color Palette & Styling
The design system utilizes Tailwind CSS theme variables configured directly in the HTML `<head>`:
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        gold: '#c5a059',          // Accent color for buttons, badges, highlights
        'gold-light': '#dfc289',  // Hover states
        burgundy: '#6b1d2f',      // Primary branding & call-to-action
        'burgundy-light': '#8e273e' // Button hover state
      }
    }
  }
}
```
Modify `#c5a059` and `#6b1d2f` to match your firm's brand colors (e.g., navy blue `#0f2b48` and silver `#9aa0a6`).

### 4. Contact Details & Office Locations
Update contact information in `index.html` footer and contact section:
- **Phone**: Search `+1 (800) 555-0199` and update with your telephone number.
- **Email**: Search `contact@nexoralaw.com` and update with your firm's intake address.
- **Address**: Search `742 Evergreen Terrace, Suite 500, New York, NY 10001` and update with your physical office location.
- **Office Hours**: Modify consultation hours in the contact card.

### 5. Practice Areas & Lawyer Profiles
- In `index.html`, navigate to the **Practice Areas** section to add or modify specialties (Corporate Law, Criminal Defense, Intellectual Property, Family Law, etc.).
- In `cases.html`, practice areas can also be dynamically managed via the `case_type` database table.
- Attorney portraits and bios can be updated in the **Attorneys / Team** section of `index.html`.

---

## 9. Supabase Storage for Private Document Vault

The Case Management Portal includes an isolated client Document Vault for uploading pleadings, evidence, contracts, and court orders.

1. Open your **Supabase Dashboard** and navigate to **Storage**.
2. Click **New Bucket**.
3. Name the bucket: `case-documents`
4. Set the bucket privacy:
   - **Private** (recommended for production — files are accessed via signed short-lived URLs)
5. Under **Policies**, enable authenticated upload and read operations for legal staff.

---

## 10. Troubleshooting & FAQ

| Problem | Cause | Solution |
|---|---|---|
| Database tables missing | `schema.sql` was not run | Run `database/schema.sql` in the Supabase SQL Editor. |
| Foreign key constraint error during seed | `seed.sql` run before `schema.sql` | Always execute `schema.sql` completely before running `seed.sql`. |
| Login rejected with "Invalid credentials" | Seed password mismatch | Verify user exists in `public.users` table; verify password matches. |
| Docker port conflict | Another service using port 8080 | Change `PORT=8090` in your `.env` file and re-run `docker compose up -d`. |
| VPS Nginx returns 403 Forbidden | Incorrect directory permissions | Run `sudo chown -R www-data:www-data /var/www/nexora-law-firm && sudo chmod -R 755 /var/www/nexora-law-firm`. |
| Documents cannot be uploaded | `case-documents` bucket not created | Create a bucket named `case-documents` under Supabase Storage. |

---

## Need Support?

- **Issues & Contributions**: [GitHub Repository](https://github.com/Jakia5876/Nexora-Law-Firm)
- **Database Documentation**: Refer to comments inside `database/schema.sql`
- **Contributor Guidelines**: See `AGENTS.md` and `CONTRIBUTING.md`
