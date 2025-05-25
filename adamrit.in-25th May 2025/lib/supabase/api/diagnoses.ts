import { supabase } from '../client';

// Types
export interface Diagnosis {
  id?: string;
  name: string;
  description?: string;
  icd_code?: string;
  is_approved?: boolean;
}

export interface PatientDiagnosis {
  id?: string;
  patient_id: string;
  diagnosis_id: string;
  diagnosis_date: string;
  is_approved?: boolean;
  doctor_id?: string;
  notes?: string;
}

export interface ClinicalNotes {
  id?: string;
  patient_diagnosis_id: string;
  findings?: string;
  history?: string;
  examination?: string;
}

// Get all diagnoses from the master list
export async function getAllDiagnoses() {
  const { data, error } = await supabase
    .from('diagnoses')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching diagnoses:', error);
    throw error;
  }
  
  return data;
}

// Get a diagnosis by ID
export async function getDiagnosisById(id: string) {
  const { data, error } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching diagnosis with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

// Create a new diagnosis
export async function createDiagnosis(diagnosis: Diagnosis) {
  const { data, error } = await supabase
    .from('diagnoses')
    .insert([diagnosis])
    .select();
  
  if (error) {
    console.error('Error creating diagnosis:', error);
    throw error;
  }
  
  return data[0];
}

// Update a diagnosis
export async function updateDiagnosis(id: string, updates: Partial<Diagnosis>) {
  const { data, error } = await supabase
    .from('diagnoses')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating diagnosis with ID ${id}:`, error);
    throw error;
  }
  
  return data[0];
}

// Delete a diagnosis
export async function deleteDiagnosis(id: string) {
  const { error } = await supabase
    .from('diagnoses')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting diagnosis with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Get all diagnoses for a patient
export async function getPatientDiagnoses(patientId: string) {
  const { data, error } = await supabase
    .from('patient_diagnoses')
    .select(`
      *,
      diagnosis:diagnoses(*),
      doctor:medical_staff(*)
    `)
    .eq('patient_id', patientId)
    .order('diagnosis_date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching diagnoses for patient ${patientId}:`, error);
    throw error;
  }
  
  return data;
}

// Add a diagnosis to a patient
export async function addDiagnosisToPatient(patientDiagnosis: PatientDiagnosis) {
  const { data, error } = await supabase
    .from('patient_diagnoses')
    .insert([patientDiagnosis])
    .select();
  
  if (error) {
    console.error('Error adding diagnosis to patient:', error);
    throw error;
  }
  
  return data[0];
}

// Update a patient's diagnosis
export async function updatePatientDiagnosis(id: string, updates: Partial<PatientDiagnosis>) {
  const { data, error } = await supabase
    .from('patient_diagnoses')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating patient diagnosis with ID ${id}:`, error);
    throw error;
  }
  
  return data[0];
}

// Remove a diagnosis from a patient
export async function removePatientDiagnosis(id: string) {
  const { error } = await supabase
    .from('patient_diagnoses')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error removing diagnosis from patient with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Get clinical notes for a patient diagnosis
export async function getClinicalNotes(patientDiagnosisId: string) {
  const { data, error } = await supabase
    .from('clinical_notes')
    .select('*')
    .eq('patient_diagnosis_id', patientDiagnosisId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned" which means no notes yet
    console.error(`Error fetching clinical notes for patient diagnosis ${patientDiagnosisId}:`, error);
    throw error;
  }
  
  return data;
}

// Create or update clinical notes for a patient diagnosis
export async function saveClinicalNotes(notes: ClinicalNotes) {
  // Check if notes already exist
  const { data: existingNotes, error: checkError } = await supabase
    .from('clinical_notes')
    .select('id')
    .eq('patient_diagnosis_id', notes.patient_diagnosis_id);
  
  if (checkError) {
    console.error('Error checking for existing notes:', checkError);
    throw checkError;
  }
  
  let result;
  
  if (existingNotes && existingNotes.length > 0) {
    // Update existing notes
    const { data, error } = await supabase
      .from('clinical_notes')
      .update({
        findings: notes.findings,
        history: notes.history,
        examination: notes.examination
      })
      .eq('patient_diagnosis_id', notes.patient_diagnosis_id)
      .select();
    
    if (error) {
      console.error('Error updating clinical notes:', error);
      throw error;
    }
    
    result = data[0];
  } else {
    // Create new notes
    const { data, error } = await supabase
      .from('clinical_notes')
      .insert([notes])
      .select();
    
    if (error) {
      console.error('Error creating clinical notes:', error);
      throw error;
    }
    
    result = data[0];
  }
  
  return result;
}

// Search diagnoses
export async function searchDiagnoses(query: string) {
  const { data, error } = await supabase
    .from('diagnoses')
    .select('*')
    .or(`name.ilike.%${query}%, icd_code.ilike.%${query}%`);
  
  if (error) {
    console.error('Error searching diagnoses:', error);
    throw error;
  }
  
  return data;
} 