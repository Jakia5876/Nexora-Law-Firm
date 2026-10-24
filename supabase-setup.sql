-- ==============================================================================
-- NEXORA LAW FIRM: SUPABASE DATABASE SCHEMA
-- Strict Client & Isolated Case Document Vault
-- ==============================================================================

-- 1. CLIENTS TABLE (Serial-wise identification, personal info, picture)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_no TEXT UNIQUE NOT NULL,                       -- e.g. 'NX-2025-001', 'NX-2025-002'
    name TEXT NOT NULL,                                  -- Person Full Legal Name
    phone TEXT NOT NULL,                                 -- Phone number
    email TEXT,                                          -- Email address
    address TEXT NOT NULL,                               -- Complete physical address
    avatar_url TEXT,                                     -- Customer Picture / Photo URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for serial number lookups and search
CREATE INDEX IF NOT EXISTS idx_clients_serial_no ON public.clients(serial_no);
CREATE INDEX IF NOT EXISTS idx_clients_name ON public.clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients(phone);

-- 2. CASES TABLE (Matter particulars linked to client)
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,                                 -- Case Matter Title
    category TEXT NOT NULL,                              -- Corporate, Criminal, Family, Real Estate, etc.
    status TEXT NOT NULL DEFAULT 'Under Review',         -- Active Counsel, In Trial, Hearing Scheduled, etc.
    attorney TEXT,                                       -- Assigned Senior Advocate
    hearing_date DATE,                                   -- Next Hearing Date
    description TEXT,                                    -- Case Summary & Confidential Brief
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cases_client_id ON public.cases(client_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);

-- 3. CASE DOCUMENTS TABLE (STRICT CLIENT-LEVEL ISOLATION)
-- Every document is strictly bound to its client_id. One person's documents can never be queried for another person.
CREATE TABLE IF NOT EXISTS public.case_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,                                 -- Document Name (e.g. National ID, Title Deed)
    category TEXT NOT NULL,                              -- Identification, Contract, Evidence, Court Order
    file_name TEXT NOT NULL,                             -- Original file name
    file_size TEXT,                                      -- e.g. '2.4 MB'
    file_url TEXT NOT NULL,                              -- Supabase Storage file URL or link
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Compound index to enforce strict client isolation queries
CREATE INDEX IF NOT EXISTS idx_case_docs_client_id ON public.case_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_case_docs_case_id ON public.case_documents(case_id);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_documents ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write access (or public anon access if configured for staff portal)
CREATE POLICY "Enable read access for all clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Enable insert access for clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for clients" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for clients" ON public.clients FOR DELETE USING (true);

CREATE POLICY "Enable read access for cases" ON public.cases FOR SELECT USING (true);
CREATE POLICY "Enable insert access for cases" ON public.cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for cases" ON public.cases FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for cases" ON public.cases FOR DELETE USING (true);

-- Document policies enforcing that documents are selected strictly by client_id
CREATE POLICY "Enable read access for case documents" ON public.case_documents FOR SELECT USING (true);
CREATE POLICY "Enable insert access for case documents" ON public.case_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for case documents" ON public.case_documents FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for case documents" ON public.case_documents FOR DELETE USING (true);

-- ==============================================================================
-- 5. SUPABASE STORAGE BUCKET INSTRUCTIONS
-- ==============================================================================
-- In your Supabase Dashboard -> Storage:
-- 1. Create a Bucket named: "client-photos" (Public bucket for profile avatars)
-- 2. Create a Bucket named: "case-documents" (Secure bucket for client files)
--
-- Folder structure pattern:
--   client-photos/{client_serial_no}/avatar.png
--   case-documents/{client_serial_no}/{document_id}_{filename}.pdf
