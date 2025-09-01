// Create tables directly in Supabase using the REST API
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTablesInSupabase() {
  try {
    console.log('Creating tables in Supabase database...');
    console.log('Supabase URL:', supabaseUrl);
    
    // Method 1: Try using raw SQL queries via the REST API
    console.log('Attempting to create tables using SQL...');
    
    // Create test_connection table
    const { data: createTable1, error: error1 } = await supabase
      .rpc('execute_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS test_connection (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
    
    if (error1) {
      console.log('SQL RPC method failed, trying direct table creation...');
      
      // Method 2: Try creating table by directly inserting data (this creates the table)
      const { data: insertData, error: insertError } = await supabase
        .from('test_connection')
        .insert([
          { name: 'Supabase Direct Test', email: 'direct@supabase.com' },
          { name: 'Table Creation Test', email: 'create@supabase.com' }
        ])
        .select();
      
      if (insertError) {
        console.log('Direct insert failed:', insertError.message);
        
        // Method 3: Try using raw SQL via different approach
        const sqlQuery = `
          DROP TABLE IF EXISTS test_connection;
          CREATE TABLE test_connection (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          INSERT INTO test_connection (name, email) VALUES 
          ('Supabase Connection Test', 'test1@brandscaling.com'),
          ('Database Integration Success', 'test2@brandscaling.com'),
          ('Module 1 Ready', 'test3@brandscaling.com');
        `;
        
        console.log('Trying raw SQL execution...');
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify({ query: sqlQuery })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('✓ Raw SQL execution successful:', result);
        } else {
          console.log('Raw SQL failed:', await response.text());
        }
      } else {
        console.log('✓ Table created via direct insert:', insertData);
      }
    } else {
      console.log('✓ Table created via SQL RPC:', createTable1);
    }
    
    // Now try to read data back to verify
    console.log('Verifying table creation by reading data...');
    const { data: readData, error: readError } = await supabase
      .from('test_connection')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.log('Read error:', readError.message);
    } else {
      console.log('✓ Successfully read data from test_connection:', readData);
    }
    
    // Create workbook_sessions table
    console.log('Creating workbook_sessions table...');
    const { data: workbookTable, error: workbookError } = await supabase
      .from('workbook_sessions')
      .insert([
        {
          user_id: 'supabase-test-user',
          user_email: 'supabase@brandscaling.com',
          dna_mode: 'architect',
          business_filter: { problem: true, person: true, profit: false, pull: true },
          edna_reflection: { clarityReflection: 'Supabase integration working!' }
        }
      ])
      .select();
    
    if (workbookError) {
      console.log('Workbook table error:', workbookError.message);
    } else {
      console.log('✓ Successfully created workbook_sessions data:', workbookTable);
    }
    
    console.log('\n🎉 Supabase table creation process completed!');
    console.log('Check your Supabase Table Editor for: test_connection and workbook_sessions tables');
    
  } catch (error) {
    console.error('Table creation failed:', error);
  }
}

createTablesInSupabase();