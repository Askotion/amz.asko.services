import { createClient } from '@supabase/supabase-js';

// These should be available through environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

console.log('Supabase config:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length || 0,
});

// Create a single supabase client for interacting with the database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  },
  global: {
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`
    }
  }
}); 