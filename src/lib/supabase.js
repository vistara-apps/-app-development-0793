import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://chpfmfkiydbqubclwahq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNocGZtZmtpeWRicXViY2x3YWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2NjgxMjksImV4cCI6MjA0MzI0NDEyOX0.7uzGcT7tUq-e9QboW_1IB01aYbCsLSjLR85u2M7vFgI';
console.log(supabaseUrl, supabaseAnonKey, import.meta.env)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database table names
export const TABLES = {
  USERS: 'users',
  NICHES: 'niches',
  KEYWORDS: 'keywords',
  CONTENT: 'content',
  NICHE_SITES: 'niche_sites'
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error)
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    details: error
  }
}

// Helper function for successful responses
export const handleSupabaseSuccess = (data) => {
  return {
    success: true,
    data,
    error: null
  }
}

