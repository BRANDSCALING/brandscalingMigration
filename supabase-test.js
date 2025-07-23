// Test connection to Supabase directly
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log('Supabase URL:', supabaseUrl);
    
    // First, let's see what tables exist
    console.log('Checking existing tables...');
    
    // Try to query system tables to see what exists
    const { data: tablesData, error: tablesError } = await supabase
      .rpc('get_table_list');
    
    if (tablesError) {
      console.log('Cannot query tables via RPC, trying direct approach...');
    } else {
      console.log('Existing tables:', tablesData);
    }
    
    // Try creating table by directly inserting (this will create table if it doesn't exist)
    console.log('Attempting to create table by inserting data...');
    
    // Insert test data
    const { data: insertData, error: insertError } = await supabase
      .from('test_replit_connection')
      .insert([
        { name: 'Replit Test User', email: 'replit@brandscaling.com' },
        { name: 'Supabase Connection', email: 'supabase@brandscaling.com' }
      ])
      .select();
    
    if (insertError) {
      console.error('Insert Error:', insertError);
    } else {
      console.log('✓ Successfully inserted data:', insertData);
    }
    
    // Read data back
    const { data: selectData, error: selectError } = await supabase
      .from('test_replit_connection')
      .select('*')
      .limit(5);
    
    if (selectError) {
      console.error('Select Error:', selectError);
    } else {
      console.log('✓ Successfully read data:', selectData);
    }
    
    console.log('✓ Supabase connection test completed successfully!');
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testSupabaseConnection();