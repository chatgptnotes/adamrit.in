// Script to create user_register table in Supabase
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://jtlbkmwwaivkqlwqdryb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bGJrbXd3YWl2a3Fsd3FkcnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTU3NjcsImV4cCI6MjA2MjE3MTc2N30.6Y7gYCO2pNh9-Ab5bH4AnauMC3UCFNSixjiT8y_m6LU';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL to create user_register table
const createTableSQL = `
CREATE TABLE IF NOT EXISTS user_register (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  profile_image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

// Function to create the table
async function createUserRegisterTable() {
  try {
    console.log('Creating user_register table...');
    
    // Use raw query to execute SQL
    const { data, error } = await supabase.rpc('execute_sql', { 
      sql: createTableSQL 
    });
    
    if (error) {
      console.error('Error creating table:', error.message);
      console.log('Please run this SQL manually in the Supabase SQL editor:');
      console.log(createTableSQL);
    } else {
      console.log('Successfully created user_register table!');
    }
  } catch (err) {
    console.error('Exception creating table:', err.message);
    console.log('Please run this SQL manually in the Supabase SQL editor:');
    console.log(createTableSQL);
  }
}

createUserRegisterTable(); 