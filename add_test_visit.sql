-- Add a test visit for the patient to verify the visit display is working
-- This will add an IPD visit for patient PAT-2025-71078

INSERT INTO visits (visit_id, patient_unique_id, visit_date, reason, department, doctor_name, notes)
VALUES (
    'VISIT-2025-IPD-001',
    'PAT-2025-71078', -- Sanjeev Kappor's unique_id
    CURRENT_DATE,
    'IPD Admission for treatment',
    'IPD',
    'Dr. Sharma',
    'Patient admitted for observation and treatment'
)
ON CONFLICT (visit_id) DO UPDATE SET
    visit_date = CURRENT_DATE,
    department = 'IPD',
    reason = 'IPD Admission for treatment';

-- You can also test with an OPD visit by uncommenting below
-- INSERT INTO visits (visit_id, patient_unique_id, visit_date, reason, department, doctor_name, notes)
-- VALUES (
--     'VISIT-2025-OPD-001',
--     'PAT-2025-71078',
--     CURRENT_DATE,
--     'OPD Consultation',
--     'OPD',
--     'Dr. Patel',
--     'Regular OPD consultation'
-- )
-- ON CONFLICT (visit_id) DO UPDATE SET
--     department = 'OPD'; 