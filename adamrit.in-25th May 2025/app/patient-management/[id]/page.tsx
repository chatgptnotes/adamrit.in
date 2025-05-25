// Import PatientDashboard from a separate file and export it as default
import { PatientDashboard } from '@/components/patient-dashboard';
import { supabase } from '@/lib/supabase/client';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Await params to fix Next.js 15 error
  const { id } = await params;
  
  // Fetch patient data from Supabase
  const { data: patient, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching patient:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Patient</h2>
            <p className="text-gray-600">Unable to load patient data. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-gray-400 text-5xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Not Found</h2>
            <p className="text-gray-600">The requested patient could not be found.</p>
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
