-- Fix visit department field for all visits
-- This script will ensure all visits have a proper department set

-- First, let's see what visits exist for this patient
SELECT visit_id, patient_unique_id, visit_date, department, reason, visit_type
FROM visits 
WHERE patient_unique_id = 'PAT-2025-71078';

-- Update visits that have visit_type but no department
UPDATE visits 
SET department = visit_type
WHERE patient_unique_id = 'PAT-2025-71078'
AND department IS NULL 
AND visit_type IS NOT NULL;

-- For visits with neither department nor visit_type, set based on reason
UPDATE visits 
SET department = CASE 
    WHEN LOWER(reason) LIKE '%ipd%' OR LOWER(reason) LIKE '%admission%' THEN 'IPD'
    WHEN LOWER(reason) LIKE '%opd%' OR LOWER(reason) LIKE '%consultation%' THEN 'OPD'
    ELSE 'IPD' -- Default to IPD for this patient
END
WHERE patient_unique_id = 'PAT-2025-71078'
AND (department IS NULL OR department = '');

-- Add the visit_type column if it doesn't exist
ALTER TABLE visits ADD COLUMN IF NOT EXISTS visit_type VARCHAR(50);

-- Update visit_type to match department
UPDATE visits 
SET visit_type = department
WHERE patient_unique_id = 'PAT-2025-71078'
AND visit_type IS NULL;

-- Verify the updates
SELECT visit_id, patient_unique_id, visit_date, department, visit_type, reason 
FROM visits 
WHERE patient_unique_id = 'PAT-2025-71078'
ORDER BY visit_date DESC; 