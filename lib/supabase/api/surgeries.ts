import { supabase } from '../client';

// Types
export interface Surgery {
  id?: string;
  name: string;
  description?: string;
  package_amount?: number;
}

export interface PatientSurgery {
  id?: string;
  patient_id: string;
  surgery_id: string;
  surgery_date: string;
  surgeon_id?: string;
  anesthetist_id?: string;
  notes?: string;
  package_amount?: number;
  discount_percentage?: number;
}

// Get all surgeries from the master list
export async function getAllSurgeries() {
  const { data, error } = await supabase
    .from('surgeries')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching surgeries:', error);
    throw error;
  }
  
  return data;
}

// Get a surgery by ID
export async function getSurgeryById(id: string) {
  const { data, error } = await supabase
    .from('surgeries')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching surgery with ID ${id}:`, error);
    throw error;
  }
  
  return data;
}

// Create a new surgery
export async function createSurgery(surgery: Surgery) {
  const { data, error } = await supabase
    .from('surgeries')
    .insert([surgery])
    .select();
  
  if (error) {
    console.error('Error creating surgery:', error);
    throw error;
  }
  
  return data[0];
}

// Update a surgery
export async function updateSurgery(id: string, updates: Partial<Surgery>) {
  const { data, error } = await supabase
    .from('surgeries')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating surgery with ID ${id}:`, error);
    throw error;
  }
  
  return data[0];
}

// Delete a surgery
export async function deleteSurgery(id: string) {
  const { error } = await supabase
    .from('surgeries')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting surgery with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Get all surgeries for a patient
export async function getPatientSurgeries(patientId: string) {
  const { data, error } = await supabase
    .from('patient_surgeries')
    .select(`
      *,
      surgery:surgeries(*),
      surgeon:medical_staff!surgeon_id(*),
      anesthetist:medical_staff!anesthetist_id(*)
    `)
    .eq('patient_id', patientId)
    .order('surgery_date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching surgeries for patient ${patientId}:`, error);
    throw error;
  }
  
  return data;
}

// Add a surgery to a patient
export async function addSurgeryToPatient(patientSurgery: PatientSurgery) {
  const { data, error } = await supabase
    .from('patient_surgeries')
    .insert([patientSurgery])
    .select();
  
  if (error) {
    console.error('Error adding surgery to patient:', error);
    throw error;
  }
  
  return data[0];
}

// Update a patient's surgery
export async function updatePatientSurgery(id: string, updates: Partial<PatientSurgery>) {
  const { data, error } = await supabase
    .from('patient_surgeries')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating patient surgery with ID ${id}:`, error);
    throw error;
  }
  
  return data[0];
}

// Remove a surgery from a patient
export async function removePatientSurgery(id: string) {
  const { error } = await supabase
    .from('patient_surgeries')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error removing surgery from patient with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Search surgeries
export async function searchSurgeries(query: string) {
  const { data, error } = await supabase
    .from('surgeries')
    .select('*')
    .ilike('name', `%${query}%`);
  
  if (error) {
    console.error('Error searching surgeries:', error);
    throw error;
  }
  
  return data;
} 