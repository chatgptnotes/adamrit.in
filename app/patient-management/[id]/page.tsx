'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PatientDashboard } from '@/components/patient-dashboard';
import { supabase } from '@/lib/supabase/client';

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [patient, setPatient] = useState<any>(null);
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
          setError('Unable to load patient data');
          setLoading(false);
          return;
        }

        if (!patientData) {
          setError('Patient not found');
          setLoading(false);
          return;
        }

        // Fetch the latest visit for this patient
        const { data: latestVisit } = await supabase
          .from('visits')
          .select('*')
          .eq('patient_unique_id', patientData.unique_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Combine patient data with latest visit information
        const patientWithVisit = {
          ...patientData,
          latestVisit: latestVisit || null
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
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">Loading patient data...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
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
