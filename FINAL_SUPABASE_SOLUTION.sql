-- FINAL SUPABASE TABLE CREATION
-- Copy and paste this EXACT SQL into your Supabase SQL Editor
-- Run it section by section if needed

-- ============================================
-- SECTION 1: Create test_connection table
-- ============================================
CREATE TABLE IF NOT EXISTS test_connection (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 2: Insert test data
-- ============================================
INSERT INTO test_connection (name, email) VALUES 
('Manual Supabase Creation', 'manual@supabase.com'),
('Database Integration Success', 'success@brandscaling.com'),
('Module 1 Database Ready', 'module1@ready.com');

-- ============================================
-- SECTION 3: Create workbook_sessions table
-- ============================================
CREATE TABLE IF NOT EXISTS workbook_sessions (
  id SERIAL PRIMARY KEY,
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

-- ============================================
-- SECTION 4: Insert workbook test data
-- ============================================
INSERT INTO workbook_sessions (user_id, user_email, dna_mode, business_filter, edna_reflection) VALUES 
('manual-supabase-user', 'manual@supabase.com', 'architect', 
 '{"problem": true, "person": true, "profit": false, "pull": true, "aiResponse": "Manual Supabase creation successful!", "customPrompt": "Testing manual Supabase integration"}',
 '{"clarityReflection": "Manual database creation confirmed working", "customPrompt": "Manual creation test"}'
);

-- ============================================
-- SECTION 5: Verification queries
-- ============================================
SELECT 'test_connection table' as table_name, COUNT(*) as record_count FROM test_connection;
SELECT 'workbook_sessions table' as table_name, COUNT(*) as record_count FROM workbook_sessions;

-- Show sample data
SELECT 'Sample test_connection:' as info, name, email FROM test_connection LIMIT 2;
SELECT 'Sample workbook_sessions:' as info, user_id, dna_mode FROM workbook_sessions LIMIT 2;