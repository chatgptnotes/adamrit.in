-- Add surgery_name and complication_name columns to billing_diagnoses table
ALTER TABLE billing_diagnoses 
ADD COLUMN IF NOT EXISTS surgery_name TEXT,
ADD COLUMN IF NOT EXISTS complication_name TEXT;

-- Update the patient_billing table to ensure it has the required columns
ALTER TABLE patient_billing 
ADD COLUMN IF NOT EXISTS surgery_package TEXT,
ADD COLUMN IF NOT EXISTS complications TEXT; 