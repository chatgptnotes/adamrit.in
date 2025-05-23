// Import PatientDashboard from a separate file and export it as default
import { PatientDashboard } from '@/components/patient-dashboard';
import { supabase } from '@/lib/supabase/client';

export default async function Page({ params }: { params: { id: string } }) {
  // Fetch patient data from Supabase
  const { data: patient, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('Error fetching patient:', error);
    return <div>Error loading patient data</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return <PatientDashboard patient={patient} />;
}
