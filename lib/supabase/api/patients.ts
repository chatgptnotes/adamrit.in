import { supabase } from '../client';
import { withErrorHandler, APIError } from '@/lib/utils/error-handler';

// Types
export interface Patient {
  id: string;
  patient_id: string;
  unique_id: string;
  patient_unique_id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  address?: string;
  insurance_status?: string;
  registration_date: string;
  last_visit_date?: string;
  date_of_admission?: string;
  date_of_discharge?: string;
  corporate?: string;
  latestVisit?: {
    visit_id: string;
    patient_unique_id: string;
    visit_date: string;
    visit_type?: string;
    reason?: string;
    department?: string;
    doctor_name?: string;
    notes?: string;
    created_at: string;
  } | null;
}

// Get all patients
export async function getAllPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
  
  return data;
}

// Get a patient by ID
export async function getPatient(id: string) {
  return withErrorHandler(
    Promise.resolve(
      supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()
    ).then(({ data, error }) => {
      if (error) throw new APIError(error.message);
      if (!data) throw new APIError('Patient not found');

      // Ensure all required fields are present with defaults
      const patientWithDefaults = {
        ...data,
        patient_id: data.patient_id || data.id,
        unique_id: data.unique_id || data.id,
        patient_unique_id: data.patient_unique_id || data.unique_id || data.id,
        name: data.name || 'Unknown',
        age: data.age || 0,
        gender: data.gender || 'Unknown',
        registration_date: data.registration_date || new Date().toISOString().split('T')[0]
      };

      return patientWithDefaults;
    })
  );
}

// Create a new patient
export async function createPatient(patient: Patient) {
  // If no patient_id is provided, we'll let the database generate one
  // based on the function we created in schema.sql
  const patientData = { ...patient };
  if (!patientData.patient_id) {
    // Call our custom function to generate a patient ID
    const { data: idData, error: idError } = await supabase
      .rpc('generate_patient_id');
    
    if (idError) {
      console.error('Error generating patient ID:', idError);
      throw idError;
    }
    
    patientData.patient_id = idData;
  }
  
  const { data, error } = await supabase
    .from('patients')
    .insert([patientData])
    .select();
  
  if (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
  
  return data[0];
}

// Update a patient
export async function updatePatient(id: string, updates: Partial<Patient>) {
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating patient with ID ${id}:`, error);
    throw error;
  }
  
  return data[0];
}

// Delete a patient
export async function deletePatient(id: string) {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting patient with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Search patients
export async function searchPatients(query: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .or(`name.ilike.%${query}%, patient_id.ilike.%${query}%, phone.ilike.%${query}%`);
  
  if (error) {
    console.error('Error searching patients:', error);
    throw error;
  }
  
  return data;
} 