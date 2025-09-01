// Direct connection to Supabase using provided connection string
import pg from 'pg';
const { Client } = pg;

// Try different connection configurations
const configs = [
  {
    user: 'postgres',
    password: 'Supabasereplitpass@1',
    host: 'db.mhygcdbfvwceiskerzod.supabase.co',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  },
  {
    connectionString: 'postgresql://postgres:Supabasereplitpass%401@db.mhygcdbfvwceiskerzod.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false }
  }
];

async function connectToSupabase() {
  let client;
  let connected = false;
  
  // Try different connection configurations
  for (let i = 0; i < configs.length; i++) {
    try {
      console.log(`Trying connection method ${i + 1}...`);
      client = new Client(configs[i]);
      await client.connect();
      console.log(`✓ Connected successfully with method ${i + 1}!`);
      connected = true;
      break;
    } catch (error) {
      console.log(`Connection method ${i + 1} failed:`, error.message);
      if (client) {
        try { await client.end(); } catch {}
      }
    }
  }
  
  if (!connected) {
    console.error('All connection methods failed. Please check your Supabase credentials.');
    return;
  }

  try {
    console.log('Connecting to Supabase database...');
    await client.connect();
    console.log('✓ Connected successfully!');

    // Create test_connection table
    console.log('Creating test_connection table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ test_connection table created');

    // Create workbook_sessions table if it doesn't exist
    console.log('Creating workbook_sessions table...');
    await client.query(`
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
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ workbook_sessions table created');

    // Insert test data into test_connection
    console.log('Inserting test data into test_connection...');
    await client.query(`
      INSERT INTO test_connection (name, email) VALUES 
      ('Replit Connection Test', 'replit@brandscaling.com'),
      ('Supabase Integration', 'supabase@brandscaling.com'),
      ('Database Test Complete', 'success@database.com')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Test data inserted into test_connection');

    // Insert test workbook session
    console.log('Inserting test workbook session...');
    await client.query(`
      INSERT INTO workbook_sessions (user_id, user_email, dna_mode, business_filter, edna_reflection) VALUES 
      ('test-user-001', 'test@brandscaling.com', 'architect', 
       '{"problem": true, "person": true, "profit": false, "pull": true, "aiResponse": "Great business validation!", "customPrompt": "Test business filter"}',
       '{"clarityReflection": "Strong entrepreneurial self-awareness", "customPrompt": "Test reflection prompt"}'
      )
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Test workbook session inserted');

    // Verify data exists
    console.log('\nVerifying created tables and data...');
    
    const testConnResult = await client.query('SELECT COUNT(*) as count FROM test_connection;');
    console.log(`✓ test_connection has ${testConnResult.rows[0].count} records`);
    
    const workbookResult = await client.query('SELECT COUNT(*) as count FROM workbook_sessions;');
    console.log(`✓ workbook_sessions has ${workbookResult.rows[0].count} records`);

    // List all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log(`\n✓ Found ${tablesResult.rows.length} tables in your Supabase database:`);
    tablesResult.rows.forEach(row => console.log(`  - ${row.table_name}`));

    console.log('\n🎉 Supabase database connection and table creation completed successfully!');
    console.log('You should now see test_connection and workbook_sessions tables in your Supabase Table Editor.');

  } catch (error) {
    console.error('Database operation failed:', error);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

connectToSupabase();