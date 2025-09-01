// Try using drizzle to connect to Supabase
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

async function connectViaSupabaseDrizzle() {
  try {
    console.log('Attempting Supabase connection via Drizzle...');
    
    const connectionString = process.env.DATABASE_URL_SUPABASE;
    console.log('Connection string available:', !!connectionString);
    
    if (!connectionString) {
      console.error('DATABASE_URL_SUPABASE not found in environment');
      return;
    }
    
    // Try with different SSL configurations
    const sslConfigs = [
      { ssl: 'require' },
      { ssl: { rejectUnauthorized: false } },
      { ssl: false },
      {}
    ];
    
    for (let i = 0; i < sslConfigs.length; i++) {
      console.log(`\nTrying SSL config ${i + 1}:`, sslConfigs[i]);
      
      try {
        const client = postgres(connectionString, {
          ...sslConfigs[i],
          max: 1,
          idle_timeout: 10,
          connect_timeout: 5
        });
        
        const db = drizzle(client);
        
        // Test simple query
        const result = await client`SELECT 1 as test`;
        console.log('✅ Connection successful with config', i + 1);
        console.log('Test result:', result);
        
        // Try creating a simple table
        await client`
          CREATE TABLE IF NOT EXISTS supabase_test (
            id SERIAL PRIMARY KEY,
            test_name TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          )
        `;
        
        await client`
          INSERT INTO supabase_test (test_name) VALUES ('Connection Success')
          ON CONFLICT DO NOTHING
        `;
        
        const testData = await client`SELECT * FROM supabase_test LIMIT 1`;
        console.log('✅ Table creation and data insertion successful');
        console.log('Test data:', testData);
        
        await client.end();
        return true;
        
      } catch (error) {
        console.log(`❌ Config ${i + 1} failed:`, error.message);
        console.log('Error code:', error.code);
      }
    }
    
    console.log('\n❌ All SSL configurations failed');
    
  } catch (error) {
    console.error('❌ Overall connection attempt failed:', error.message);
  }
}

connectViaSupabaseDrizzle();