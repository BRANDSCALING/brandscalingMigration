// Create tables using the exact connection string and pg client
import pg from "pg";
const { Client } = pg;

// Use the exact connection string provided
const connectionString =
  "postgresql://postgres:Supabasereplitpass1@db.mhygcdbfvwceiskerzod.supabase.co:5432/postgres";

async function createSupabaseTables() {
  let client;

  try {
    console.log("Connecting to Supabase PostgreSQL directly...");

    // Parse the connection string properly
    const url = new URL(
      connectionString.replace("postgresql://", "postgres://"),
    );

    client = new Client({
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1) || "postgres",
      user: url.username,
      password: url.password,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    console.log("Attempting connection...");
    await client.connect();
    console.log("✅ Connected successfully to Supabase!");

    // Check current database
    const dbInfo = await client.query(
      "SELECT current_database(), current_user, version()",
    );
    console.log("Database info:", dbInfo.rows[0]);

    // Create test_connection table
    console.log("Creating test_connection table...");
    await client.query(`
      DROP TABLE IF EXISTS test_connection CASCADE;
      CREATE TABLE test_connection (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✅ test_connection table created");

    // Insert test data
    await client.query(`
      INSERT INTO test_connection (name, email) VALUES 
      ('Supabase Direct Connection', 'direct@brandscaling.com'),
      ('PostgreSQL Client Success', 'postgres@brandscaling.com'),
      ('Database Integration Complete', 'complete@brandscaling.com');
    `);
    console.log("✅ Test data inserted into test_connection");

    // Create workbook_sessions table
    console.log("Creating workbook_sessions table...");
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
    console.log("✅ workbook_sessions table created");

    // Insert workbook test data
    await client.query(`
      INSERT INTO workbook_sessions (user_id, user_email, dna_mode, business_filter, edna_reflection) VALUES 
      ('direct-postgres-user', 'postgres@brandscaling.com', 'architect', 
       '{"problem": true, "person": true, "profit": false, "pull": true, "aiResponse": "Direct PostgreSQL connection successful!", "customPrompt": "Testing direct PostgreSQL integration"}',
       '{"clarityReflection": "Direct database connection confirmed working", "customPrompt": "PostgreSQL direct connection test"}'
      ),
      ('supabase-integration-user', 'integration@supabase.com', 'alchemist',
       '{"problem": true, "person": false, "profit": true, "pull": true, "aiResponse": "Supabase integration complete!", "customPrompt": "Alchemist business validation via direct connection"}',
       '{"clarityReflection": "Creative entrepreneurial approach through direct DB", "customPrompt": "Alchemist direct connection"}'
      );
    `);
    console.log("✅ Workbook test data inserted");

    // Verify data
    const testConnectionCount = await client.query(
      "SELECT COUNT(*) as count FROM test_connection",
    );
    const workbookCount = await client.query(
      "SELECT COUNT(*) as count FROM workbook_sessions",
    );

    console.log(`✅ Verification complete:`);
    console.log(
      `  - test_connection table: ${testConnectionCount.rows[0].count} records`,
    );
    console.log(
      `  - workbook_sessions table: ${workbookCount.rows[0].count} records`,
    );

    // Show sample data
    const sampleTest = await client.query(
      "SELECT name, email FROM test_connection LIMIT 2",
    );
    const sampleWorkbook = await client.query(
      "SELECT user_id, dna_mode, user_email FROM workbook_sessions LIMIT 2",
    );

    console.log("\n📊 Sample data:");
    console.log("test_connection:");
    sampleTest.rows.forEach((row) =>
      console.log(`  - ${row.name} (${row.email})`),
    );

    console.log("workbook_sessions:");
    sampleWorkbook.rows.forEach((row) =>
      console.log(`  - ${row.user_id} (${row.dna_mode}) - ${row.user_email}`),
    );

    console.log("\n🎉 SUCCESS! Tables created in your Supabase database!");
    console.log(
      "Go to your Supabase Table Editor and refresh - you should now see:",
    );
    console.log("  - test_connection table with 3 records");
    console.log("  - workbook_sessions table with 2 records");
  } catch (error) {
    console.error("❌ Error:", error.message);

    if (error.message.includes("ENOTFOUND")) {
      console.log("\n🔍 DNS Resolution failed. Possible solutions:");
      console.log(
        "1. Check if the hostname is correct: db.mhygcdbfvwceiskerzod.supabase.co",
      );
      console.log("2. Verify your Supabase project is active");
      console.log(
        "3. Try using the connection string directly from Supabase dashboard",
      );
    }
  } finally {
    if (client) {
      await client.end();
      console.log("Database connection closed.");
    }
  }
}

createSupabaseTables();
