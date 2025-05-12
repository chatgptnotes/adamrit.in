-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist')),
  department TEXT,
  profile_image_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users are viewable by authenticated users" 
  ON users FOR SELECT 
  TO authenticated 
  USING (true);

-- Create policy for user to update own record
CREATE POLICY "Users can update own record" 
  ON users FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Insert dummy users
INSERT INTO users (username, email, full_name, role, department, phone) VALUES
('dr_sharma', 'dr.sharma@adamrit.in', 'Dr. Rakesh Sharma', 'doctor', 'Cardiology', '+91-9876543210'),
('dr_patel', 'dr.patel@adamrit.in', 'Dr. Meena Patel', 'doctor', 'Neurology', '+91-9876543211'),
('nurse_khan', 'nurse.khan@adamrit.in', 'Amir Khan', 'nurse', 'General', '+91-9876543212'),
('admin_singh', 'admin.singh@adamrit.in', 'Amarjeet Singh', 'admin', 'Administration', '+91-9876543213'),
('reception_roy', 'reception.roy@adamrit.in', 'Priya Roy', 'receptionist', 'Front Desk', '+91-9876543214'),
('dr_gupta', 'dr.gupta@adamrit.in', 'Dr. Sunita Gupta', 'doctor', 'Pediatrics', '+91-9876543215'),
('nurse_kumar', 'nurse.kumar@adamrit.in', 'Rajesh Kumar', 'nurse', 'Emergency', '+91-9876543216'),
('dr_reddy', 'dr.reddy@adamrit.in', 'Dr. Venkat Reddy', 'doctor', 'Orthopedics', '+91-9876543217'),
('admin_joshi', 'admin.joshi@adamrit.in', 'Neha Joshi', 'admin', 'IT Department', '+91-9876543218'),
('dr_sen', 'dr.sen@adamrit.in', 'Dr. Amitabh Sen', 'doctor', 'General Medicine', '+91-9876543219');

-- Create index for faster lookups
CREATE INDEX users_email_idx ON users (email);
CREATE INDEX users_role_idx ON users (role); 