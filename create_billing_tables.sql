-- Create billing tables for patient invoices and billing details

-- Main billing/invoice table
CREATE TABLE IF NOT EXISTS patient_billing (
    id SERIAL PRIMARY KEY,
    patient_unique_id VARCHAR(255) NOT NULL,
    visit_id VARCHAR(255),
    bill_number VARCHAR(100) UNIQUE NOT NULL,
    claim_id VARCHAR(100),
    
    -- Patient details
    patient_name VARCHAR(255) NOT NULL,
    patient_age INTEGER,
    patient_gender VARCHAR(50),
    patient_phone VARCHAR(50),
    rank VARCHAR(100),
    service_number VARCHAR(100),
    category VARCHAR(100) DEFAULT 'GENERAL',
    
    -- Dates
    date_of_admission DATE,
    date_of_discharge DATE,
    conservative_start_date DATE,
    conservative_end_date DATE,
    surgical_start_date DATE,
    surgical_end_date DATE,
    conservative_start_date_2 DATE,
    conservative_end_date_2 DATE,
    bill_date DATE DEFAULT CURRENT_DATE,
    
    -- Diagnosis
    primary_diagnosis TEXT,
    
    -- Totals
    total_amount DECIMAL(12,2) DEFAULT 0.00,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, final, paid, cancelled
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Billing line items table
CREATE TABLE IF NOT EXISTS billing_line_items (
    id SERIAL PRIMARY KEY,
    billing_id INTEGER REFERENCES patient_billing(id) ON DELETE CASCADE,
    patient_unique_id VARCHAR(255) NOT NULL, -- Direct link to patient
    
    -- Item details
    item_type VARCHAR(100), -- 'consultation', 'accommodation', 'pathology', 'medicine', 'other', 'surgical'
    section_title VARCHAR(255), -- 'Conservative Treatment', 'Surgical Package', etc.
    sr_number VARCHAR(20), -- '1)', '2)', 'i)', 'ii)', etc.
    item_name VARCHAR(500) NOT NULL,
    item_code VARCHAR(100),
    
    -- Pricing
    rate DECIMAL(10,2) DEFAULT 0.00,
    quantity INTEGER DEFAULT 1,
    amount DECIMAL(12,2) DEFAULT 0.00,
    
    -- Additional details
    date_range VARCHAR(255),
    notes TEXT,
    
    -- For surgical items with complex pricing
    base_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    final_amount DECIMAL(12,2),
    cghs_adjustment VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Patient selected diagnoses for billing
CREATE TABLE IF NOT EXISTS billing_diagnoses (
    id SERIAL PRIMARY KEY,
    billing_id INTEGER REFERENCES patient_billing(id) ON DELETE CASCADE,
    patient_unique_id VARCHAR(255) NOT NULL, -- Direct link to patient
    diagnosis_id VARCHAR(255), -- UUID from diagnosis table
    diagnosis_name VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    diagnosed_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Patient selected surgeries for billing
CREATE TABLE IF NOT EXISTS billing_surgeries (
    id SERIAL PRIMARY KEY,
    billing_id INTEGER REFERENCES patient_billing(id) ON DELETE CASCADE,
    patient_unique_id VARCHAR(255) NOT NULL, -- Direct link to patient
    surgery_id VARCHAR(255), -- UUID from cghs_surgery table
    surgery_name VARCHAR(500) NOT NULL,
    surgery_code VARCHAR(100),
    surgery_amount VARCHAR(100),
    complication1 VARCHAR(255),
    complication2 VARCHAR(255),
    surgery_date DATE,
    surgeon_name VARCHAR(255),
    anesthetist_name VARCHAR(255),
    anesthesia_type VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Patient complications for billing
CREATE TABLE IF NOT EXISTS billing_complications (
    id SERIAL PRIMARY KEY,
    billing_id INTEGER REFERENCES patient_billing(id) ON DELETE CASCADE,
    patient_unique_id VARCHAR(255) NOT NULL, -- Direct link to patient
    complication_name VARCHAR(500) NOT NULL,
    severity VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    occurred_date DATE DEFAULT CURRENT_DATE,
    related_diagnosis_id INTEGER REFERENCES billing_diagnoses(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Billing consultations (for doctor consultations)
CREATE TABLE IF NOT EXISTS billing_consultations (
    id SERIAL PRIMARY KEY,
    billing_id INTEGER REFERENCES patient_billing(id) ON DELETE CASCADE,
    patient_unique_id VARCHAR(255) NOT NULL, -- Direct link to patient
    doctor_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    consultation_date DATE DEFAULT CURRENT_DATE,
    rate DECIMAL(10,2) DEFAULT 350.00,
    quantity INTEGER DEFAULT 1,
    total_amount DECIMAL(12,2),
    date_range VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patient_billing_patient_id ON patient_billing(patient_unique_id);
CREATE INDEX IF NOT EXISTS idx_patient_billing_visit_id ON patient_billing(visit_id);
CREATE INDEX IF NOT EXISTS idx_patient_billing_bill_number ON patient_billing(bill_number);
CREATE INDEX IF NOT EXISTS idx_billing_line_items_billing_id ON billing_line_items(billing_id);
CREATE INDEX IF NOT EXISTS idx_billing_line_items_patient_id ON billing_line_items(patient_unique_id);
CREATE INDEX IF NOT EXISTS idx_billing_diagnoses_billing_id ON billing_diagnoses(billing_id);
CREATE INDEX IF NOT EXISTS idx_billing_diagnoses_patient_id ON billing_diagnoses(patient_unique_id);
CREATE INDEX IF NOT EXISTS idx_billing_surgeries_billing_id ON billing_surgeries(billing_id);
CREATE INDEX IF NOT EXISTS idx_billing_surgeries_patient_id ON billing_surgeries(patient_unique_id);
CREATE INDEX IF NOT EXISTS idx_billing_complications_billing_id ON billing_complications(billing_id);
CREATE INDEX IF NOT EXISTS idx_billing_complications_patient_id ON billing_complications(patient_unique_id);
CREATE INDEX IF NOT EXISTS idx_billing_consultations_billing_id ON billing_consultations(billing_id);
CREATE INDEX IF NOT EXISTS idx_billing_consultations_patient_id ON billing_consultations(patient_unique_id);

-- Add some sample data for testing
INSERT INTO patient_billing (
    patient_unique_id, 
    visit_id, 
    bill_number, 
    claim_id,
    patient_name, 
    patient_age, 
    patient_gender,
    patient_phone,
    rank,
    service_number,
    date_of_admission,
    date_of_discharge,
    conservative_start_date,
    conservative_end_date,
    surgical_start_date,
    surgical_end_date,
    primary_diagnosis,
    total_amount,
    status
) VALUES (
    '703db825-d73c-4e00-a2b8-9081da6b1f31',
    'VISIT-2024-0001',
    'BL24D-16/04',
    '29935890',
    'BHUPENDRA BALAPURE',
    45,
    'MALE',
    '+91 98765 43210',
    'Sep (RETD)',
    '1231207F',
    '2024-03-04',
    '2024-03-09',
    '2024-03-04',
    '2024-03-09',
    '2024-03-10',
    '2024-03-15',
    'URETHRAL STRICTURE WITH CYSTITIS WITH UTI WITH SEPSIS. KNOWN CASE OF PTH HTN CHRONIC OESOPHAGEAL STRICTURE.',
    45000.00,
    'draft'
) ON CONFLICT (bill_number) DO NOTHING;

-- Add sample billing line items
INSERT INTO billing_line_items (
    billing_id,
    patient_unique_id,
    item_type,
    section_title,
    sr_number,
    item_name,
    item_code,
    rate,
    quantity,
    amount,
    date_range
) VALUES 
(1, '703db825-d73c-4e00-a2b8-9081da6b1f31', 'consultation', 'Conservative Treatment', '1)', 'Consultation for Inpatients', '2', 350.00, 8, 2800.00, 'Dt.(04/03/2024 TO 09/03/2024)'),
(1, '703db825-d73c-4e00-a2b8-9081da6b1f31', 'accommodation', 'Conservative Treatment', '2)', 'Accommodation Charges', '', 1500.00, 8, 12000.00, 'Dt.(04/03/2024 TO 09/03/2024)'),
(1, '703db825-d73c-4e00-a2b8-9081da6b1f31', 'pathology', 'Conservative Treatment', '3)', 'Pathology Charges', '', 3545.00, 1, 3545.00, 'Dt.(04/03/2024 TO 09/03/2024)'),
(1, '703db825-d73c-4e00-a2b8-9081da6b1f31', 'medicine', 'Conservative Treatment', '4)', 'Medicine Charges', '', 9343.00, 1, 9343.00, 'Dt.(04/03/2024 TO 09/03/2024)'),
(1, '703db825-d73c-4e00-a2b8-9081da6b1f31', 'other', 'Conservative Treatment', '5)', 'ECG', '590', 175.00, 1, 175.00, ''),
(1, '703db825-d73c-4e00-a2b8-9081da6b1f31', 'other', 'Conservative Treatment', '5)', 'Chest PA view', '1608', 230.00, 1, 230.00, ''),
(1, '703db825-d73c-4e00-a2b8-9081da6b1f31', 'surgical', 'Surgical Package', '7)', 'Resection Bladder Neck Endoscopic', '874', 11308.00, 1, 10178.00, 'Dt.(10/03/2024)') 
ON CONFLICT DO NOTHING;

-- Add triggers to update total amount when line items change
CREATE OR REPLACE FUNCTION update_billing_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE patient_billing 
    SET total_amount = (
        SELECT COALESCE(SUM(
            CASE 
                WHEN final_amount IS NOT NULL THEN final_amount 
                ELSE amount 
            END
        ), 0)
        FROM billing_line_items 
        WHERE billing_id = COALESCE(NEW.billing_id, OLD.billing_id)
    ),
    updated_at = timezone('utc'::text, now())
    WHERE id = COALESCE(NEW.billing_id, OLD.billing_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_billing_total_insert ON billing_line_items;
DROP TRIGGER IF EXISTS trigger_update_billing_total_update ON billing_line_items;
DROP TRIGGER IF EXISTS trigger_update_billing_total_delete ON billing_line_items;

CREATE TRIGGER trigger_update_billing_total_insert
    AFTER INSERT ON billing_line_items
    FOR EACH ROW EXECUTE FUNCTION update_billing_total();

CREATE TRIGGER trigger_update_billing_total_update
    AFTER UPDATE ON billing_line_items
    FOR EACH ROW EXECUTE FUNCTION update_billing_total();

CREATE TRIGGER trigger_update_billing_total_delete
    AFTER DELETE ON billing_line_items
    FOR EACH ROW EXECUTE FUNCTION update_billing_total();

-- Add updated_at trigger for patient_billing
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_patient_billing_updated_at ON patient_billing;
CREATE TRIGGER update_patient_billing_updated_at
    BEFORE UPDATE ON patient_billing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 