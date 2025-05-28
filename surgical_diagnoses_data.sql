-- Surgical Diagnoses and Complications Data for Hospital Management System
-- Run this script in your Supabase SQL Editor

-- First, let's ensure we have the necessary tables with proper structure
-- Add specialty field to diagnoses table if it doesn't exist
ALTER TABLE diagnoses ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE diagnoses ADD COLUMN IF NOT EXISTS requires_surgery BOOLEAN DEFAULT FALSE;

-- Add timing and severity fields to complications table if they don't exist
ALTER TABLE complications ADD COLUMN IF NOT EXISTS timing TEXT; -- 'hospital_stay', 'surgery', 'post_surgery'
ALTER TABLE complications ADD COLUMN IF NOT EXISTS severity TEXT; -- 'mild', 'moderate', 'severe', 'critical'

-- Insert Orthopedic Diagnoses
INSERT INTO diagnoses (name, description, icd_code, specialty, requires_surgery, is_approved) VALUES
('Fracture of Femur Neck', 'Fracture of the neck of the femur requiring surgical fixation', 'S72.0', 'Orthopedics', TRUE, TRUE),
('Anterior Cruciate Ligament (ACL) Tear', 'Complete or partial tear of ACL requiring reconstruction', 'S83.5', 'Orthopedics', TRUE, TRUE),
('Meniscal Tear', 'Tear of knee meniscus requiring arthroscopic repair', 'S83.2', 'Orthopedics', TRUE, TRUE),
('Rotator Cuff Tear', 'Complete tear of rotator cuff requiring surgical repair', 'M75.1', 'Orthopedics', TRUE, TRUE),
('Lumbar Disc Herniation', 'Herniated disc requiring discectomy or fusion', 'M51.2', 'Orthopedics', TRUE, TRUE),
('Total Hip Replacement', 'Severe osteoarthritis requiring total hip arthroplasty', 'M16.9', 'Orthopedics', TRUE, TRUE);

-- Insert General Surgery Diagnoses
INSERT INTO diagnoses (name, description, icd_code, specialty, requires_surgery, is_approved) VALUES
('Acute Appendicitis', 'Inflammation of appendix requiring appendectomy', 'K35.9', 'General Surgery', TRUE, TRUE),
('Cholelithiasis with Cholecystitis', 'Gallstones with inflammation requiring cholecystectomy', 'K80.1', 'General Surgery', TRUE, TRUE),
('Inguinal Hernia', 'Inguinal hernia requiring surgical repair', 'K40.9', 'General Surgery', TRUE, TRUE),
('Peptic Ulcer with Perforation', 'Perforated peptic ulcer requiring emergency surgery', 'K25.5', 'General Surgery', TRUE, TRUE),
('Colorectal Cancer', 'Malignant tumor requiring bowel resection', 'C78.5', 'General Surgery', TRUE, TRUE),
('Thyroid Nodule', 'Thyroid nodule requiring thyroidectomy', 'E04.1', 'General Surgery', TRUE, TRUE);

-- Insert Pediatric Surgery Diagnoses
INSERT INTO diagnoses (name, description, icd_code, specialty, requires_surgery, is_approved) VALUES
('Congenital Diaphragmatic Hernia', 'Congenital defect requiring surgical repair', 'Q79.0', 'Pediatric Surgery', TRUE, TRUE),
('Pyloric Stenosis', 'Hypertrophic pyloric stenosis requiring pyloromyotomy', 'Q40.0', 'Pediatric Surgery', TRUE, TRUE),
('Intussusception', 'Bowel intussusception requiring surgical reduction', 'K56.1', 'Pediatric Surgery', TRUE, TRUE),
('Undescended Testis', 'Cryptorchidism requiring orchidopexy', 'Q53.9', 'Pediatric Surgery', TRUE, TRUE),
('Cleft Lip and Palate', 'Congenital cleft requiring surgical repair', 'Q37.9', 'Pediatric Surgery', TRUE, TRUE),
('Hirschsprung Disease', 'Congenital megacolon requiring pull-through procedure', 'Q43.1', 'Pediatric Surgery', TRUE, TRUE);

