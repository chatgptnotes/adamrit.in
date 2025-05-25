// Script to add dummy users to Supabase
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://jtlbkmwwaivkqlwqdryb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bGJrbXd3YWl2a3Fsd3FkcnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTU3NjcsImV4cCI6MjA2MjE3MTc2N30.6Y7gYCO2pNh9-Ab5bH4AnauMC3UCFNSixjiT8y_m6LU';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Dummy user data
const dummyUsers = [
  {
    username: 'dr_johnson',
    email: 'dr.johnson@adamrit.in',
    full_name: 'Dr. Sarah Johnson',
    role: 'doctor',
    department: 'Cardiology',
    phone: '+91-9876543220'
  },
  {
    username: 'dr_williams',
    email: 'dr.williams@adamrit.in',
    full_name: 'Dr. Robert Williams',
    role: 'doctor',
    department: 'Neurology',
    phone: '+91-9876543221'
  },
  {
    username: 'nurse_davis',
    email: 'nurse.davis@adamrit.in',
    full_name: 'Emma Davis',
    role: 'nurse',
    department: 'General',
    phone: '+91-9876543222'
  },
  {
    username: 'admin_jones',
    email: 'admin.jones@adamrit.in',
    full_name: 'Michael Jones',
    role: 'admin',
    department: 'Administration',
    phone: '+91-9876543223'
  },
  {
    username: 'reception_brown',
    email: 'reception.brown@adamrit.in',
    full_name: 'Jennifer Brown',
    role: 'receptionist',
    department: 'Front Desk',
    phone: '+91-9876543224'
  }
];

// Function to add users to Supabase
async function addDummyUsers() {
  console.log('Adding dummy users to Supabase...');
  
  for (const user of dummyUsers) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select();
      
      if (error) {
        console.error(`Error adding user ${user.username}:`, error.message);
      } else {
        console.log(`Successfully added user: ${user.username}`);
      }
    } catch (err) {
      console.error(`Exception adding user ${user.username}:`, err.message);
    }
  }
  
  console.log('Done adding dummy users!');
}

// Run the function
addDummyUsers(); 