// Switch the platform to use Supabase database and create tables
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Your Supabase connection string
const supabaseUrl = 'postgresql://postgres:Supabasereplitpass1@db.mhygcdbfvwceiskerzod.supabase.co:5432/postgres';

async function switchToSupabaseAndCreateTables() {
  try {
    console.log('Switching platform to use Supabase database...');
    
    // Create connection using postgres.js (which drizzle uses)
    const connection = postgres(supabaseUrl, {
      ssl: 'require',
      max: 1
    });
    
    console.log('Testing connection...');
    
    // Test the connection
    const result = await connection`SELECT current_database(), current_user, now()`;
    console.log('✅ Connected to Supabase successfully!');
    console.log('Database info:', result[0]);
    
    // Create tables using raw SQL
    console.log('Creating test_connection table...');
    await connection`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    
    console.log('Inserting test data...');
    await connection`
      INSERT INTO test_connection (name, email) VALUES 
      ('Supabase Connection Success', 'success@supabase.com'),
      ('Platform Integration Working', 'platform@brandscaling.com'),
      ('Database Switch Complete', 'switch@complete.com')
      ON CONFLICT DO NOTHING
    `;
    
    console.log('Creating workbook_sessions table...');
    await connection`
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
      )
    `;
    
    console.log('Inserting workbook test data...');
    await connection`
      INSERT INTO workbook_sessions (user_id, user_email, dna_mode, business_filter, edna_reflection) VALUES 
      ('platform-switch-user', 'platform@supabase.com', 'architect', 
       ${{ problem: true, person: true, profit: false, pull: true, aiResponse: 'Platform switch to Supabase successful!', customPrompt: 'Testing platform database switch' }},
       ${{ clarityReflection: 'Supabase integration complete via platform switch', customPrompt: 'Platform switch test reflection' }}
      )
      ON CONFLICT DO NOTHING
    `;
    
    // Verify data
    const testCount = await connection`SELECT COUNT(*) as count FROM test_connection`;
    const workbookCount = await connection`SELECT COUNT(*) as count FROM workbook_sessions`;
    
    console.log('\n📊 Verification:');
    console.log(`test_connection: ${testCount[0].count} records`);
    console.log(`workbook_sessions: ${workbookCount[0].count} records`);
    
    // Show sample data
    const sampleData = await connection`SELECT name, email FROM test_connection ORDER BY created_at DESC LIMIT 3`;
    const workbookData = await connection`SELECT user_id, dna_mode FROM workbook_sessions ORDER BY created_at DESC LIMIT 2`;
    
    console.log('\n📋 Sample Data:');
    sampleData.forEach(row => console.log(`  - ${row.name} (${row.email})`));
    workbookData.forEach(row => console.log(`  - ${row.user_id} (${row.dna_mode})`));
    
    console.log('\n🎉 SUCCESS! Your Supabase database now contains:');
    console.log('✅ test_connection table with data');
    console.log('✅ workbook_sessions table with data');
    console.log('✅ Ready for Module 1 workbook integration');
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('Error code:', error.code);
    console.log('Full error:', error);
  }
}

switchToSupabaseAndCreateTables();