-- Create doctors table
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

-- Insert sample doctors
INSERT INTO doctors (dr_id, name, specialization, phone, email, license_number, department, experience_years, consultation_fee) VALUES
('dr001', 'Dr. Pranal Sahare', 'Urologist', '+91-9876543210', 'pranal.sahare@hospital.com', 'MH12345', 'Urology', 15, 350.00),
('dr002', 'Dr. Ashwin Chichkhede', 'MD (Medicine)', '+91-9876543211', 'ashwin.chichkhede@hospital.com', 'MH12346', 'Internal Medicine', 12, 350.00),
('dr003', 'Dr. Rajesh Kumar', 'Cardiologist', '+91-9876543212', 'rajesh.kumar@hospital.com', 'MH12347', 'Cardiology', 18, 500.00),
('dr004', 'Dr. Priya Sharma', 'Gynecologist', '+91-9876543213', 'priya.sharma@hospital.com', 'MH12348', 'Gynecology', 10, 400.00),
('dr005', 'Dr. Amit Verma', 'Orthopedic Surgeon', '+91-9876543214', 'amit.verma@hospital.com', 'MH12349', 'Orthopedics', 14, 450.00),
('dr006', 'Dr. Sunita Singh', 'ENT Specialist', '+91-9876543215', 'sunita.singh@hospital.com', 'MH12350', 'ENT', 8, 300.00),
('dr007', 'Dr. Vikram Mehta', 'Neurosurgeon', '+91-9876543216', 'vikram.mehta@hospital.com', 'MH12351', 'Neurosurgery', 20, 800.00),
('dr008', 'Dr. Kavita Jain', 'Dermatologist', '+91-9876543217', 'kavita.jain@hospital.com', 'MH12352', 'Dermatology', 7, 350.00),
('dr009', 'Dr. Ravi Gupta', 'Gastroenterologist', '+91-9876543218', 'ravi.gupta@hospital.com', 'MH12353', 'Gastroenterology', 13, 450.00),
('dr010', 'Dr. Neha Agarwal', 'Pediatrician', '+91-9876543219', 'neha.agarwal@hospital.com', 'MH12354', 'Pediatrics', 9, 300.00); 