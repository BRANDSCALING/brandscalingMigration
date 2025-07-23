-- COPY AND PASTE THIS SQL INTO YOUR SUPABASE SQL EDITOR
-- This will create the tables and test data that you can see in your Table Editor

-- Create test_connection table
CREATE TABLE IF NOT EXISTS public.test_connection (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert test data into test_connection
INSERT INTO public.test_connection (name, email) VALUES 
('Supabase Manual Creation', 'manual@brandscaling.com'),
('Database Connection Test', 'test@brandscaling.com'),
('Replit Integration Success', 'success@brandscaling.com')
ON CONFLICT DO NOTHING;

-- Create workbook_sessions table for Module 1
CREATE TABLE IF NOT EXISTS public.workbook_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT,
  dna_mode TEXT DEFAULT 'architect',
  business_filter JSONB DEFAULT '{}',
  edna_reflection JSONB DEFAULT '{}',
  clarity_prompts JSONB DEFAULT '{}',
  offer_builder JSONB DEFAULT '{}',
  viability_scores JSONB DEFAULT '{}',
  branding_results JSONB DEFAULT '{}',
  name_logo_builder JSONB DEFAULT '{}',
  completed_sections JSONB DEFAULT '[]',
  current_section INTEGER DEFAULT 0,
  total_sections INTEGER DEFAULT 6,
  module_name TEXT DEFAULT 'Module 1: Build the Foundation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample workbook session data
INSERT INTO public.workbook_sessions (user_id, user_email, dna_mode, business_filter, edna_reflection) VALUES 
('supabase-test-user', 'test@supabase.com', 'architect', 
 '{"problem": true, "person": true, "profit": false, "pull": true, "aiResponse": "Business validation successful!", "customPrompt": "Test business filter prompt"}',
 '{"clarityReflection": "Strong entrepreneurial self-awareness demonstrated", "customPrompt": "Test reflection prompt"}'
),
('manual-creation-user', 'manual@brandscaling.com', 'alchemist',
 '{"problem": true, "person": false, "profit": true, "pull": true, "aiResponse": "Creative business approach identified!", "customPrompt": "Alchemist business validation"}',
 '{"clarityReflection": "Intuitive entrepreneurial style confirmed", "customPrompt": "Alchemist reflection"}'
)
ON CONFLICT DO NOTHING;

-- Verify the data was created
SELECT 'test_connection table:' as table_info, COUNT(*) as record_count FROM public.test_connection
UNION ALL
SELECT 'workbook_sessions table:', COUNT(*) FROM public.workbook_sessions;

-- Show sample data
SELECT 'Sample test_connection data:' as info, name, email, created_at FROM public.test_connection LIMIT 2
UNION ALL
SELECT 'Sample workbook data:', user_id, user_email, dna_mode FROM public.workbook_sessions LIMIT 2;