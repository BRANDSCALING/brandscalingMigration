// Connect to Supabase with the corrected connection string
import pg from 'pg';
const { Client } = pg;

// Updated connection string with correct password
const connectionString = 'postgresql://postgres:Supabasereplitpass1@db.mhygcdbfvwceiskerzod.supabase.co:5432/postgres';

async function createSupabaseTablesNew() {
  let client;
  
  try {
    console.log('Connecting to Supabase with new credentials...');
    
    client = new Client({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();
    console.log('✅ Successfully connected to your Supabase database!');
    
    // Verify connection
    const dbInfo = await client.query('SELECT current_database(), current_user, version()');
    console.log('Connected to:', dbInfo.rows[0]);

    // Create test_connection table
    console.log('Creating test_connection table...');
    await client.query(`
      DROP TABLE IF EXISTS test_connection CASCADE;
      CREATE TABLE test_connection (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ test_connection table created');

    // Insert test data
    await client.query(`
      INSERT INTO test_connection (name, email) VALUES 
      ('Supabase Direct Success', 'direct@supabase.com'),
      ('New Connection Working', 'working@brandscaling.com'),
      ('Database Ready for Module 1', 'module1@ready.com');
    `);
    console.log('✅ Test data inserted');

    // Create workbook_sessions table with complete schema
    console.log('Creating workbook_sessions table...');
    await client.query(`
      DROP TABLE IF EXISTS workbook_sessions CASCADE;
      CREATE TABLE workbook_sessions (
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('✅ workbook_sessions table created');

    // Insert comprehensive workbook test data
    await client.query(`
      INSERT INTO workbook_sessions (user_id, user_email, dna_mode, business_filter, edna_reflection, clarity_prompts, current_section, completed_sections) VALUES 
      ('supabase-architect-user', 'architect@supabase.com', 'architect', 
       '{"problem": true, "person": true, "profit": false, "pull": true, "aiResponse": "Systematic business validation complete. Strong foundation identified.", "customPrompt": "Architect business filter analysis"}',
       '{"clarityReflection": "Analytical approach to entrepreneurship confirmed through systematic evaluation", "customPrompt": "Architect E-DNA reflection"}',
       '{"prompt1": "What systematic approach drives your business decisions?", "response1": "Data-driven analysis and structured planning", "prompt2": "How do you validate business opportunities?", "response2": "Through comprehensive market research and feasibility studies"}',
       2,
       '["business_filter", "edna_reflection"]'
      ),
      ('supabase-alchemist-user', 'alchemist@supabase.com', 'alchemist',
       '{"problem": true, "person": false, "profit": true, "pull": true, "aiResponse": "Creative business opportunity identified. Innovative approach validated.", "customPrompt": "Alchemist intuitive business validation"}',
       '{"clarityReflection": "Creative and intuitive entrepreneurial style demonstrated through innovative thinking", "customPrompt": "Alchemist E-DNA reflection"}',
       '{"prompt1": "What creative insights guide your business vision?", "response1": "Intuitive understanding of market needs and innovative solutions", "prompt2": "How do you approach business challenges?", "response2": "Through creative problem-solving and out-of-the-box thinking"}',
       2,
       '["business_filter", "edna_reflection"]'
      );
    `);
    console.log('✅ Workbook test data inserted');

    // Verify all data
    const testCount = await client.query('SELECT COUNT(*) as count FROM test_connection');
    const workbookCount = await client.query('SELECT COUNT(*) as count FROM workbook_sessions');
    
    console.log('\n📊 Verification Results:');
    console.log(`test_connection table: ${testCount.rows[0].count} records`);
    console.log(`workbook_sessions table: ${workbookCount.rows[0].count} records`);

    // Show sample data
    const sampleTest = await client.query('SELECT name, email FROM test_connection ORDER BY created_at DESC LIMIT 3');
    const sampleWorkbook = await client.query('SELECT user_id, dna_mode, current_section FROM workbook_sessions ORDER BY created_at DESC');
    
    console.log('\n📋 Sample Data:');
    console.log('test_connection records:');
    sampleTest.rows.forEach(row => console.log(`  - ${row.name} (${row.email})`));
    
    console.log('workbook_sessions records:');
    sampleWorkbook.rows.forEach(row => console.log(`  - ${row.user_id} (${row.dna_mode}) - Section ${row.current_section}`));

    // List all tables to confirm
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📝 All tables in your Supabase database:');
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));

    console.log('\n🎉 SUCCESS! Tables created in your Supabase database!');
    console.log('✅ Go to your Supabase Table Editor and refresh');
    console.log('✅ You should now see test_connection and workbook_sessions tables with data');
    console.log('✅ Database is ready for Module 1 workbook integration');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('DNS resolution still failing. Please verify:');
      console.log('1. Supabase project is active and running');
      console.log('2. Database hostname is correct');
      console.log('3. Network connectivity allows database connections');
    } else if (error.code === '28P01') {
      console.log('Authentication failed. Please verify password is correct.');
    } else {
      console.log('Error details:', error);
    }
  } finally {
    if (client) {
      await client.end();
      console.log('Database connection closed.');
    }
  }
}

createSupabaseTablesNew();