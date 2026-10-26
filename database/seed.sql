-- ==============================================================================
-- NEXORA LAW FIRM — SEED DATA
-- Run this file AFTER schema.sql
-- Inserts default admin user, courts, case types, and assistant for development
-- ==============================================================================

-- ==============================================================================
-- 1. DEFAULT ADMIN USER
-- Change 'YOUR_SECURE_ADMIN_PASSWORD' to a real hashed password before deploying
-- ==============================================================================
INSERT INTO public.users (user_id, name, address, phone, password, email, role, is_active)
VALUES (
    1,
    'Firm Administrator',
    'Nexora Law Firm Chambers, Dhaka, Bangladesh',
    '+8801700000000',
    'YOUR_SECURE_ADMIN_PASSWORD',
    'admin@nexoralaw.com',
    'admin',
    true
) ON CONFLICT (user_id) DO NOTHING;

-- ==============================================================================
-- 2. DEFAULT COURTS
-- ==============================================================================
INSERT INTO public.court (court_id, court_name, user_id)
VALUES
    (1, 'Supreme Court of Bangladesh (Appellate Division)',  1),
    (2, 'Supreme Court of Bangladesh (High Court Division)', 1),
    (3, 'District & Sessions Judge Court, Dhaka',           1),
    (4, 'Metropolitan Sessions Judge Court, Dhaka',         1),
    (5, 'Metropolitan Magistrate Court, Dhaka',             1),
    (6, 'Family Court, Dhaka',                              1),
    (7, 'Labour Court, Dhaka',                              1),
    (8, 'Bankruptcy Court, Dhaka',                          1)
ON CONFLICT (court_id) DO NOTHING;

-- ==============================================================================
-- 3. DEFAULT CASE TYPES
-- ==============================================================================
INSERT INTO public.case_type (case_type_id, case_type, user_id)
VALUES
    (1,  'Corporate & Commercial Litigation',        1),
    (2,  'Criminal Defense & Bail Matter',           1),
    (3,  'Family & Custody Law',                     1),
    (4,  'Property & Real Estate Dispute',           1),
    (5,  'Constitutional & Public Interest Matters', 1),
    (6,  'Labour & Employment Dispute',              1),
    (7,  'Intellectual Property',                    1),
    (8,  'Banking & Financial Dispute',              1),
    (9,  'Environmental & Land Acquisition',         1),
    (10, 'Writ Petition',                            1)
ON CONFLICT (case_type_id) DO NOTHING;

-- ==============================================================================
-- 4. DEFAULT LEGAL ASSISTANTS
-- ==============================================================================
INSERT INTO public.assistant (assistant_id, assistant_name, user_id)
VALUES
    (1, 'Adv. K. Rahman (Senior Associate)',    1),
    (2, 'Adv. S. Hossain (Junior Associate)',   1),
    (3, 'Adv. M. Islam (Paralegal)',            1)
ON CONFLICT (assistant_id) DO NOTHING;

-- ==============================================================================
-- 5. SAMPLE SUBSCRIPTION PLAN (Admin)
-- ==============================================================================
INSERT INTO public.subscriptions (user_id, subscription_plan, start_date, end_date, status, amount)
VALUES (
    1,
    'Enterprise',
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
