# How to Set Up Nexora Law Firm

This guide walks you through setting up the Nexora Law Firm project locally and connecting it to Supabase.

---

## Prerequisites

- A [Supabase](https://supabase.com) account (free tier works)
- A modern web browser (Chrome, Firefox, Edge)
- [Node.js](https://nodejs.org) v18+ (optional — only needed for local dev server)
- [Git](https://git-scm.com) (optional — for cloning)

---

## 1. Clone the Repository

```bash
git clone https://github.com/Jakia5876/Nexora-Law-Firm.git
cd Nexora-Law-Firm
```

Or download the ZIP from GitHub and extract it.

---

## 2. Create Your Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com) and sign in
2. Click **New Project**
3. Fill in:
   - **Name**: `nexora-law-firm` (or any name)
   - **Database Password**: Set a strong password (save it!)
   - **Region**: Choose the closest to your users
4. Click **Create new project** and wait ~2 minutes for it to provision

---

## 3. Set Up the Database

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy and paste the contents of **`database/schema.sql`** and click **Run**
4. Create another new query, paste the contents of **`database/seed.sql`**, and click **Run**

> **Order matters!** Always run `schema.sql` before `seed.sql` due to foreign key dependencies.

Alternatively, run the combined file:
- Paste the contents of **`supabase-setup.sql`** in a single query and run it.

---

## 4. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. In your Supabase dashboard, go to **Project Settings → API**
3. Copy your **Project URL** and **anon/public key**
4. Update `.env`:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. Since this is a **static HTML site** (no build step), also update the inline constants directly in:
   - `index.html` — search for `SUPABASE_URL` and `SUPABASE_ANON_KEY`
   - `cases.html` — search for `SUPABASE_URL` and `SUPABASE_ANON_KEY`

   Replace the placeholder values with your actual credentials from step 3.

---

## 5. Run Locally

### Option A — Using Node.js (recommended)

```bash
npx serve .
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Option B — Using Python

```bash
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Option C — Open directly

Simply open `index.html` directly in your browser. Note: some Supabase features may behave differently without a proper HTTP server.

---

## 6. Log In to the Case Portal

After seeding the database:

- **URL**: Click **"Client Portal"** on the homepage, or navigate to `cases.html`
- **Email**: `admin@nexoralaw.com`
- **Password**: The value you set in `database/seed.sql` (default placeholder: `YOUR_SECURE_ADMIN_PASSWORD`)

> **Important**: Change the default password in `seed.sql` before running it in any real environment.

---

## 7. Deploy to Vercel (Optional)

### Automatic (recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. Click **Deploy**

### Manual

```bash
npm install -g vercel
vercel deploy
```

---

## 8. Configure Supabase Storage (for Document Vault)

1. In your Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name it `case-documents`
4. Set it to **Private** (access is managed via signed URLs)
5. The app will automatically use this bucket for document uploads in `cases.html`

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Login fails with "Invalid credentials" | Check that `seed.sql` ran successfully and credentials match `index.html` |
| Supabase errors in console | Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct in the HTML files |
| RLS policy errors | Re-run `schema.sql` to ensure RLS policies are applied |
| Documents not uploading | Create the `case-documents` bucket in Supabase Storage |
| Blank page on Vercel | Check Vercel deployment logs; ensure `vercel.json` is in the root |

---

## Project Structure

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
│   ├── schema.sql          # Database schema only
│   └── seed.sql            # Seed data only
├── .env.example            # Environment variable template
├── HowToSetup.md           # This file
├── AGENTS.md               # AI agent guide
├── CHANGELOG.md            # Version history
├── README.md               # Project overview
└── vercel.json             # Vercel config
```

---

## Need Help?

- Open an issue on [GitHub](https://github.com/Jakia5876/Nexora-Law-Firm/issues)
- Refer to the [Supabase Docs](https://supabase.com/docs)
- See `AGENTS.md` for contributor and AI agent guidance
