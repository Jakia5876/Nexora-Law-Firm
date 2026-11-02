-- ==============================================================================
-- NEXORA LAW FIRM — SEED DATA
-- Run this file AFTER database/schema.sql
-- Inserts default admin user, courts, case types, and assistant for development
-- ==============================================================================

-- ==============================================================================
-- 1. DEFAULT ADMIN USER
-- Change 'YOUR_SECURE_ADMIN_PASSWORD' to a real secure password before deploying
-- ==============================================================================
INSERT INTO public.users (user_id, name, address, phone, password, email, role, is_active)
VALUES (
    1,
    'Firm Administrator',
    'Nexora Law Firm Chambers, Suite 500',
    '+1-800-555-0199',
    'YOUR_SECURE_ADMIN_PASSWORD',
    'admin@nexoralaw.com',
    'admin',
    true
) ON CONFLICT (user_id) DO NOTHING;

-- ==============================================================================
-- 2. DEFAULT COURTS
-- ==============================================================================
INSERT INTO public.court (court_id, court_name, jurisdiction, user_id)
VALUES
    (1, 'Supreme Court (Appellate Division)',  'Federal', 1),
    (2, 'Supreme Court (High Court Division)', 'Federal', 1),
    (3, 'District & Sessions Judge Court',     'District', 1),
    (4, 'Commercial & Arbitration Tribunal',   'State', 1),
    (5, 'Metropolitan Magistrate Court',       'City', 1),
    (6, 'Chancery & Equity Court',             'State', 1),
    (7, 'Labour & Employment Relations Court', 'State', 1),
    (8, 'Bankruptcy & Insolvency Court',       'Federal', 1)
ON CONFLICT (court_id) DO NOTHING;

-- ==============================================================================
-- 3. DEFAULT CASE TYPES
-- ==============================================================================
INSERT INTO public.case_type (case_type_id, case_type, description, user_id)
VALUES
    (1,  'Corporate & Commercial Litigation', 'Mergers, acquisitions, contract breaches, and shareholder disputes', 1),
    (2,  'Criminal Defense & White Collar',   'White collar financial crimes, regulatory investigations, and defense', 1),
    (3,  'Family & High-Net-Worth Matrimonial', 'Custody, marital agreements, estate division', 1),
    (4,  'Real Estate & Land Acquisition',   'Commercial real estate leasing, land disputes, zoning permits', 1),
    (5,  'Constitutional & Appellate',        'Constitutional writ petitions, judicial review, appellate advocacy', 1),
    (6,  'Labour & Executive Employment',     'Executive compensation, non-competes, workplace arbitration', 1),
    (7,  'Intellectual Property & Patents',   'Patent infringement, trademark protection, trade secrets', 1),
    (8,  'Banking & Financial Securities',    'Banking debt recovery, SEC enforcement, sovereign lending', 1)
ON CONFLICT (case_type_id) DO NOTHING;

-- ==============================================================================
-- 4. DEFAULT LEGAL ASSISTANTS
-- ==============================================================================
INSERT INTO public.assistant (assistant_id, assistant_name, email, phone, user_id)
VALUES
    (1, 'Marcus Vance, Esq. (Senior Associate)', 'm.vance@nexoralaw.com', '+1-800-555-0141', 1),
    (2, 'Elena Rostova (Senior Paralegal)',       'e.rostova@nexoralaw.com', '+1-800-555-0142', 1),
    (3, 'David Chen (Litigation Clerk)',         'd.chen@nexoralaw.com', '+1-800-555-0143', 1)
ON CONFLICT (assistant_id) DO NOTHING;

-- ==============================================================================
-- 5. SAMPLE SUBSCRIPTION PLAN (Admin)
-- ==============================================================================
INSERT INTO public.subscriptions (user_id, subscription_plan, start_date, end_date, status, amount)
VALUES (
    1,
    'Enterprise Retainer',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 year',
    'active',
    0.00
) ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 6. RESET SEQUENCE COUNTERS
-- Prevents duplicate key conflicts on subsequent inserts after seeding
-- ==============================================================================
SELECT setval(pg_get_serial_sequence('public.users',        'user_id'),        COALESCE(MAX(user_id),        1)) FROM public.users;
SELECT setval(pg_get_serial_sequence('public.court',        'court_id'),       COALESCE(MAX(court_id),       1)) FROM public.court;
SELECT setval(pg_get_serial_sequence('public.case_type',    'case_type_id'),   COALESCE(MAX(case_type_id),   1)) FROM public.case_type;
SELECT setval(pg_get_serial_sequence('public.assistant',    'assistant_id'),   COALESCE(MAX(assistant_id),   1)) FROM public.assistant;
SELECT setval(pg_get_serial_sequence('public.subscriptions','subscription_id'),COALESCE(MAX(subscription_id),1)) FROM public.subscriptions;
