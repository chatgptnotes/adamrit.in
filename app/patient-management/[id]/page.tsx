'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PatientDashboard } from '@/components/patient-dashboard';
import { supabase } from '@/lib/supabase/client';
import type { Patient } from '@/lib/supabase/api/patients';

export default function Page() {
  const params = useParams();
  // Early return if no params
  if (!params?.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">Invalid patient ID</p>
          </div>
        </div>
      </div>
    );
  }

  const id = params.id as string;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPatientData() {
      try {
        // Fetch patient data
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', id)
          .single();

        if (patientError) {
          console.error('Error fetching patient:', patientError);
          setError('Unable to load patient data');
          setLoading(false);
          return;
        }

        if (!patientData || !patientData.id) {
          setError('Patient not found or invalid data');
          setLoading(false);
          return;
        }

        // Ensure all required fields are present with defaults
        const patientWithDefaults = {
          ...patientData,
          patient_id: patientData.patient_id || patientData.id,
          unique_id: patientData.unique_id || patientData.id,
          patient_unique_id: patientData.patient_unique_id || patientData.unique_id || patientData.id,
          name: patientData.name || 'Unknown',
          age: patientData.age || 0,
          gender: patientData.gender || 'Unknown',
          registration_date: patientData.registration_date || new Date().toISOString().split('T')[0]
        };

        // Fetch the latest visit for this patient
        const { data: latestVisit, error: visitError } = await supabase
          .from('visits')
          .select('*')
          .eq('patient_unique_id', patientWithDefaults.unique_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (visitError) {
          console.error('Error fetching latest visit:', visitError);
        }

        // Combine patient data with latest visit information
        const patientWithVisit: Patient = {
          id: patientWithDefaults.id,
          patient_id: patientWithDefaults.patient_id,
          unique_id: patientWithDefaults.unique_id,
          patient_unique_id: patientWithDefaults.patient_unique_id,
          name: patientWithDefaults.name,
          age: patientWithDefaults.age,
          gender: patientWithDefaults.gender,
          registration_date: patientWithDefaults.registration_date,
          phone: patientWithDefaults.phone,
          address: patientWithDefaults.address,
          insurance_status: patientWithDefaults.insurance_status,
          last_visit_date: patientWithDefaults.last_visit_date,
          date_of_admission: patientWithDefaults.date_of_admission,
          date_of_discharge: patientWithDefaults.date_of_discharge,
          corporate: patientWithDefaults.corporate,
          latestVisit: latestVisit ? {
            visit_id: latestVisit.visit_id,
            patient_unique_id: latestVisit.patient_unique_id,
            visit_date: latestVisit.visit_date,
            visit_type: latestVisit.visit_type,
            reason: latestVisit.visit_reason,
            department: latestVisit.department,
            doctor_name: latestVisit.appointment_with,
            notes: latestVisit.notes,
            created_at: latestVisit.created_at
          } : null
        };

        setPatient(patientWithVisit);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    }

    fetchPatientData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading patient data...</h2>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{error || 'Patient not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <PatientDashboard patient={patient} />
    </div>
  );
}
