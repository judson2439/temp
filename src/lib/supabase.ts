import { createClient } from '@supabase/supabase-js';

// Initialize database client
// Use the actual Supabase URL for auth to work properly
export const supabaseUrl = 'https://vjsodupjamkgsuketrru.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqc29kdXBqYW1rZ3N1a2V0cnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTY0OTUsImV4cCI6MjA3OTQ5MjQ5NX0.mO2w31t84AeimSR74I2jPR3wLVhmoaD5-lflVcsG8X0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
