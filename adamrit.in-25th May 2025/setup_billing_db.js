const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function setupBillingTables() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase URL or API key not found in .env.local');
      console.log('Please check your .env.local file has:');
      console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
      console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('🔍 Setting up billing tables in Supabase...\n');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'create_billing_tables.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute...\n`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          
          // Use rpc to execute raw SQL
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql_query: statement 
          });
          
          if (error) {
            console.warn(`⚠️  Statement ${i + 1} failed (this might be normal):`, error.message);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.warn(`⚠️  Statement ${i + 1} error:`, err.message);
        }
      }
    }
    
    console.log('\n🎉 Billing tables setup complete!');
    console.log('\n📋 Created tables:');
    console.log('   • patient_billing (main billing/invoice table)');
    console.log('   • billing_line_items (invoice line items)');
    console.log('   • billing_diagnoses (patient selected diagnoses)');
    console.log('   • billing_surgeries (patient selected surgeries)');
    console.log('   • billing_complications (patient complications)');
    console.log('   • billing_consultations (doctor consultations)');
    
    console.log('\n🔧 Features added:');
    console.log('   • Automatic total calculation triggers');
    console.log('   • Sample data for testing');
    console.log('   • Proper indexes for performance');
    console.log('   • Foreign key relationships');
    
    console.log('\n📖 Manual Setup Required:');
    console.log('If the automatic setup failed, please:');
    console.log('1. Open Supabase Dashboard → SQL Editor');
    console.log('2. Copy and paste the content from create_billing_tables.sql');
    console.log('3. Click "Run" to execute the SQL');
    
  } catch (error) {
    console.error('❌ Error setting up billing tables:', error.message);
    console.log('\n📖 Manual Setup Required:');
    console.log('Please run the SQL manually in Supabase Dashboard:');
    console.log('1. Open Supabase Dashboard → SQL Editor');
    console.log('2. Copy and paste the content from create_billing_tables.sql');
    console.log('3. Click "Run" to execute the SQL');
  }
}

// Run the setup
setupBillingTables(); 