-- Insert Urosurgery Diagnoses
INSERT INTO diagnoses (name, description, icd_code, specialty, requires_surgery, is_approved) VALUES
('Kidney Stones', 'Renal calculi requiring surgical removal', 'N20.0', 'Urosurgery', TRUE, TRUE),
('Benign Prostatic Hyperplasia', 'Enlarged prostate requiring TURP', 'N40', 'Urosurgery', TRUE, TRUE),
('Bladder Cancer', 'Malignant bladder tumor requiring cystectomy', 'C67.9', 'Urosurgery', TRUE, TRUE),
('Urethral Stricture', 'Urethral narrowing requiring urethroplasty', 'N35.9', 'Urosurgery', TRUE, TRUE),
('Renal Cell Carcinoma', 'Kidney cancer requiring nephrectomy', 'C64', 'Urosurgery', TRUE, TRUE),
('Vesicoureteral Reflux', 'VUR requiring surgical correction', 'N13.70', 'Urosurgery', TRUE, TRUE);

-- Insert Plastic Surgery Diagnoses
INSERT INTO diagnoses (name, description, icd_code, specialty, requires_surgery, is_approved) VALUES
('Severe Burns', 'Third-degree burns requiring skin grafting', 'T30.0', 'Plastic Surgery', TRUE, TRUE),
('Facial Fractures', 'Complex facial fractures requiring reconstruction', 'S02.9', 'Plastic Surgery', TRUE, TRUE),
('Breast Cancer', 'Malignant breast tumor requiring mastectomy and reconstruction', 'C50.9', 'Plastic Surgery', TRUE, TRUE),
('Congenital Hand Deformity', 'Congenital hand anomaly requiring reconstruction', 'Q71.9', 'Plastic Surgery', TRUE, TRUE),
('Pressure Ulcers', 'Stage IV pressure ulcers requiring flap coverage', 'L89.9', 'Plastic Surgery', TRUE, TRUE),
('Post-traumatic Deformity', 'Traumatic deformity requiring reconstructive surgery', 'M95.9', 'Plastic Surgery', TRUE, TRUE);

-- Insert Gynecology & Obstetrics Diagnoses
INSERT INTO diagnoses (name, description, icd_code, specialty, requires_surgery, is_approved) VALUES
('Uterine Fibroids', 'Large fibroids requiring hysterectomy or myomectomy', 'D25.9', 'Gynecology', TRUE, TRUE),
('Ovarian Cysts', 'Complex ovarian cysts requiring surgical removal', 'N83.2', 'Gynecology', TRUE, TRUE),
('Ectopic Pregnancy', 'Tubal pregnancy requiring surgical intervention', 'O00.9', 'Obstetrics', TRUE, TRUE),
('Cesarean Section', 'Delivery requiring cesarean section', 'O82', 'Obstetrics', TRUE, TRUE),
('Endometriosis', 'Severe endometriosis requiring laparoscopic surgery', 'N80.9', 'Gynecology', TRUE, TRUE),
('Cervical Cancer', 'Malignant cervical tumor requiring radical hysterectomy', 'C53.9', 'Gynecology', TRUE, TRUE);

-- Now insert complications for each specialty

-- Orthopedic Complications
INSERT INTO complications (name, description, source_type, timing, severity) VALUES
-- Hospital Stay Complications
('Deep Vein Thrombosis', 'Blood clot formation in deep veins during hospitalization', 'diagnosis', 'hospital_stay', 'moderate'),
('Pulmonary Embolism', 'Blood clot in lungs during hospital stay', 'diagnosis', 'hospital_stay', 'severe'),
('Hospital-acquired Pneumonia', 'Pneumonia developed during hospital stay', 'diagnosis', 'hospital_stay', 'moderate'),
('Pressure Ulcers', 'Bed sores from prolonged immobilization', 'diagnosis', 'hospital_stay', 'mild'),

-- Surgery Complications
('Intraoperative Bleeding', 'Excessive bleeding during orthopedic surgery', 'diagnosis', 'surgery', 'moderate'),
('Nerve Injury', 'Damage to nerves during surgical procedure', 'diagnosis', 'surgery', 'severe'),
('Implant Malposition', 'Incorrect placement of orthopedic implants', 'diagnosis', 'surgery', 'moderate'),
('Anesthesia Complications', 'Adverse reactions to anesthesia during surgery', 'diagnosis', 'surgery', 'severe'),

-- Post-Surgery Complications
('Surgical Site Infection', 'Infection at the surgical site post-operatively', 'diagnosis', 'post_surgery', 'moderate'),
('Implant Loosening', 'Loosening of orthopedic implants over time', 'diagnosis', 'post_surgery', 'moderate'),
('Non-union of Fracture', 'Failure of bone to heal properly', 'diagnosis', 'post_surgery', 'severe'),
('Chronic Pain Syndrome', 'Persistent pain following surgery', 'diagnosis', 'post_surgery', 'moderate');

