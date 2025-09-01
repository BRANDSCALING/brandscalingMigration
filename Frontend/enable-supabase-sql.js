// Enable SQL execution in Supabase and create tables
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function enableSQLAndCreateTables() {
  try {
    console.log('Testing Supabase SQL capabilities...');
    
    // First, let's try to enable SQL functions if they don't exist
    console.log('Checking available RPC functions...');
    
    // Method 1: Create a simple SQL execution function first
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION execute_sql(query text)
      RETURNS json AS $$
      BEGIN
        EXECUTE query;
        RETURN json_build_object('success', true, 'message', 'Query executed successfully');
      EXCEPTION WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Try to create the function using direct HTTP request
    const createFunctionResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({ query: createFunctionSQL })
    });
    
    if (!createFunctionResponse.ok) {
      console.log('Function creation failed, trying manual table creation...');
      
      // Method 2: Try creating tables using migrations approach
      const tableSQL = `
        -- Create test_connection table
        CREATE TABLE IF NOT EXISTS public.test_connection (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Insert sample data
        INSERT INTO public.test_connection (name, email) VALUES 
        ('Supabase Manual Creation', 'manual@brandscaling.com'),
        ('Direct SQL Test', 'sql@brandscaling.com')
        ON CONFLICT DO NOTHING;
        
        -- Create workbook_sessions table
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
        
        -- Insert sample workbook data
        INSERT INTO public.workbook_sessions (user_id, user_email, dna_mode, business_filter, edna_reflection) VALUES 
        ('supabase-direct-user', 'direct@supabase.com', 'architect', 
         '{"problem": true, "person": true, "profit": false, "pull": true, "aiResponse": "Supabase connection successful!"}',
         '{"clarityReflection": "Direct SQL creation working perfectly!"}'
        )
        ON CONFLICT DO NOTHING;
      `;
      
      // Try executing using the database URL directly with curl
      console.log('Attempting direct SQL execution...');
      
      // Method 3: Use the existing database connection to run the SQL
      console.log('Using manual SQL insertion via REST API...');
      
      // Create tables step by step
      const tables = [
        {
          name: 'test_connection',
          data: { name: 'REST API Creation', email: 'rest@brandscaling.com' }
        },
        {
          name: 'workbook_sessions', 
          data: { 
            user_id: 'rest-api-user', 
            user_email: 'rest@brandscaling.com',
            dna_mode: 'architect',
            business_filter: { problem: true, person: true, profit: false, pull: true },
            edna_reflection: { clarityReflection: 'REST API working!' }
          }
        }
      ];
      
      for (const table of tables) {
        console.log(`Creating ${table.name} table by inserting data...`);
        
        const { data, error } = await supabase
          .from(table.name)
          .insert([table.data])
          .select();
        
        if (error) {
          console.log(`${table.name} creation error:`, error.message);
          
          // If table doesn't exist, the error will tell us - that's expected
          if (error.message.includes('does not exist')) {
            console.log(`Table ${table.name} needs to be created manually in Supabase SQL Editor`);
          }
        } else {
          console.log(`✓ ${table.name} table created with data:`, data);
        }
      }
    } else {
      console.log('✓ Function created successfully');
      
      // Now use the function to create tables
      const { data, error } = await supabase.rpc('execute_sql', {
        query: tableSQL
      });
      
      if (error) {
        console.log('SQL execution error:', error);
      } else {
        console.log('✓ Tables created successfully:', data);
      }
    }
    
    // Final verification - try to read from tables
    console.log('Verifying table creation...');
    
    const { data: testData, error: testError } = await supabase
      .from('test_connection')
      .select('*')
      .limit(3);
    
    if (testError) {
      console.log('Verification failed - table may not exist yet:', testError.message);
      console.log('\n📝 MANUAL STEPS REQUIRED:');
      console.log('1. Go to your Supabase SQL Editor');
      console.log('2. Run this SQL to create the tables:');
      console.log(`
CREATE TABLE IF NOT EXISTS public.test_connection (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.test_connection (name, email) VALUES 
('Manual SQL Creation', 'manual@brandscaling.com'),
('Supabase Success', 'success@brandscaling.com');

CREATE TABLE IF NOT EXISTS public.workbook_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT,
  dna_mode TEXT DEFAULT 'architect',
  business_filter JSONB DEFAULT '{}',
  edna_reflection JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.workbook_sessions (user_id, user_email, business_filter) VALUES 
('manual-user', 'manual@brandscaling.com', '{"problem": true, "person": true}');
      `);
    } else {
      console.log('✓ Verification successful! Tables exist with data:', testData);
    }
    
  } catch (error) {
    console.error('Process failed:', error.message);
  }
}

enableSQLAndCreateTables();