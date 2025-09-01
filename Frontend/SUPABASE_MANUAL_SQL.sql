-- MANUAL SUPABASE DATABASE SETUP
-- Copy this SQL into your Supabase SQL Editor and run it

-- ============================================
-- STEP 1: Create test_connection table
-- ============================================
CREATE TABLE IF NOT EXISTS test_connection (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 2: Insert connection test data
-- ============================================
INSERT INTO test_connection (name, email) VALUES 
('Manual Supabase Setup', 'manual@supabase.com'),
('Connection Verification', 'verification@brandscaling.com'),
('Database Integration Ready', 'ready@module1.com');

-- ============================================
-- STEP 3: Create workbook_sessions table
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
-- STEP 4: Insert workbook test data
-- ============================================
INSERT INTO workbook_sessions (user_id, user_email, dna_mode, business_filter, edna_reflection, clarity_prompts, current_section, completed_sections) VALUES 
(
  'manual-architect-user', 
  'architect@manual.com', 
  'architect',
  '{"problem": true, "person": true, "profit": false, "pull": true, "aiResponse": "Manual Supabase setup successful! Systematic business validation complete.", "customPrompt": "Manual setup architect validation"}',
  '{"clarityReflection": "Analytical entrepreneurial approach confirmed through manual Supabase integration", "customPrompt": "Manual setup architect reflection"}',
  '{"prompt1": "What drives your systematic approach?", "response1": "Data-driven analysis and structured planning", "prompt2": "How do you validate opportunities?", "response2": "Through comprehensive research and feasibility studies"}',
  2,
  '["business_filter", "edna_reflection"]'
),
(
  'manual-alchemist-user',
  'alchemist@manual.com',
  'alchemist',
  '{"problem": true, "person": false, "profit": true, "pull": true, "aiResponse": "Creative opportunity identified through manual Supabase setup! Innovation validated.", "customPrompt": "Manual setup alchemist validation"}',
  '{"clarityReflection": "Creative entrepreneurial style demonstrated through manual Supabase integration", "customPrompt": "Manual setup alchemist reflection"}',
  '{"prompt1": "What creative insights guide you?", "response1": "Intuitive market understanding and innovative solutions", "prompt2": "How do you approach challenges?", "response2": "Through creative problem-solving and breakthrough thinking"}',
  2,
  '["business_filter", "edna_reflection"]'
);

-- ============================================
-- STEP 5: Verification queries
-- ============================================
SELECT 'test_connection' as table_name, COUNT(*) as records FROM test_connection;
SELECT 'workbook_sessions' as table_name, COUNT(*) as records FROM workbook_sessions;

-- Show sample data
SELECT name, email FROM test_connection LIMIT 2;
SELECT user_id, dna_mode, current_section FROM workbook_sessions;

-- Test JSONB functionality
SELECT 
  user_id,
  business_filter->>'aiResponse' as ai_response,
  jsonb_array_length(completed_sections) as completed_count
FROM workbook_sessions;