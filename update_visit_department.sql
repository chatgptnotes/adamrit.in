-- Update existing visits to have department field set
-- This will help display IPD/OPD in the patient header

-- Update visits for patient PAT-2025-71078 to have IPD department
UPDATE visits 
SET department = 'IPD'
WHERE patient_unique_id = 'PAT-2025-71078'
AND (department IS NULL OR department = '');

-- You can also update specific visits by visit_id
-- UPDATE visits 
-- SET department = 'OPD'
-- WHERE visit_id = 'VISIT-2025-0001';

-- Check the updated visits
SELECT visit_id, patient_unique_id, visit_date, department, reason 
FROM visits 
WHERE patient_unique_id = 'PAT-2025-71078'
ORDER BY visit_date DESC; 