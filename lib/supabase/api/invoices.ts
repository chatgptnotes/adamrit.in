import { supabase } from '../client';

// Types
export interface Invoice {
  id?: string;
  invoice_number?: string;
  patient_id: string;
  invoice_date: string;
  total_amount: number;
  discount_amount?: number;
  tax_amount?: number;
  final_amount: number;
  status?: string;
  notes?: string;
}

export interface InvoiceItem {
  id?: string;
  invoice_id: string;
  item_type: string;
  item_id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Get all invoices for a patient
export async function getPatientInvoices(patientId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('patient_id', patientId)
    .order('invoice_date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching invoices for patient ${patientId}:`, error);
    throw error;
  }
  
  return data;
}

// Get an invoice by ID with all its items
export async function getInvoiceById(id: string) {
  // Get the invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();
  
  if (invoiceError) {
    console.error(`Error fetching invoice with ID ${id}:`, invoiceError);
    throw invoiceError;
  }
  
  // Get the invoice items
  const { data: items, error: itemsError } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', id)
    .order('id');
  
  if (itemsError) {
    console.error(`Error fetching items for invoice ${id}:`, itemsError);
    throw itemsError;
  }
  
  return {
    ...invoice,
    items: items || []
  };
}

// Create a new invoice with items
export async function createInvoice(invoice: Invoice, items: Omit<InvoiceItem, 'invoice_id'>[]) {
  // Generate a unique invoice number if not provided
  if (!invoice.invoice_number) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    invoice.invoice_number = `INV-${dateStr}-${randomStr}`;
  }
  
  // Insert the invoice
  const { data: newInvoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert([invoice])
    .select();
  
  if (invoiceError) {
    console.error('Error creating invoice:', invoiceError);
    throw invoiceError;
  }
  
  if (!newInvoice || newInvoice.length === 0) {
    throw new Error('Failed to create invoice');
  }
  
  // Add items with the new invoice ID
  const itemsWithInvoiceId = items.map(item => ({
    ...item,
    invoice_id: newInvoice[0].id
  }));
  
  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(itemsWithInvoiceId);
  
  if (itemsError) {
    console.error('Error adding invoice items:', itemsError);
    throw itemsError;
  }
  
  return newInvoice[0];
}

// Update an invoice
export async function updateInvoice(id: string, updates: Partial<Invoice>) {
  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating invoice with ID ${id}:`, error);
    throw error;
  }
  
  return data[0];
}

// Delete an invoice (this will cascade delete all items due to our schema)
export async function deleteInvoice(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting invoice with ID ${id}:`, error);
    throw error;
  }
  
  return true;
}

// Add an item to an invoice
export async function addInvoiceItem(item: InvoiceItem) {
  const { data, error } = await supabase
    .from('invoice_items')
    .insert([item])
    .select();
  
  if (error) {
    console.error('Error adding invoice item:', error);
    throw error;
  }
  
  return data[0];
}

// Update an invoice item
export async function updateInvoiceItem(id: string, updates: Partial<InvoiceItem>) {
  const { data, error } = await supabase
    .from('invoice_items')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error(`Error updating invoice item with ID ${id}:`, error);
    throw error;
  }
  
  return data[0];
}

// Delete an invoice item
export async function deleteInvoiceItem(id: string) {
  const { error } = await supabase
    .from('invoice_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting invoice item with ID ${id}:`, error);
    throw error;
  }
  
  return true;
} 