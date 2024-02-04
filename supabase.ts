import { createClient } from '@supabase/supabase-js';

let supabaseUrl: string = "";
let supabaseAnonKey: string = "";


if (process.env.NODE_ENV === "development" && process.env.VITE_DEV_SUPABASE_URL && process.env.VITE_DEV_SUPABASE_ANON_KEY) {
    supabaseUrl = process.env.VITE_DEV_SUPABASE_URL;
    supabaseAnonKey = process.env.VITE_DEV_SUPABASE_ANON_KEY;
} else {
    supabaseUrl = "https://tqgufceactcswwkbjfjk.supabase.co";
    supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZ3VmY2VhY3Rjc3d3a2JqZmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA2OTMyOTksImV4cCI6MTk4NjI2OTI5OX0.MRYORIJPYAwuRfISOKKsKqCnfABJqLaXT1cZQZ6ZAE4";
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
