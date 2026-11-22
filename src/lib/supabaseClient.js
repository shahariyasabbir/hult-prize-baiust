import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabaseConfigError = isSupabaseConfigured
  ? null
  : 'Missing Supabase settings. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment (for Vercel: Project Settings > Environment Variables) and redeploy so the values are included in the build.'

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null