-- General Surgery Complications
INSERT INTO complications (name, description, source_type, timing, severity) VALUES
-- Hospital Stay Complications
('Ileus', 'Temporary paralysis of intestines during hospital stay', 'diagnosis', 'hospital_stay', 'moderate'),
('Urinary Retention', 'Inability to urinate normally during hospitalization', 'diagnosis', 'hospital_stay', 'mild'),
('Delirium', 'Acute confusion state during hospital stay', 'diagnosis', 'hospital_stay', 'moderate'),
('Electrolyte Imbalance', 'Disruption of body electrolytes during hospitalization', 'diagnosis', 'hospital_stay', 'moderate'),

-- Surgery Complications
('Bowel Perforation', 'Accidental perforation of bowel during surgery', 'diagnosis', 'surgery', 'severe'),
('Vascular Injury', 'Damage to blood vessels during surgical procedure', 'diagnosis', 'surgery', 'severe'),
('Bile Duct Injury', 'Damage to bile ducts during surgery', 'diagnosis', 'surgery', 'severe'),
('Conversion to Open Surgery', 'Need to convert laparoscopic to open procedure', 'diagnosis', 'surgery', 'mild'),

-- Post-Surgery Complications
('Anastomotic Leak', 'Leakage at surgical connection sites', 'diagnosis', 'post_surgery', 'severe'),
('Incisional Hernia', 'Hernia formation at incision site', 'diagnosis', 'post_surgery', 'moderate'),
('Adhesions', 'Scar tissue formation causing bowel obstruction', 'diagnosis', 'post_surgery', 'moderate'),
('Wound Dehiscence', 'Separation of surgical wound edges', 'diagnosis', 'post_surgery', 'moderate');

-- Pediatric Surgery Complications
INSERT INTO complications (name, description, source_type, timing, severity) VALUES
-- Hospital Stay Complications
('Feeding Difficulties', 'Problems with feeding during hospital stay', 'diagnosis', 'hospital_stay', 'moderate'),
('Temperature Instability', 'Difficulty maintaining body temperature', 'diagnosis', 'hospital_stay', 'moderate'),
('Respiratory Distress', 'Breathing difficulties during hospitalization', 'diagnosis', 'hospital_stay', 'severe'),
('Fluid Imbalance', 'Disruption of fluid balance in pediatric patients', 'diagnosis', 'hospital_stay', 'moderate'),

-- Surgery Complications
('Hypothermia', 'Low body temperature during pediatric surgery', 'diagnosis', 'surgery', 'moderate'),
('Airway Complications', 'Breathing tube complications during surgery', 'diagnosis', 'surgery', 'severe'),
('Blood Loss', 'Excessive bleeding during pediatric surgery', 'diagnosis', 'surgery', 'severe'),
('Medication Errors', 'Dosing errors in pediatric patients', 'diagnosis', 'surgery', 'moderate'),

-- Post-Surgery Complications
('Growth Disturbances', 'Interference with normal growth patterns', 'diagnosis', 'post_surgery', 'moderate'),
('Developmental Delays', 'Delays in developmental milestones', 'diagnosis', 'post_surgery', 'moderate'),
('Recurrence', 'Return of the original condition', 'diagnosis', 'post_surgery', 'moderate'),
('Scarring', 'Excessive scar formation in pediatric patients', 'diagnosis', 'post_surgery', 'mild');

-- Urosurgery Complications
INSERT INTO complications (name, description, source_type, timing, severity) VALUES
-- Hospital Stay Complications
('Acute Kidney Injury', 'Temporary kidney dysfunction during hospital stay', 'diagnosis', 'hospital_stay', 'severe'),
('Urinary Tract Infection', 'UTI during hospitalization', 'diagnosis', 'hospital_stay', 'moderate'),
('Hematuria', 'Blood in urine during hospital stay', 'diagnosis', 'hospital_stay', 'mild'),
('Bladder Spasms', 'Painful bladder contractions during hospitalization', 'diagnosis', 'hospital_stay', 'moderate'),

-- Surgery Complications
('Ureteral Injury', 'Damage to ureters during surgery', 'diagnosis', 'surgery', 'severe'),
('Bladder Perforation', 'Accidental perforation of bladder', 'diagnosis', 'surgery', 'moderate'),
('Rectal Injury', 'Damage to rectum during urological surgery', 'diagnosis', 'surgery', 'severe'),
('Erectile Dysfunction', 'Loss of erectile function post-surgery', 'diagnosis', 'surgery', 'moderate'),

