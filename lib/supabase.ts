import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || CONFIG.supabase.url;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || CONFIG.supabase.anonKey;

/**
 * Public client for client-side interactions and public consultation intake.
 * Strictly adheres to Row Level Security (RLS) policies.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getClientSupabase() {
  return supabase;
}

/**
 * Privileged administrative client using Service Role Key.
 * Must only be invoked after verified administrator authentication.
 */
export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || CONFIG.supabase.serviceRoleKey;
  if (!serviceKey) {
    throw new Error('CRITICAL SECURITY ERROR: SUPABASE_SERVICE_ROLE_KEY must be configured for administrative database operations.');
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
