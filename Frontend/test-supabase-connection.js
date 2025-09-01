// Test Supabase connection and create tables
import postgres from 'postgres';

async function testSupabaseConnection() {
  let sql;
  
  try {
    console.log('Testing Supabase connection with updated credentials...');
    
    // Get the connection string from environment
    const connectionString = process.env.DATABASE_URL_SUPABASE;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL_SUPABASE environment variable not found');
    }
    
    console.log('Connection string found, attempting connection...');
    
    // Create connection
    sql = postgres(connectionString, {
      ssl: 'require',
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10
    });
    
    // Test basic connection
    console.log('Testing basic connection...');
    const result = await sql`SELECT current_database(), current_user, version(), now() as timestamp`;
    console.log('✅ Successfully connected to Supabase!');
    console.log('Database info:', result[0]);
    
    // Create test_connection table
    console.log('\nCreating test_connection table...');
    await sql`
      DROP TABLE IF EXISTS test_connection CASCADE;
      CREATE TABLE test_connection (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    console.log('✅ test_connection table created');
    
    // Insert test data
    console.log('Inserting test data...');
    await sql`
      INSERT INTO test_connection (name, email) VALUES 
      ('Supabase Connection Success', 'success@supabase.com'),
      ('Updated Credentials Working', 'working@brandscaling.com'),
      ('Database Ready for Module 1', 'module1@ready.com')
    `;
    console.log('✅ Test data inserted');
    
    // Create workbook_sessions table with complete schema
    console.log('\nCreating workbook_sessions table...');
    await sql`
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
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    console.log('✅ workbook_sessions table created');
    
    // Insert comprehensive workbook test data
    console.log('Inserting workbook test data...');
    await sql`
      INSERT INTO workbook_sessions (user_id, user_email, dna_mode, business_filter, edna_reflection, clarity_prompts, current_section, completed_sections) VALUES 
      (
        'supabase-test-architect', 
        'architect@supabase.com', 
        'architect',
        ${JSON.stringify({
          problem: true,
          person: true,
          profit: false,
          pull: true,
          aiResponse: "Supabase connection successful! Architect approach validated through systematic business analysis.",
          customPrompt: "Updated Supabase architect business validation"
        })},
        ${JSON.stringify({
          clarityReflection: "Analytical and systematic entrepreneurial approach confirmed through updated Supabase integration",
          customPrompt: "Architect E-DNA reflection via new Supabase connection"
        })},
        ${JSON.stringify({
          prompt1: "What systematic approach drives your business decisions?",
          response1: "Data-driven analysis with structured planning and validation",
          prompt2: "How do you validate new business opportunities?",
          response2: "Through comprehensive market research and feasibility analysis"
        })},
        2,
        ${JSON.stringify(["business_filter", "edna_reflection"])}
      ),
      (
        'supabase-test-alchemist',
        'alchemist@supabase.com',
        'alchemist',
        ${JSON.stringify({
          problem: true,
          person: false,
          profit: true,
          pull: true,
          aiResponse: "Creative business opportunity identified! Innovative Alchemist approach validated through intuitive analysis.",
          customPrompt: "Updated Supabase alchemist creative validation"
        })},
        ${JSON.stringify({
          clarityReflection: "Creative and intuitive entrepreneurial style demonstrated through innovative thinking via Supabase",
          customPrompt: "Alchemist E-DNA reflection via new Supabase connection"
        })},
        ${JSON.stringify({
          prompt1: "What creative insights guide your business vision?",
          response1: "Intuitive understanding of market needs with innovative solution development",
          prompt2: "How do you approach complex business challenges?",
          response2: "Through creative problem-solving and breakthrough thinking"
        })},
        2,
        ${JSON.stringify(["business_filter", "edna_reflection"])}
      )
    `;
    console.log('✅ Workbook test data inserted');
    
    // Verify data creation
    const testCount = await sql`SELECT COUNT(*) as count FROM test_connection`;
    const workbookCount = await sql`SELECT COUNT(*) as count FROM workbook_sessions`;
    
    console.log('\n📊 Verification Results:');
    console.log(`test_connection table: ${testCount[0].count} records`);
    console.log(`workbook_sessions table: ${workbookCount[0].count} records`);
    
    // Show sample data
    const sampleTest = await sql`SELECT name, email, created_at FROM test_connection ORDER BY created_at DESC`;
    const sampleWorkbook = await sql`SELECT user_id, dna_mode, current_section, array_length(completed_sections, 1) as completed_count FROM workbook_sessions ORDER BY created_at DESC`;
    
    console.log('\n📋 Sample Data:');
    console.log('test_connection records:');
    sampleTest.forEach(row => console.log(`  - ${row.name} (${row.email}) - ${row.created_at}`));
    
    console.log('\nworkbook_sessions records:');
    sampleWorkbook.forEach(row => console.log(`  - ${row.user_id} (${row.dna_mode}) - Section ${row.current_section}, Completed: ${row.completed_count || 0}`));
    
    // Test JSONB functionality
    console.log('\n🧪 Testing JSONB functionality...');
    const jsonTest = await sql`
      SELECT 
        user_id,
        business_filter->>'aiResponse' as ai_response,
        edna_reflection->>'clarityReflection' as reflection,
        array_length(completed_sections, 1) as completed_count
      FROM workbook_sessions
      ORDER BY created_at DESC
    `;
    
    console.log('JSONB data extraction test:');
    jsonTest.forEach(row => {
      console.log(`  - ${row.user_id}:`);
      console.log(`    AI Response: ${row.ai_response?.substring(0, 50)}...`);
      console.log(`    Reflection: ${row.reflection?.substring(0, 50)}...`);
      console.log(`    Completed sections: ${row.completed_count || 0}`);
    });
    
    // List all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('\n📝 All tables in your Supabase database:');
    tables.forEach(row => console.log(`  - ${row.table_name}`));
    
    console.log('\n🎉 SUCCESS! Supabase database fully operational!');
    console.log('✅ Connection established with updated credentials');
    console.log('✅ Tables created: test_connection, workbook_sessions');
    console.log('✅ Test data inserted and verified');
    console.log('✅ JSONB functionality confirmed working');
    console.log('✅ Ready for Module 1 workbook integration');
    
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.log('Error details:', error);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\nDNS resolution failed. Please verify:');
      console.log('1. Supabase project is active');
      console.log('2. Database hostname is correct');
      console.log('3. Network connectivity allows database connections');
    } else if (error.code === '28P01') {
      console.log('\nAuthentication failed. Please verify:');
      console.log('1. Username is correct (usually "postgres")');
      console.log('2. Password is correct');
      console.log('3. Database name is correct');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\nConnection refused. Please verify:');
      console.log('1. Supabase project is running');
      console.log('2. Port 5432 is accessible');
      console.log('3. SSL settings are correct');
    }
  } finally {
    if (sql) {
      await sql.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

testSupabaseConnection();