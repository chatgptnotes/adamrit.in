import { supabase } from '../client';

// Types
export interface Complication {
  id?: string;
  name: string;
  description?: string;
  source_type: 'diagnosis' | 'surgery';
  source_id: string; // ID of the diagnosis or surgery
}

export interface PatientComplication {
  id?: string;
  patient_id: string;
  complication_id: string;
  source_type: 'diagnosis' | 'surgery';
  source_instance_id: string; // ID of the patient_diagnoses or patient_surgeries
}

// Get all complications for a specific diagnosis or surgery
export async function getComplicationsForSource(sourceType: 'diagnosis' | 'surgery', sourceId: string) {
  const { data, error } = await supabase
    .from('complications')
    .select('*')
    .eq('source_type', sourceType)
    .eq('source_id', sourceId)
    .order('name');
  
  if (error) {
    console.error(`Error fetching complications for ${sourceType} ID ${sourceId}:`, error);
    throw error;
  }
  
  return data;
}

// Get a complication by ID
export async function getComplicationById(id: string) {
  const { data, error } = await supabase
    .from('complications')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching complication with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

// Create a new complication
export async function createComplication(complication: Complication) {
  const { data, error } = await supabase
    .from('complications')
    .insert([complication])
    .select();
  
  if (error) {
    console.error('Error creating complication:', error);
    throw error;
  }
  
  return data[0];
}

// Update a complication
export async function updateComplication(id: string, updates: Partial<Complication>) {
  const { data, error } = await supabase
    .from('complications')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating complication with ID ${id}:`, error);
    throw error;
  }
  
  return data[0];
}

// Delete a complication
export async function deleteComplication(id: string) {
  const { error } = await supabase
    .from('complications')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting complication with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Get all complications for a patient for a specific diagnosis or surgery
export async function getPatientComplications(
  patientId: string, 
  sourceType: 'diagnosis' | 'surgery', 
  sourceInstanceId: string
) {
  const { data, error } = await supabase
    .from('patient_complications')
    .select(`
      *,
      complication:complications(*)
    `)
    .eq('patient_id', patientId)
    .eq('source_type', sourceType)
    .eq('source_instance_id', sourceInstanceId);
  
  if (error) {
    console.error(`Error fetching complications for patient ${patientId}:`, error);
    throw error;
  }
  
  return data;
}

// Get all complications for a patient
export async function getAllPatientComplications(patientId: string) {
  const { data, error } = await supabase
    .from('patient_complications')
    .select(`
      *,
      complication:complications(*)
    `)
    .eq('patient_id', patientId);
  
  if (error) {
    console.error(`Error fetching all complications for patient ${patientId}:`, error);
    throw error;
  }
  
  return data;
}

// Add a complication to a patient
export async function addComplicationToPatient(patientComplication: PatientComplication) {
  const { data, error } = await supabase
    .from('patient_complications')
    .insert([patientComplication])
    .select();
  
  if (error) {
    console.error('Error adding complication to patient:', error);
    throw error;
  }
  
  return data[0];
}

// Remove a complication from a patient
export async function removePatientComplication(id: string) {
  const { error } = await supabase
    .from('patient_complications')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error removing complication from patient with ID ${id}:`, error);
    throw error;
  }
  
  return true;
} 