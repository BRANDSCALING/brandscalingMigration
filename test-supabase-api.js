// Test Supabase connection via REST API instead of direct database connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

async function testSupabaseAPI() {
  try {
    console.log('Testing Supabase API connection...');
    console.log('Supabase URL:', supabaseUrl);
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection by checking if we can query tables
    console.log('Attempting to list tables...');
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .limit(5);
    
    if (error) {
      console.log('Table listing error:', error.message);
      console.log('Trying to create a simple test table via API...');
      
      // Try to create a table using SQL function
      const { data: sqlData, error: sqlError } = await supabase.rpc('exec_sql', {
        query: `
          CREATE TABLE IF NOT EXISTS api_test_connection (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
          );
          INSERT INTO api_test_connection (name) VALUES ('API Test Success');
          SELECT * FROM api_test_connection;
        `
      });
      
      if (sqlError) {
        console.log('SQL execution error:', sqlError.message);
        console.log('Trying direct table operations...');
        
        // Try creating data in an existing table or auth.users
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.log('Auth test error:', authError.message);
        } else {
          console.log('✓ Supabase Auth API is working! Found', authData.users?.length || 0, 'users');
        }
      } else {
        console.log('✓ SQL execution successful:', sqlData);
      }
    } else {
      console.log('✓ Successfully connected to Supabase! Found tables:', data?.map(t => t.tablename).join(', '));
    }
    
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testSupabaseAPI();