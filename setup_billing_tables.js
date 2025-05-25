const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBillingTables() {
  console.log('🚀 Setting up billing tables...\n');

  try {
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'create_billing_tables.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    // Split SQL content by semicolons to execute statements individually
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📋 Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip if statement is just whitespace or comments
      if (!statement || statement.match(/^\s*$/)) continue;

      // Extract table name if it's a CREATE TABLE statement
      const tableMatch = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
      const tableName = tableMatch ? tableMatch[1] : `Statement ${i + 1}`;

      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        }).single();

        if (error) {
          // Try direct query as fallback
          const { error: directError } = await supabase
            .from('_sql')
            .insert({ query: statement + ';' })
            .single();

          if (directError) {
            throw directError;
          }
        }

        console.log(`✅ ${tableName} - Success`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${tableName} - Error:`, error.message);
        errorCount++;
        
        // If it's a "already exists" error, count it as success
        if (error.message && error.message.includes('already exists')) {
          console.log(`   ℹ️  Table already exists, continuing...`);
          successCount++;
          errorCount--;
        }
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);

    if (errorCount === 0) {
      console.log('\n🎉 All billing tables set up successfully!');
    } else {
      console.log('\n⚠️  Some statements failed. Please check the errors above.');
      console.log('\nYou may need to run the SQL directly in Supabase dashboard:');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Copy and paste the contents of create_billing_tables.sql');
      console.log('5. Run the query');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    console.log('\n💡 Alternative method:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy the contents of create_billing_tables.sql');
    console.log('4. Paste and run the SQL');
  }
}

// Run the setup
setupBillingTables(); 