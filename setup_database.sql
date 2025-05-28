-- ESIC Hospital Management System - Complete Database Setup
-- Run this script in your Supabase SQL Editor

-- 1. Create patients table
CREATE SEQUENCE IF NOT EXISTS patient_id_seq;

CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unique_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    phone VARCHAR(20),
    address TEXT,
    registration_date DATE DEFAULT CURRENT_DATE,
    insurance_status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to generate unique patient IDs
CREATE OR REPLACE FUNCTION generate_patient_unique_id()
RETURNS TRIGGER AS $$
DECLARE
    year_val VARCHAR(4);
    seq_val INTEGER;
BEGIN
    year_val := TO_CHAR(CURRENT_DATE, 'YYYY');
    seq_val := nextval('patient_id_seq');
    NEW.unique_id := 'ESIC-' || year_val || '-' || LPAD(seq_val::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_patient_unique_id
    BEFORE INSERT ON patients
    FOR EACH ROW
    EXECUTE FUNCTION generate_patient_unique_id();

-- 2. Create diagnosis table
CREATE TABLE IF NOT EXISTS diagnosis (
    id SERIAL PRIMARY KEY,
    diagnosis_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    icd_code VARCHAR(20),
    category VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create patient_diagnosis table
CREATE TABLE IF NOT EXISTS patient_diagnosis (
    id SERIAL PRIMARY KEY,
    patient_unique_id VARCHAR(255) NOT NULL,
    diagnosis_id INTEGER REFERENCES diagnosis(id) ON DELETE CASCADE,
    visit_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    diagnosed_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create visits table
CREATE TABLE IF NOT EXISTS visits (
    id SERIAL PRIMARY KEY,
    visit_id VARCHAR(255) UNIQUE NOT NULL,
    patient_unique_id VARCHAR(255) NOT NULL,
    visit_date DATE DEFAULT CURRENT_DATE,
    reason TEXT,
    department VARCHAR(100),
    doctor_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Insert sample data

-- Sample patients
INSERT INTO patients (name, age, gender, phone, address) VALUES
('Rahul Sharma', 45, 'Male', '9876543210', 'Delhi'),
('Priya Singh', 32, 'Female', '9876543211', 'Mumbai'),
('Amit Kumar', 28, 'Male', '9876543212', 'Bangalore'),
('Sunita Devi', 55, 'Female', '9876543213', 'Kolkata'),
('Rajesh Gupta', 38, 'Male', '9876543214', 'Chennai')
ON CONFLICT (unique_id) DO NOTHING;

-- Sample diagnoses
INSERT INTO diagnosis (diagnosis_code, name, icd_code, category, description) VALUES
('DG001', 'Type 2 Diabetes Mellitus', 'E11', 'Endocrine', 'A chronic condition that affects the way your body metabolizes sugar'),
('DG002', 'Essential Hypertension', 'I10', 'Cardiovascular', 'High blood pressure without known cause'),
('DG003', 'Acute Myocardial Infarction', 'I21', 'Cardiovascular', 'Heart attack due to blocked coronary artery'),
('DG004', 'Chronic Kidney Disease', 'N18', 'Renal', 'Progressive loss of kidney function over time'),
('DG005', 'Asthma', 'J45', 'Respiratory', 'Chronic inflammatory disease of the airways')
ON CONFLICT (diagnosis_code) DO NOTHING;

-- Sample visits
INSERT INTO visits (visit_id, patient_unique_id, visit_date, reason, department, doctor_name) VALUES
('VISIT-2025-0001', 'ESIC-2025-0001', CURRENT_DATE, 'Regular checkup', 'General Medicine', 'Dr. Sharma'),
('VISIT-2025-0002', 'ESIC-2025-0002', CURRENT_DATE, 'Blood pressure monitoring', 'Cardiology', 'Dr. Patel'),
('VISIT-2025-0003', 'ESIC-2025-0003', CURRENT_DATE, 'Diabetes management', 'Endocrinology', 'Dr. Kumar')
ON CONFLICT (visit_id) DO NOTHING;

-- Sample patient diagnoses
INSERT INTO patient_diagnosis (patient_unique_id, diagnosis_id, status, notes) VALUES
('ESIC-2025-0001', 1, 'active', 'Well controlled with medication'),
('ESIC-2025-0002', 2, 'active', 'Requires lifestyle modifications'),
('ESIC-2025-0003', 1, 'active', 'Recently diagnosed, starting treatment');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_unique_id ON patients(unique_id);
CREATE INDEX IF NOT EXISTS idx_visits_patient_id ON visits(patient_unique_id);
CREATE INDEX IF NOT EXISTS idx_patient_diagnosis_patient_id ON patient_diagnosis(patient_unique_id);

-- Success message
SELECT 'Database setup completed successfully! You now have sample patients, diagnoses, and visits.' as message; 