-- Post-Surgery Complications
('Urinary Incontinence', 'Loss of bladder control after surgery', 'diagnosis', 'post_surgery', 'moderate'),
('Stricture Formation', 'Narrowing of urinary passages', 'diagnosis', 'post_surgery', 'moderate'),
('Chronic Kidney Disease', 'Progressive kidney dysfunction', 'diagnosis', 'post_surgery', 'severe'),
('Stone Recurrence', 'Formation of new kidney stones', 'diagnosis', 'post_surgery', 'moderate');

-- Plastic Surgery Complications
INSERT INTO complications (name, description, source_type, timing, severity) VALUES
-- Hospital Stay Complications
('Seroma Formation', 'Fluid collection under skin during hospital stay', 'diagnosis', 'hospital_stay', 'mild'),
('Hematoma', 'Blood collection under skin during hospitalization', 'diagnosis', 'hospital_stay', 'moderate'),
('Skin Necrosis', 'Death of skin tissue during hospital stay', 'diagnosis', 'hospital_stay', 'severe'),
('Allergic Reactions', 'Allergic reactions to materials during hospitalization', 'diagnosis', 'hospital_stay', 'moderate'),

-- Surgery Complications
('Flap Failure', 'Failure of tissue flap during surgery', 'diagnosis', 'surgery', 'severe'),
('Graft Rejection', 'Rejection of skin graft during procedure', 'diagnosis', 'surgery', 'severe'),
('Asymmetry', 'Uneven results during reconstructive surgery', 'diagnosis', 'surgery', 'mild'),
('Color Mismatch', 'Poor color matching of reconstructed tissue', 'diagnosis', 'surgery', 'mild'),

-- Post-Surgery Complications
('Hypertrophic Scarring', 'Excessive scar formation after surgery', 'diagnosis', 'post_surgery', 'moderate'),
('Contractures', 'Tightening of skin and underlying tissues', 'diagnosis', 'post_surgery', 'moderate'),
('Sensory Loss', 'Loss of sensation in reconstructed areas', 'diagnosis', 'post_surgery', 'moderate'),
('Need for Revision', 'Requirement for additional corrective surgery', 'diagnosis', 'post_surgery', 'moderate');

-- Gynecology & Obstetrics Complications
INSERT INTO complications (name, description, source_type, timing, severity) VALUES
-- Hospital Stay Complications
('Postpartum Hemorrhage', 'Excessive bleeding after delivery', 'diagnosis', 'hospital_stay', 'severe'),
('Preeclampsia', 'High blood pressure during pregnancy/hospital stay', 'diagnosis', 'hospital_stay', 'severe'),
('Thromboembolism', 'Blood clots during hospital stay', 'diagnosis', 'hospital_stay', 'severe'),
('Infection', 'Post-delivery or post-surgical infection', 'diagnosis', 'hospital_stay', 'moderate'),

-- Surgery Complications
('Uterine Perforation', 'Accidental perforation of uterus during surgery', 'diagnosis', 'surgery', 'severe'),
('Bowel Injury', 'Damage to bowel during gynecological surgery', 'diagnosis', 'surgery', 'severe'),
('Bladder Injury', 'Damage to bladder during surgery', 'diagnosis', 'surgery', 'moderate'),
('Cervical Laceration', 'Tears in cervix during surgical procedure', 'diagnosis', 'surgery', 'moderate'),

-- Post-Surgery Complications
('Pelvic Organ Prolapse', 'Descent of pelvic organs after surgery', 'diagnosis', 'post_surgery', 'moderate'),
('Chronic Pelvic Pain', 'Persistent pelvic pain after surgery', 'diagnosis', 'post_surgery', 'moderate'),
('Infertility', 'Inability to conceive after surgery', 'diagnosis', 'post_surgery', 'severe'),
('Hormonal Imbalance', 'Disruption of hormonal function post-surgery', 'diagnosis', 'post_surgery', 'moderate');

-- Create a view to easily see diagnoses with their complications
CREATE OR REPLACE VIEW diagnosis_complications_view AS
SELECT 
    d.id as diagnosis_id,
    d.name as diagnosis_name,
    d.specialty,
    c.name as complication_name,
    c.timing,
    c.severity,
    c.description as complication_description
FROM diagnoses d
CROSS JOIN complications c
WHERE d.requires_surgery = TRUE
ORDER BY d.specialty, d.name, c.timing, c.severity;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_diagnoses_specialty ON diagnoses(specialty);
CREATE INDEX IF NOT EXISTS idx_complications_timing ON complications(timing);
CREATE INDEX IF NOT EXISTS idx_complications_severity ON complications(severity);

-- Display summary
SELECT 
    specialty,
    COUNT(*) as diagnosis_count
FROM diagnoses 
WHERE requires_surgery = TRUE 
GROUP BY specialty
ORDER BY specialty; 