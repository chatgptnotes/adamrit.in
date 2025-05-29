-- Add surgery_package and complications columns to patient_billing table
ALTER TABLE patient_billing 
ADD COLUMN IF NOT EXISTS surgery_package TEXT,
ADD COLUMN IF NOT EXISTS complications TEXT;

-- Update existing records to have default values
UPDATE patient_billing 
SET surgery_package = 'None', 
    complications = 'None' 
WHERE surgery_package IS NULL OR complications IS NULL; 