// Export Supabase client
export { supabase } from './client';

// Export all patient-related functions
export * from './api/patients';

// Export all diagnosis-related functions
export * from './api/diagnoses';

// Export all surgery-related functions
export * from './api/surgeries';

// Export all complication-related functions
export * from './api/complications';

// Export all invoice-related functions
export * from './api/invoices';

// This file makes it easy to import all Supabase functions from a single place
// Example: import { getAllPatients, createPatient } from '@/lib/supabase';
