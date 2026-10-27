# Setup & Installation Guide - Nexora Law Firm

## Prerequisites
- Node.js >= 20.9.0
- Supabase account & project

## Step 1: Database Setup
1. Create a Supabase project at https://database.new
2. Open your Supabase project dashboard -> SQL Editor.
3. Run `database/schema.sql` to initialize tables, foreign key indexes, and Row-Level Security (RLS) policies.
4. Run `database/seed.sql` to populate initial demo data and firm practice areas.
5. Go to Storage in Supabase Dashboard and create a new public/authenticated bucket named `case-documents` for client vault attachments.

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
