// Test Supabase connection AFTER you manually create the tables
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseAfterManualCreation() {
  try {
    console.log('Testing Supabase connection after manual table creation...');
    console.log('Supabase URL:', supabaseUrl);
    
    // Test 1: Read from test_connection table
    console.log('\n1. Testing test_connection table...');
    const { data: testData, error: testError } = await supabase
      .from('test_connection')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (testError) {
      console.log('❌ test_connection error:', testError.message);
    } else {
      console.log('✅ test_connection table working! Found', testData.length, 'records:');
      testData.forEach(record => {
        console.log(`  - ${record.name} (${record.email})`);
      });
    }
    
    // Test 2: Read from workbook_sessions table
    console.log('\n2. Testing workbook_sessions table...');
    const { data: workbookData, error: workbookError } = await supabase
      .from('workbook_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (workbookError) {
      console.log('❌ workbook_sessions error:', workbookError.message);
    } else {
      console.log('✅ workbook_sessions table working! Found', workbookData.length, 'records:');
      workbookData.forEach(record => {
        console.log(`  - ${record.user_id} (${record.dna_mode}) - ${record.user_email}`);
      });
    }
    
    // Test 3: Insert new data
    console.log('\n3. Testing data insertion...');
    const { data: newTestData, error: insertError } = await supabase
      .from('test_connection')
      .insert([
        { name: 'API Insert Test', email: 'api@replit.com' }
      ])
      .select();
    
    if (insertError) {
      console.log('❌ Insert error:', insertError.message);
    } else {
      console.log('✅ Data insertion successful:', newTestData);
    }
    
    // Test 4: Insert workbook session
    console.log('\n4. Testing workbook session insertion...');
    const { data: newWorkbookData, error: workbookInsertError } = await supabase
      .from('workbook_sessions')
      .insert([
        {
          user_id: 'api-test-user',
          user_email: 'api@replit.com',
          dna_mode: 'architect',
          business_filter: { 
            problem: true, 
            person: true, 
            profit: false, 
            pull: true, 
            aiResponse: 'API insertion test successful!',
            customPrompt: 'Testing API insertion functionality'
          },
          edna_reflection: { 
            clarityReflection: 'API connection confirmed working',
            customPrompt: 'API test reflection'
          }
        }
      ])
      .select();
    
    if (workbookInsertError) {
      console.log('❌ Workbook insert error:', workbookInsertError.message);
    } else {
      console.log('✅ Workbook session insertion successful:', newWorkbookData);
    }
    
    // Test 5: Update data
    console.log('\n5. Testing data updates...');
    const { data: updateData, error: updateError } = await supabase
      .from('test_connection')
      .update({ name: 'Updated API Test' })
      .eq('email', 'api@replit.com')
      .select();
    
    if (updateError) {
      console.log('❌ Update error:', updateError.message);
    } else {
      console.log('✅ Data update successful:', updateData);
    }
    
    console.log('\n🎉 SUPABASE CONNECTION TEST COMPLETE!');
    console.log('If all tests passed, your Supabase database is ready for Module 1 workbook!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSupabaseAfterManualCreation();