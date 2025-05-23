-- Create sequence for unique_id
CREATE SEQUENCE IF NOT EXISTS patient_id_seq;

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unique_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    phone VARCHAR(20),
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_mobile VARCHAR(20),
    second_emergency_contact_name VARCHAR(255),
    second_emergency_contact_mobile VARCHAR(20),
    dob DATE,
    photo_url TEXT,
    passport VARCHAR(50),
    ward VARCHAR(50),
    panchayat VARCHAR(100),
    relationship_manager VARCHAR(255),
    quarter VARCHAR(100),
    pin VARCHAR(10),
    state VARCHAR(100),
    city VARCHAR(100),
    nationality VARCHAR(50) DEFAULT 'Indian',
    mobile VARCHAR(20),
    home_phone VARCHAR(20),
    temp_reg BOOLEAN DEFAULT false,
    consultant_own BOOLEAN DEFAULT false,
    blood_group VARCHAR(5),
    spouse VARCHAR(255),
    allergies TEXT,
    relative_phone VARCHAR(20),
    instructions TEXT,
    identity_type VARCHAR(50),
    email VARCHAR(255),
    fax VARCHAR(20),
    privilege_card VARCHAR(50),
    billing_link TEXT,
    referral_letter_url TEXT,
    diagnosis TEXT,
    surgery TEXT,
    corporate VARCHAR(50),
    approval_status VARCHAR(20) DEFAULT 'Pending',
    registration_date DATE DEFAULT CURRENT_DATE,
    insurance_status VARCHAR(20) DEFAULT 'Active',
    referee VARCHAR(255),
    type VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to generate unique_id
CREATE OR REPLACE FUNCTION generate_patient_unique_id()
RETURNS TRIGGER AS $$
DECLARE
    year_val VARCHAR(4);
    seq_val INTEGER;
BEGIN
    -- Get current year
    year_val := TO_CHAR(CURRENT_DATE, 'YYYY');
    
    -- Get next value from sequence
    seq_val := nextval('patient_id_seq');
    
    -- Format unique_id as ESIC-YYYY-XXXX
    NEW.unique_id := 'ESIC-' || year_val || '-' || LPAD(seq_val::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate unique_id
CREATE TRIGGER set_patient_unique_id
    BEFORE INSERT ON patients
    FOR EACH ROW
    EXECUTE FUNCTION generate_patient_unique_id();

-- Create index on commonly searched fields
CREATE INDEX idx_patients_name ON patients(name);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_unique_id ON patients(unique_id);
CREATE INDEX idx_patients_corporate ON patients(corporate);
CREATE INDEX idx_patients_type ON patients(type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 