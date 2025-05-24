const { createClient } = require('@supabase/supabase-js');

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Checking environment variables...');
console.log('Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('Supabase Key:', supabaseServiceKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Missing Supabase environment variables');
  console.log('\n💡 Please set these in your .env.local file:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  console.log('\n Or set them as environment variables before running this script:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_url NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key node create_doctors_table.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createDoctorsTable() {
  console.log('\n🏥 Setting up doctors table...');

  // Insert sample doctors data
  console.log('📋 Adding sample doctors...');

  const doctorsData = [
    {
      dr_id: 'dr001',
      name: 'Dr. Pranal Sahare',
      specialization: 'Urologist',
      phone: '+91-9876543210',
      email: 'pranal.sahare@hospital.com',
      license_number: 'MH12345',
      department: 'Urology',
      experience_years: 15,
      consultation_fee: 350.00
    },
    {
      dr_id: 'dr002',
      name: 'Dr. Ashwin Chichkhede',
      specialization: 'MD (Medicine)',
      phone: '+91-9876543211',
      email: 'ashwin.chichkhede@hospital.com',
      license_number: 'MH12346',
      department: 'Internal Medicine',
      experience_years: 12,
      consultation_fee: 350.00
    },
    {
      dr_id: 'dr003',
      name: 'Dr. Rajesh Kumar',
      specialization: 'Cardiologist',
      phone: '+91-9876543212',
      email: 'rajesh.kumar@hospital.com',
      license_number: 'MH12347',
      department: 'Cardiology',
      experience_years: 18,
      consultation_fee: 500.00
    },
    {
      dr_id: 'dr004',
      name: 'Dr. Priya Sharma',
      specialization: 'Gynecologist',
      phone: '+91-9876543213',
      email: 'priya.sharma@hospital.com',
      license_number: 'MH12348',
      department: 'Gynecology',
      experience_years: 10,
      consultation_fee: 400.00
    },
    {
      dr_id: 'dr005',
      name: 'Dr. Amit Verma',
      specialization: 'Orthopedic Surgeon',
      phone: '+91-9876543214',
      email: 'amit.verma@hospital.com',
      license_number: 'MH12349',
      department: 'Orthopedics',
      experience_years: 14,
      consultation_fee: 450.00
    },
    {
      dr_id: 'dr006',
      name: 'Dr. Sunita Singh',
      specialization: 'ENT Specialist',
      phone: '+91-9876543215',
      email: 'sunita.singh@hospital.com',
      license_number: 'MH12350',
      department: 'ENT',
      experience_years: 8,
      consultation_fee: 300.00
    },
    {
      dr_id: 'dr007',
      name: 'Dr. Vikram Mehta',
      specialization: 'Neurosurgeon',
      phone: '+91-9876543216',
      email: 'vikram.mehta@hospital.com',
      license_number: 'MH12351',
      department: 'Neurosurgery',
      experience_years: 20,
      consultation_fee: 800.00
    },
    {
      dr_id: 'dr008',
      name: 'Dr. Kavita Jain',
      specialization: 'Dermatologist',
      phone: '+91-9876543217',
      email: 'kavita.jain@hospital.com',
      license_number: 'MH12352',
      department: 'Dermatology',
      experience_years: 7,
      consultation_fee: 350.00
    },
    {
      dr_id: 'dr009',
      name: 'Dr. Ravi Gupta',
      specialization: 'Gastroenterologist',
      phone: '+91-9876543218',
      email: 'ravi.gupta@hospital.com',
      license_number: 'MH12353',
      department: 'Gastroenterology',
      experience_years: 13,
      consultation_fee: 450.00
    },
    {
      dr_id: 'dr010',
      name: 'Dr. Neha Agarwal',
      specialization: 'Pediatrician',
      phone: '+91-9876543219',
      email: 'neha.agarwal@hospital.com',
      license_number: 'MH12354',
      department: 'Pediatrics',
      experience_years: 9,
      consultation_fee: 300.00
    }
  ];

  try {
    const { data, error } = await supabase
      .from('doctors')
      .insert(doctorsData)
      .select();

    if (error) {
      console.error('❌ Error inserting doctors:', error);
      
      if (error.code === '42P01') {
        console.log('\n🔧 The doctors table does not exist. Creating it manually...');
        console.log('\n📝 Manual Setup Instructions:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Go to the SQL Editor');
        console.log('3. Copy and paste this SQL:');
        console.log(`
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    dr_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    license_number VARCHAR(100),
    department VARCHAR(255),
    experience_years INTEGER,
    consultation_fee DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert the sample doctors
INSERT INTO doctors (dr_id, name, specialization, phone, email, license_number, department, experience_years, consultation_fee) VALUES
${doctorsData.map(doctor => `('${doctor.dr_id}', '${doctor.name}', '${doctor.specialization}', '${doctor.phone}', '${doctor.email}', '${doctor.license_number}', '${doctor.department}', ${doctor.experience_years}, ${doctor.consultation_fee})`).join(',\n')};
        `);
        console.log('\n4. Run the SQL to create the table and insert the data');
      }
      return;
    }

    console.log('\n✅ Successfully added sample doctors:');
    data.forEach(doctor => {
      console.log(`   - ${doctor.name} (${doctor.specialization})`);
    });

    console.log('\n🎉 Doctors table setup complete!');
    console.log('Your dropdown should now work properly.');
    console.log('\n🌐 Refresh your browser to see the doctors in the dropdown!');

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.log('\n📝 If the error persists, try the manual setup method mentioned above.');
  }
}

createDoctorsTable(); 