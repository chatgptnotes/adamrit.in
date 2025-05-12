// Script to create users table and add dummy users to Supabase
const https = require('https');

// Supabase project details
const SUPABASE_URL = 'https://jtlbkmwwaivkqlwqdryb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bGJrbXd3YWl2a3Fsd3FkcnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTU3NjcsImV4cCI6MjA2MjE3MTc2N30.6Y7gYCO2pNh9-Ab5bH4AnauMC3UCFNSixjiT8y_m6LU';

// Dummy users data
const dummyUsers = [
  {
    username: 'dr_sharma',
    email: 'dr.sharma@adamrit.in',
    full_name: 'Dr. Rakesh Sharma',
    role: 'doctor',
    department: 'Cardiology',
    phone: '+91-9876543210'
  },
  {
    username: 'dr_patel',
    email: 'dr.patel@adamrit.in',
    full_name: 'Dr. Meena Patel',
    role: 'doctor',
    department: 'Neurology',
    phone: '+91-9876543211'
  },
  {
    username: 'nurse_khan',
    email: 'nurse.khan@adamrit.in',
    full_name: 'Amir Khan',
    role: 'nurse',
    department: 'General',
    phone: '+91-9876543212'
  },
  {
    username: 'admin_singh',
    email: 'admin.singh@adamrit.in',
    full_name: 'Amarjeet Singh',
    role: 'admin',
    department: 'Administration',
    phone: '+91-9876543213'
  },
  {
    username: 'reception_roy',
    email: 'reception.roy@adamrit.in',
    full_name: 'Priya Roy',
    role: 'receptionist',
    department: 'Front Desk',
    phone: '+91-9876543214'
  },
  {
    username: 'dr_gupta',
    email: 'dr.gupta@adamrit.in',
    full_name: 'Dr. Sunita Gupta',
    role: 'doctor',
    department: 'Pediatrics',
    phone: '+91-9876543215'
  },
  {
    username: 'nurse_kumar',
    email: 'nurse.kumar@adamrit.in',
    full_name: 'Rajesh Kumar',
    role: 'nurse',
    department: 'Emergency',
    phone: '+91-9876543216'
  },
  {
    username: 'dr_reddy',
    email: 'dr.reddy@adamrit.in',
    full_name: 'Dr. Venkat Reddy',
    role: 'doctor',
    department: 'Orthopedics',
    phone: '+91-9876543217'
  },
  {
    username: 'admin_joshi',
    email: 'admin.joshi@adamrit.in',
    full_name: 'Neha Joshi',
    role: 'admin',
    department: 'IT Department',
    phone: '+91-9876543218'
  },
  {
    username: 'dr_sen',
    email: 'dr.sen@adamrit.in',
    full_name: 'Dr. Amitabh Sen',
    role: 'doctor',
    department: 'General Medicine',
    phone: '+91-9876543219'
  }
];

// Function to make a request to Supabase
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUPABASE_URL.replace('https://', ''),
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          resolve({
            statusCode: res.statusCode,
            data: parsedData
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Main function to create users
async function createUsers() {
  try {
    console.log('Checking if users table exists...');
    
    // Check if users table exists
    const usersResponse = await makeRequest('GET', '/rest/v1/users?select=count');
    
    if (usersResponse.statusCode === 404) {
      console.log('Users table does not exist. Please create it first in the Supabase dashboard.');
      console.log('You can use the SQL in users_table.sql to create the table structure.');
      return;
    }
    
    console.log('Users table exists. Adding dummy users...');
    
    // Add each user
    for (const user of dummyUsers) {
      try {
        console.log(`Adding user: ${user.username}`);
        const response = await makeRequest('POST', '/rest/v1/users', user);
        
        if (response.statusCode >= 200 && response.statusCode < 300) {
          console.log(`✅ Successfully added user: ${user.username}`);
        } else {
          console.log(`❌ Failed to add user ${user.username}: ${JSON.stringify(response.data)}`);
        }
      } catch (error) {
        console.log(`❌ Error adding user ${user.username}: ${error.message}`);
      }
    }
    
    console.log('Process completed!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the function
createUsers(); 