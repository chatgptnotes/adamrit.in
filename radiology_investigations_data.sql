-- Common Radiological Investigations Data for Hospital Management System
-- Run this script in your Supabase SQL Editor to add 20 common radiology investigations

-- Insert 20 common radiological investigations into the investigations table
INSERT INTO investigations (name, code, rate) VALUES
-- Basic X-rays
('SONOGRAPHY OF ABDOMEN', 'R-001', 3000),
('Upper Gi Endoscopy With Ultrasound Sonography', 'R-002', 25000),
('X-RAY Left Forearm With Wrist AP/Lat. VIEW', 'R-003', 1100),
('X-RAY TIBIA - AP', 'R-004', 550),
('SONOGRAPHY OF PELVIS', 'R-005', 550),

-- Additional common radiological investigations
('Chest X-ray PA View', 'R-006', 400),
('Chest X-ray AP View', 'R-007', 400),
('X-ray Skull AP/Lateral', 'R-008', 800),
('X-ray Spine Cervical AP/Lateral', 'R-009', 900),
('X-ray Spine Lumbar AP/Lateral', 'R-010', 1000),
('X-ray Pelvis AP', 'R-011', 600),
('X-ray Knee Joint AP/Lateral', 'R-012', 700),
('X-ray Shoulder Joint AP', 'R-013', 650),
('X-ray Hand AP/Oblique', 'R-014', 500),
('X-ray Foot AP/Lateral', 'R-015', 500),

-- CT Scans
('CT Head Plain', 'R-016', 4500),
('CT Chest Plain', 'R-017', 5000),
('CT Abdomen Plain', 'R-018', 5500),
('CT Abdomen with Contrast', 'R-019', 8000),
('CT Chest with Contrast', 'R-020', 7500),

-- MRI Scans
('MRI Brain Plain', 'R-021', 12000),
('MRI Brain with Contrast', 'R-022', 15000),
('MRI Spine Cervical', 'R-023', 14000),
('MRI Spine Lumbar', 'R-024', 14000),
('MRI Knee Joint', 'R-025', 13000),

-- Ultrasound Studies
('USG Abdomen Complete', 'R-026', 2500),
('USG Pelvis (Male)', 'R-027', 2000),
('USG Pelvis (Female)', 'R-028', 2200),
('USG Pregnancy (Obstetric)', 'R-029', 2800),
('USG Thyroid', 'R-030', 1800),
('USG Breast', 'R-031', 2000),
('USG Scrotum', 'R-032', 1800),
('USG Carotid Doppler', 'R-033', 3500),

-- Specialized Studies
('Barium Swallow', 'R-034', 3000),
('Barium Meal', 'R-035', 3500),
('Barium Enema', 'R-036', 4000),
('IVP (Intravenous Pyelography)', 'R-037', 4500),
('HSG (Hysterosalpingography)', 'R-038', 5000),
('MRCP (MR Cholangiopancreatography)', 'R-039', 18000),
('CT Angiography', 'R-040', 12000),

-- Nuclear Medicine
('Bone Scan (Tc-99m)', 'R-041', 8000),
('Thyroid Scan', 'R-042', 6000),
('Renal Scan (DTPA)', 'R-043', 7000),

-- Interventional Radiology
('CT Guided Biopsy', 'R-044', 15000),
('USG Guided Biopsy', 'R-045', 8000),

-- Mammography
('Mammography Bilateral', 'R-046', 4500),
('Mammography Unilateral', 'R-047', 2500),

-- Cardiac Imaging
('Echocardiography', 'R-048', 3500),
('Stress Echocardiography', 'R-049', 6000),
('ECG (Electrocardiogram)', 'R-050', 300)

ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  rate = EXCLUDED.rate,
  updated_at = NOW();

-- Create a view to easily see all radiology investigations
CREATE OR REPLACE VIEW radiology_investigations_view AS
SELECT 
    id,
    name,
    code,
    rate,
    created_at,
    updated_at
FROM investigations
WHERE code LIKE 'R-%'
ORDER BY code;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_investigations_code ON investigations(code);
CREATE INDEX IF NOT EXISTS idx_investigations_name ON investigations(name);

-- Display summary of added investigations
SELECT 
    'Radiology Investigations Added' as summary,
    COUNT(*) as total_count,
    MIN(rate) as min_rate,
    MAX(rate) as max_rate,
    AVG(rate)::DECIMAL(10,2) as avg_rate
FROM investigations 
WHERE code LIKE 'R-%';

-- Display all radiology investigations by category
SELECT 
    CASE 
        WHEN name ILIKE '%x-ray%' OR name ILIKE '%x ray%' THEN 'X-Ray Studies'
        WHEN name ILIKE '%ct%' THEN 'CT Scans'
        WHEN name ILIKE '%mri%' OR name ILIKE '%mr %' THEN 'MRI Studies'
        WHEN name ILIKE '%usg%' OR name ILIKE '%ultrasound%' OR name ILIKE '%sonography%' THEN 'Ultrasound Studies'
        WHEN name ILIKE '%barium%' OR name ILIKE '%ivp%' OR name ILIKE '%hsg%' THEN 'Contrast Studies'
        WHEN name ILIKE '%scan%' AND name ILIKE '%tc-%' THEN 'Nuclear Medicine'
        WHEN name ILIKE '%biopsy%' THEN 'Interventional Radiology'
        WHEN name ILIKE '%mammography%' THEN 'Mammography'
        WHEN name ILIKE '%echo%' OR name ILIKE '%ecg%' THEN 'Cardiac Imaging'
        ELSE 'Other Studies'
    END as category,
    COUNT(*) as investigation_count,
    AVG(rate)::DECIMAL(10,2) as avg_rate_per_category
FROM investigations 
WHERE code LIKE 'R-%'
GROUP BY category
ORDER BY category; 