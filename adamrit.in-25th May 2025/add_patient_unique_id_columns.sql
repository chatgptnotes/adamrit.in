-- SQL script to add patient_unique_id columns to existing billing tables
-- Run this in Supabase SQL Editor to update your existing tables

-- Add patient_unique_id to billing_diagnoses table
ALTER TABLE billing_diagnoses 
ADD COLUMN IF NOT EXISTS patient_unique_id VARCHAR(255);

-- Add patient_unique_id to billing_surgeries table
ALTER TABLE billing_surgeries 
ADD COLUMN IF NOT EXISTS patient_unique_id VARCHAR(255);

-- Add patient_unique_id to billing_complications table
ALTER TABLE billing_complications 
ADD COLUMN IF NOT EXISTS patient_unique_id VARCHAR(255);

-- Add patient_unique_id to billing_consultations table
ALTER TABLE billing_consultations 
ADD COLUMN IF NOT EXISTS patient_unique_id VARCHAR(255);

-- Add patient_unique_id to billing_line_items table
ALTER TABLE billing_line_items 
ADD COLUMN IF NOT EXISTS patient_unique_id VARCHAR(255);

-- Create indexes on the new patient_unique_id columns for better performance
CREATE INDEX IF NOT EXISTS idx_billing_diagnoses_patient_id ON billing_diagnoses(patient_unique_id);
CREATE INDEX IF NOT EXISTS idx_billing_surgeries_patient_id ON billing_surgeries(patient_unique_id);
CREATE INDEX IF NOT EXISTS idx_billing_complications_patient_id ON billing_complications(patient_unique_id);
CREATE INDEX IF NOT EXISTS idx_billing_consultations_patient_id ON billing_consultations(patient_unique_id);
CREATE INDEX IF NOT EXISTS idx_billing_line_items_patient_id ON billing_line_items(patient_unique_id);

-- Update existing records to populate patient_unique_id from the related patient_billing table
-- This ensures existing data gets the patient_unique_id populated

UPDATE billing_diagnoses 
SET patient_unique_id = (
    SELECT patient_unique_id 
    FROM patient_billing 
    WHERE patient_billing.id = billing_diagnoses.billing_id
)
WHERE patient_unique_id IS NULL;

UPDATE billing_surgeries 
SET patient_unique_id = (
    SELECT patient_unique_id 
    FROM patient_billing 
    WHERE patient_billing.id = billing_surgeries.billing_id
)
WHERE patient_unique_id IS NULL;

UPDATE billing_complications 
SET patient_unique_id = (
    SELECT patient_unique_id 
    FROM patient_billing 
    WHERE patient_billing.id = billing_complications.billing_id
)
WHERE patient_unique_id IS NULL;

UPDATE billing_consultations 
SET patient_unique_id = (
    SELECT patient_unique_id 
    FROM patient_billing 
    WHERE patient_billing.id = billing_consultations.billing_id
)
WHERE patient_unique_id IS NULL;

UPDATE billing_line_items 
SET patient_unique_id = (
    SELECT patient_unique_id 
    FROM patient_billing 
    WHERE patient_billing.id = billing_line_items.billing_id
)
WHERE patient_unique_id IS NULL;

-- Make the columns NOT NULL after populating existing data (optional - commented out for safety)
-- Uncomment these lines if you want to enforce NOT NULL constraint

-- ALTER TABLE billing_diagnoses ALTER COLUMN patient_unique_id SET NOT NULL;
-- ALTER TABLE billing_surgeries ALTER COLUMN patient_unique_id SET NOT NULL;
-- ALTER TABLE billing_complications ALTER COLUMN patient_unique_id SET NOT NULL;
-- ALTER TABLE billing_consultations ALTER COLUMN patient_unique_id SET NOT NULL;
-- ALTER TABLE billing_line_items ALTER COLUMN patient_unique_id SET NOT NULL; 