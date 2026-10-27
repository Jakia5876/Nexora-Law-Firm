# Setup & Installation Guide - Nexora Law Firm

## Prerequisites
- Node.js >= 20.9.0
- Supabase account & project

## Step 1: Database Setup
1. Open your Supabase project dashboard.
2. Go to the SQL Editor.
3. Run the script `database/schema.sql` to initialize tables, indexes, and RLS policies.
4. Run `database/seed.sql` to populate initial demo data.

## Step 2: Environment Configuration
1. Copy the example file:
   `cp .env.example .env.local`
2. Populate the required Supabase credentials and generate a session secret:
   `openssl rand -base64 32`

## Step 3: Install & Build
1. Install exact dependencies:
   `npm ci`
2. Run development server:
   `npm run dev`
3. Or build for production / Docker standalone:
   `npm run build`
