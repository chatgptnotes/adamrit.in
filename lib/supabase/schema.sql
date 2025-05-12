-- ESIC Hospital Management System Database Schema

-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id TEXT UNIQUE NOT NULL, -- Custom format: ESIC-YYYY-XXXX
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  insurance_status TEXT,
  registration_date DATE NOT NULL,
  last_visit_date DATE,
  date_of_admission DATE,
  date_of_discharge DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical staff table (doctors, surgeons, anesthetists)
CREATE TABLE medical_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  designation TEXT NOT NULL, -- e.g., Surgeon, Anesthetist, Physician
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diagnosis master table
CREATE TABLE diagnoses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icd_code TEXT, -- International Classification of Diseases code
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Surgery master table
CREATE TABLE surgeries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  package_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient visits table
CREATE TABLE patient_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id TEXT UNIQUE NOT NULL, -- Custom format: VISIT-YYYY-XXXX
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  reason TEXT NOT NULL,
  doctor_id UUID REFERENCES medical_staff(id),
  doctor_name TEXT, -- In case doctor is not in staff database
  department TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient diagnoses
CREATE TABLE patient_diagnoses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  diagnosis_id UUID NOT NULL REFERENCES diagnoses(id) ON DELETE CASCADE,
  diagnosis_date DATE NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  doctor_id UUID REFERENCES medical_staff(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (patient_id, diagnosis_id)
);

-- Clinical notes for diagnoses
CREATE TABLE clinical_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_diagnosis_id UUID NOT NULL REFERENCES patient_diagnoses(id) ON DELETE CASCADE,
  findings TEXT,
  history TEXT,
  examination TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Complications master table
CREATE TABLE complications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  source_type TEXT NOT NULL, -- 'diagnosis' or 'surgery'
  source_id UUID NOT NULL, -- references either diagnoses(id) or surgeries(id)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient complications
CREATE TABLE patient_complications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  complication_id UUID NOT NULL REFERENCES complications(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL, -- 'diagnosis' or 'surgery'
  source_instance_id UUID NOT NULL, -- either patient_diagnoses(id) or patient_surgeries(id)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (patient_id, complication_id, source_instance_id)
);

-- Patient surgeries
CREATE TABLE patient_surgeries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  surgery_id UUID NOT NULL REFERENCES surgeries(id) ON DELETE CASCADE,
  surgery_date DATE NOT NULL,
  surgeon_id UUID REFERENCES medical_staff(id),
  anesthetist_id UUID REFERENCES medical_staff(id),
  notes TEXT,
  package_amount DECIMAL(10,2),
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investigations master table
CREATE TABLE investigations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT,
  rate DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medications master table
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  dosage TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Complication-investigation mapping
CREATE TABLE complication_investigations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complication_id UUID NOT NULL REFERENCES complications(id) ON DELETE CASCADE,
  investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (complication_id, investigation_id)
);

-- Complication-medication mapping
CREATE TABLE complication_medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complication_id UUID NOT NULL REFERENCES complications(id) ON DELETE CASCADE,
  medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  dosage TEXT,
  frequency TEXT,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (complication_id, medication_id)
);

-- Patient investigations
CREATE TABLE patient_investigations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
  status TEXT, -- 'pending', 'completed', 'cancelled'
  result TEXT,
  ordered_date DATE NOT NULL,
  completed_date DATE,
  ordered_by UUID REFERENCES medical_staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient medications
CREATE TABLE patient_medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  dosage TEXT,
  frequency TEXT,
  duration TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  prescribed_by UUID REFERENCES medical_staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  invoice_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'created', -- 'created', 'paid', 'cancelled'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice items
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'surgery', 'investigation', 'consultation', 'medication', 'accommodation'
  item_id UUID, -- Can reference different tables based on item_type
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  rate DECIMAL(10,2) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS (Row Level Security) policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE complications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_complications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE complication_investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE complication_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policy for authenticated users
CREATE POLICY "Allow full access to authenticated users" ON patients FOR ALL TO authenticated USING (true);

-- Create public policy
CREATE POLICY "Allow full access to public" ON patients FOR ALL TO public USING (true);

-- Create some helper functions
CREATE OR REPLACE FUNCTION generate_patient_id() RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  current_year TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter 
  FROM patients 
  WHERE patient_id LIKE 'ESIC-' || current_year || '-%';
  
  new_id := 'ESIC-' || current_year || '-' || LPAD(counter::TEXT, 4, '0');
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO patients (name, age, gender, registration_date) VALUES
('Rahul Sharma', 30, 'Male', '2024-05-07'),
('Priya Singh', 25, 'Female', '2024-05-06');

INSERT INTO medical_staff (name, specialization, phone, email) VALUES
('Dr. K K Vaid', 'Cardiology', '9999999999', 'kkvaid@example.com'),
('Dr. Smt Kanta', 'General Medicine', '8888888888', 'kanta@example.com'); 