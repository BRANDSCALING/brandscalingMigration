import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://odzogorumgbjaovpsamx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kem9nb3J1bWdiamFvdnBzYW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTg5OTQsImV4cCI6MjA2NjI3NDk5NH0.yhIZ8d5C2f82s49EF59Vz0Uzodm-CYIBaNWfgdJsS6A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);