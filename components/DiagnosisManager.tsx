"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  X,
  AlertTriangle,
  Package,
  Stethoscope,
  Activity,
  CheckCircle2,
  Clock,
  Eye,
  Save,
  Receipt,
  Edit2,
  Trash2
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Types
interface Diagnosis {
  id: string;
  name: string;
  complication1?: string;
  complication2?: string;
  complication3?: string;
  complication4?: string;
}

interface Package {
  id: string;
  name: string;
  code: string;
  amount: string;
  complication1?: string;
  complication2?: string;
}

interface Complication {
  id: number;
  complication_code: string;
  name: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  category: string;
  is_active: boolean;
}

interface PatientDiagnosis {
  id: number;
  diagnosis: Diagnosis;
  status: 'active' | 'resolved' | 'chronic';
  diagnosed_date: string;
  notes: string;
}

interface PatientComplication {
  id: number;
  complication: Complication;
  diagnosis_id?: number;
  status: 'active' | 'resolved' | 'monitoring';
  occurred_date: string;
  notes: string;
}

interface DiagnosisManagerProps {
  patientUniqueId: string;
  visitId?: string;
  onDiagnosesChange?: (diagnoses: PatientDiagnosis[]) => void;
}

export function DiagnosisManager({ patientUniqueId, visitId, onDiagnosesChange }: DiagnosisManagerProps) {
  // State management
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [surgeries, setSurgeries] = useState<Package[]>([]);
  const [complications, setComplications] = useState<Complication[]>([]);
  const [relatedComplications, setRelatedComplications] = useState<Complication[]>([]);
  
  const [patientDiagnoses, setPatientDiagnoses] = useState<PatientDiagnosis[]>([]);
  const [patientComplications, setPatientComplications] = useState<PatientComplication[]>([]);
  const [selectedSurgeries, setSelectedSurgeries] = useState<Package[]>([]);
  
  // Search and selection states
  const [diagnosisSearch, setDiagnosisSearch] = useState('');
  const [surgerySearch, setSurgerySearch] = useState('');
  const [complicationSearch, setComplicationSearch] = useState('');
  const [showDiagnosisResults, setShowDiagnosisResults] = useState(false);
  const [showSurgeryResults, setShowSurgeryResults] = useState(false);
  const [showComplicationResults, setShowComplicationResults] = useState(false);
  
  // Dialog states
  const [showAddDiagnosisDialog, setShowAddDiagnosisDialog] = useState(false);
  const [showAddSurgeryDialog, setShowAddSurgeryDialog] = useState(false);
  const [showAddComplicationDialog, setShowAddComplicationDialog] = useState(false);
  
  // Billing state
  const [billingId, setBillingId] = useState<number | null>(null);
  const [isSavingToBilling, setIsSavingToBilling] = useState(false);
  const [existingBillingRecords, setExistingBillingRecords] = useState<any[]>([]);
  const [isLoadingPatientData, setIsLoadingPatientData] = useState(true);
  
  // Form states
  const [newDiagnosis, setNewDiagnosis] = useState({
    name: '',
    complication1: '',
    complication2: '',
    complication3: '',
    complication4: ''
  });
  
  const [newSurgery, setNewSurgery] = useState({
    surgery_name: '',
    description: '',
    cghs_code: '',
    amount: '',
    category: '',
    duration_days: ''
  });
  
  const [newComplication, setNewComplication] = useState({
    complication_code: '',
    name: '',
    description: '',
    severity: 'mild' as const,
    category: ''
  });

  // Refs for click outside detection
  const diagnosisSearchRef = useRef<HTMLDivElement>(null);
  const surgerySearchRef = useRef<HTMLDivElement>(null);
  const complicationSearchRef = useRef<HTMLDivElement>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchDiagnoses();
    fetchSurgeries();
    fetchComplications();
    fetchPatientData();
  }, [patientUniqueId]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (diagnosisSearchRef.current && !diagnosisSearchRef.current.contains(event.target as Node)) {
        setShowDiagnosisResults(false);
      }
      if (surgerySearchRef.current && !surgerySearchRef.current.contains(event.target as Node)) {
        setShowSurgeryResults(false);
      }
      if (complicationSearchRef.current && !complicationSearchRef.current.contains(event.target as Node)) {
        setShowComplicationResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notify parent component when diagnoses change
  useEffect(() => {
    if (onDiagnosesChange) {
      onDiagnosesChange(patientDiagnoses);
    }
  }, [patientDiagnoses, onDiagnosesChange]);

  // Fetch functions
  const fetchDiagnoses = async () => {
    try {
      const { data, error } = await supabase
        .from('diagnosis')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setDiagnoses(data || []);
    } catch (error) {
      console.error('Error fetching diagnoses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch diagnoses",
        variant: "destructive"
      });
    }
  };

  const fetchSurgeries = async () => {
    try {
      const { data, error } = await supabase
        .from('cghs_surgery')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setSurgeries(data || []);
    } catch (error) {
      console.error('Error fetching surgeries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch surgeries",
        variant: "destructive"
      });
    }
  };

  const fetchComplications = async () => {
    try {
      const { data, error } = await supabase
        .from('complications')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.log('Complications table not available:', error.message);
        setComplications([]);
        return;
      }
      
      setComplications(data || []);
    } catch (error) {
      console.log('Complications table not yet set up, using empty state');
      setComplications([]);
    }
  };

  const fetchPatientData = async () => {
    setIsLoadingPatientData(true);
    try {
      // Fetch existing billing records for this patient
      const { data: billingData, error: billingError } = await supabase
        .from('patient_billing')
        .select('*')
        .eq('patient_unique_id', patientUniqueId)
        .order('created_at', { ascending: false });

      if (!billingError && billingData && Array.isArray(billingData)) {
        setExistingBillingRecords(billingData);
        
        // For now, just show billing history without fetching detailed data
        // This prevents React rendering errors until billing tables are fully configured
        console.log(`Found ${billingData.length} billing records for patient`);
        
        // Set empty states for now
        setPatientDiagnoses([]);
        setSelectedSurgeries([]);
        setPatientComplications([]);
      } else {
        console.log('No existing billing records found for patient or billing tables not set up');
        setExistingBillingRecords([]);
        setPatientDiagnoses([]);
        setSelectedSurgeries([]);
        setPatientComplications([]);
      }

    } catch (error) {
      console.log('Billing tables not yet set up, starting with empty state');
      setExistingBillingRecords([]);
      setPatientDiagnoses([]);
      setSelectedSurgeries([]);
      setPatientComplications([]);
    } finally {
      setIsLoadingPatientData(false);
    }
  };

  // Filter functions for search
  const filteredDiagnoses = diagnoses.filter(diagnosis =>
    diagnosis.name.toLowerCase().includes(diagnosisSearch.toLowerCase())
  );

  const filteredSurgeries = surgeries.filter(surgery =>
    surgery.name.toLowerCase().includes(surgerySearch.toLowerCase()) ||
    surgery.code.toLowerCase().includes(surgerySearch.toLowerCase())
  );

  const filteredComplications = complications.filter(complication =>
    complication.name.toLowerCase().includes(complicationSearch.toLowerCase()) ||
    complication.category.toLowerCase().includes(complicationSearch.toLowerCase()) ||
    complication.severity.toLowerCase().includes(complicationSearch.toLowerCase())
  );

  // Add functions
  const addDiagnosisToPatient = async (diagnosis: Diagnosis) => {
    try {
      // Check if diagnosis already added
      if (patientDiagnoses.find(d => d.diagnosis.id === diagnosis.id)) {
        toast({
          title: "Already added",
          description: "This diagnosis is already in the patient's record",
          variant: "destructive"
        });
        return;
      }

      // For now, store in local state (until patient_diagnosis table is created)
      const newPatientDiagnosis: PatientDiagnosis = {
        id: Date.now(), // temporary ID
        diagnosis: diagnosis,
        status: 'active',
        diagnosed_date: new Date().toISOString().split('T')[0],
        notes: ''
      };
      
      setPatientDiagnoses(prev => [newPatientDiagnosis, ...prev]);
      setDiagnosisSearch('');
      setShowDiagnosisResults(false);
      
      // Fetch related complications
      fetchRelatedComplications([diagnosis.id]);
      
      toast({
        title: "Success",
        description: `Added diagnosis: ${diagnosis.name}`
      });
    } catch (error) {
      console.error('Error adding diagnosis:', error);
      toast({
        title: "Error",
        description: "Failed to add diagnosis",
        variant: "destructive"
      });
    }
  };

  const addSurgeryToPatient = async (surgery: Package) => {
    if (selectedSurgeries.find(s => s.id === surgery.id)) {
      toast({
        title: "Surgery already added",
        description: "This surgery is already selected",
        variant: "destructive"
      });
      return;
    }

    setSelectedSurgeries(prev => [...prev, surgery]);
    setSurgerySearch('');
    setShowSurgeryResults(false);
    
    toast({
      title: "Success",
      description: `Added surgery: ${surgery.name}`
    });
  };

  const addComplicationToPatient = async (complication: Complication, diagnosisId?: number) => {
    try {
      // Check if complication already added
      if (patientComplications.find(c => c.complication.id === complication.id)) {
        toast({
          title: "Already added",
          description: "This complication is already in the patient's record",
          variant: "destructive"
        });
        return;
      }

      // For now, store in local state (until patient_complications table is created)
      const newPatientComplication: PatientComplication = {
        id: Date.now(), // temporary ID
        complication: complication,
        status: 'active',
        occurred_date: new Date().toISOString().split('T')[0],
        notes: '',
        diagnosis_id: diagnosisId
      };
      
      setPatientComplications(prev => [newPatientComplication, ...prev]);
      setComplicationSearch('');
      setShowComplicationResults(false);
      
      toast({
        title: "Success",
        description: `Added complication: ${complication.name}`
      });
    } catch (error) {
      console.error('Error adding complication:', error);
      toast({
        title: "Error",
        description: "Failed to add complication",
        variant: "destructive"
      });
    }
  };

  const fetchRelatedComplications = async (diagnosisIds: string[]) => {
    try {
      // For now, we'll extract complications directly from the diagnosis data
      const selectedDiagnosis = diagnoses.find(d => diagnosisIds.includes(d.id));
      if (selectedDiagnosis) {
        const relatedComps = [
          selectedDiagnosis.complication1,
          selectedDiagnosis.complication2,
          selectedDiagnosis.complication3,
          selectedDiagnosis.complication4
        ].filter(Boolean);
        
        // Convert to Complication objects for display
        const complicationObjects = relatedComps.map((comp, index) => ({
          id: index + 1,
          complication_code: `COMP${index + 1}`,
          name: comp!,
          description: '',
          severity: 'moderate' as const,
          category: 'Related',
          is_active: true
        }));
        
        setRelatedComplications(complicationObjects);
      }
    } catch (error) {
      console.error('Error fetching related complications:', error);
    }
  };

  // Create new diagnosis
  const createNewDiagnosis = async () => {
    try {
      const { data, error } = await supabase
        .from('diagnosis')
        .insert(newDiagnosis)
        .select()
        .single();

      if (error) throw error;
      
      setDiagnoses(prev => [...prev, data]);
      setNewDiagnosis({
        name: '',
        complication1: '',
        complication2: '',
        complication3: '',
        complication4: ''
      });
      setShowAddDiagnosisDialog(false);
      
      toast({
        title: "Success",
        description: "New diagnosis created successfully"
      });
    } catch (error) {
      console.error('Error creating diagnosis:', error);
      toast({
        title: "Error",
        description: "Failed to create diagnosis",
        variant: "destructive"
      });
    }
  };

  // Remove functions
  const removeDiagnosis = (id: number) => {
    setPatientDiagnoses(prev => prev.filter(d => d.id !== id));
    
    toast({
      title: "Success",
      description: "Diagnosis removed"
    });
  };

  const removeSurgery = (id: string) => {
    setSelectedSurgeries(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Success",
      description: "Surgery removed"
    });
  };

  const removeComplication = (id: number) => {
    setPatientComplications(prev => prev.filter(c => c.id !== id));
    
    toast({
      title: "Success",
      description: "Complication removed"
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'severe': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'chronic': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Billing functions
  const saveToBilling = async () => {
    setIsSavingToBilling(true);
    try {
      // Generate a unique bill number
      const billNumber = `BL${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Date.now()}`;
      
      // Create the main billing record
      const { data: billingData, error: billingError } = await supabase
        .from('patient_billing')
        .insert({
          patient_unique_id: patientUniqueId,
          visit_id: visitId || `VISIT-${Date.now()}`,
          bill_number: billNumber,
          patient_name: 'Patient Name', // You can get this from patient data
          bill_date: new Date().toISOString().split('T')[0],
          status: 'draft',
          primary_diagnosis: patientDiagnoses.map(d => d.diagnosis.name).join(', ')
        })
        .select()
        .single();

      if (billingError) throw billingError;
      
      const billingIdLocal = billingData.id;
      setBillingId(billingIdLocal);

      // Save selected diagnoses to billing
      if (patientDiagnoses.length > 0) {
        const diagnosesToSave = patientDiagnoses.map(d => ({
          billing_id: billingIdLocal,
          patient_unique_id: patientUniqueId,
          diagnosis_id: d.diagnosis.id,
          diagnosis_name: d.diagnosis.name,
          status: d.status,
          diagnosed_date: d.diagnosed_date,
          notes: d.notes || ''
        }));

        const { error: diagnosisError } = await supabase
          .from('billing_diagnoses')
          .insert(diagnosesToSave);

        if (diagnosisError) throw diagnosisError;
      }

      // Save selected surgeries to billing
      if (selectedSurgeries.length > 0) {
        const surgeriesToSave = selectedSurgeries.map(s => ({
          billing_id: billingIdLocal,
          patient_unique_id: patientUniqueId,
          surgery_id: s.id,
          surgery_name: s.name,
          surgery_code: s.code,
          surgery_amount: s.amount,
          complication1: s.complication1 || '',
          complication2: s.complication2 || '',
          surgery_date: new Date().toISOString().split('T')[0]
        }));

        const { error: surgeryError } = await supabase
          .from('billing_surgeries')
          .insert(surgeriesToSave);

        if (surgeryError) throw surgeryError;
      }

      // Save complications to billing
      if (patientComplications.length > 0) {
        const complicationsToSave = patientComplications.map(c => ({
          billing_id: billingIdLocal,
          patient_unique_id: patientUniqueId,
          complication_name: c.complication.name,
          severity: c.complication.severity,
          status: c.status,
          occurred_date: c.occurred_date
        }));

        const { error: complicationError } = await supabase
          .from('billing_complications')
          .insert(complicationsToSave);

        if (complicationError) throw complicationError;
      }

      toast({
        title: "Success!",
        description: `Saved to billing (Bill #${billNumber}). All selected diagnoses, surgeries, and complications have been saved.`,
        variant: "default"
      });

    } catch (error: any) {
      console.error('Error saving to billing:', error);
      console.error('Error details:', error?.message || error?.details || JSON.stringify(error));
      
      // More specific error messages
      let errorMessage = "Failed to save to billing. ";
      if (error?.message?.includes('patient_billing') || error?.code === '42P01') {
        errorMessage += "The billing tables don't exist yet. Please run the SQL script in 'create_billing_tables.sql' in your Supabase SQL Editor.";
      } else if (error?.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Please check if billing tables are created in your database.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSavingToBilling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoadingPatientData && (
        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading patient data...</p>
          </CardContent>
        </Card>
      )}

      {/* Existing Billing Records */}
      {!isLoadingPatientData && existingBillingRecords.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700 text-base">
              <Receipt className="h-4 w-4" />
              Patient Billing History
            </CardTitle>
            <CardDescription className="text-blue-600 text-xs">
              Previously saved billing records for this patient
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {existingBillingRecords.map((record) => (
                <div key={record.id} className="bg-white p-3 rounded-lg border group hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Surgery Package as Title with Date */}
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">
                          {String(record.surgery_package || record.primary_diagnosis || 'General Consultation').toUpperCase()}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(record.bill_date || new Date()).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      
                      {/* Compact info in single line */}
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>Bill #{String(record.bill_number || '').split('-').pop()}</span>
                        <span>•</span>
                        <span>Claim: {String(record.claim_id || 'N/A')}</span>
                        {record.date_of_admission && (
                          <>
                            <span>•</span>
                            <span>Admitted: {new Date(record.date_of_admission).toLocaleDateString('en-GB')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Amount, Status and Action Buttons */}
                    <div className="flex items-start gap-2 ml-3">
                      <div className="text-right">
                        <p className="font-semibold text-green-600 text-sm">₹{String(record.total_amount || '0')}</p>
                        <Badge className={`${getStatusColor(String(record.status || 'draft'))} text-xs px-2 py-0.5`}>
                          {String(record.status || 'draft')}
                        </Badge>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            toast({
                              title: "Edit Billing",
                              description: "Edit functionality coming soon",
                            });
                          }}
                        >
                          <Edit2 className="h-3.5 w-3.5 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this billing record?')) {
                              try {
                                const { error } = await supabase
                                  .from('patient_billing')
                                  .delete()
                                  .eq('id', record.id);
                                
                                if (error) throw error;
                                
                                toast({
                                  title: "Success",
                                  description: "Billing record deleted successfully",
                                });
                                
                                // Refresh the data
                                fetchPatientData();
                              } catch (error) {
                                console.error('Error deleting billing record:', error);
                                toast({
                                  title: "Error",
                                  description: "Failed to delete billing record",
                                  variant: "destructive"
                                });
                              }
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data Message */}
      {!isLoadingPatientData && existingBillingRecords.length === 0 && patientDiagnoses.length === 0 && selectedSurgeries.length === 0 && patientComplications.length === 0 && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-6 text-center">
            <div className="text-gray-500">
              <Receipt className="h-8 w-8 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No previous medical records found</p>
              <p className="text-sm">Start by adding diagnoses, surgeries, or complications below</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diagnoses Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Diagnoses Management
          </CardTitle>
          <CardDescription>
            Search and add diagnoses, view related complications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Diagnosis Search */}
          <div className="relative" ref={diagnosisSearchRef}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search diagnoses by name, ICD code, or category..."
                  value={diagnosisSearch}
                  onChange={(e) => {
                    setDiagnosisSearch(e.target.value);
                    setShowDiagnosisResults(true);
                  }}
                  onFocus={() => setShowDiagnosisResults(true)}
                  className="pl-10"
                />
              </div>
              <Dialog open={showAddDiagnosisDialog} onOpenChange={setShowAddDiagnosisDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Diagnosis</DialogTitle>
                    <DialogDescription>
                      Create a new diagnosis entry
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Diagnosis Name</Label>
                      <Input
                        value={newDiagnosis.name}
                        onChange={(e) => setNewDiagnosis(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter diagnosis name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Complication 1</Label>
                        <Input
                          value={newDiagnosis.complication1}
                          onChange={(e) => setNewDiagnosis(prev => ({ ...prev, complication1: e.target.value }))}
                          placeholder="e.g., Bleeding"
                        />
                      </div>
                      <div>
                        <Label>Complication 2</Label>
                        <Input
                          value={newDiagnosis.complication2}
                          onChange={(e) => setNewDiagnosis(prev => ({ ...prev, complication2: e.target.value }))}
                          placeholder="e.g., Infection"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Complication 3</Label>
                        <Input
                          value={newDiagnosis.complication3}
                          onChange={(e) => setNewDiagnosis(prev => ({ ...prev, complication3: e.target.value }))}
                          placeholder="e.g., Hypoglycemia"
                        />
                      </div>
                      <div>
                        <Label>Complication 4</Label>
                        <Input
                          value={newDiagnosis.complication4}
                          onChange={(e) => setNewDiagnosis(prev => ({ ...prev, complication4: e.target.value }))}
                          placeholder="e.g., Neuropathy"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddDiagnosisDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createNewDiagnosis}>
                      Create Diagnosis
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Search Results */}
            {showDiagnosisResults && diagnosisSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredDiagnoses.length > 0 ? (
                  filteredDiagnoses.map((diagnosis) => (
                    <div
                      key={diagnosis.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => addDiagnosisToPatient(diagnosis)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{String(diagnosis.name || '')}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Complications: {[
                              String(diagnosis.complication1 || ''), 
                              String(diagnosis.complication2 || ''), 
                              String(diagnosis.complication3 || ''), 
                              String(diagnosis.complication4 || '')
                            ].filter(Boolean).join(', ') || 'None'}
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500 text-center">
                    No diagnoses found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Diagnoses */}
          {patientDiagnoses.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Selected Diagnoses</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {patientDiagnoses.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{String(item.diagnosis?.name || '')}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Related complications available
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(String(item.status || 'active'))}>
                          {String(item.status || 'active')}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Diagnosed: {new Date(item.diagnosed_date || new Date()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDiagnosis(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Surgeries Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Treatment Surgeries
          </CardTitle>
          <CardDescription>
            Select treatment surgeries for the patient
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Surgery Search */}
          <div className="relative" ref={surgerySearchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search surgeries by name or code..."
                value={surgerySearch}
                onChange={(e) => {
                  setSurgerySearch(e.target.value);
                  setShowSurgeryResults(true);
                }}
                onFocus={() => setShowSurgeryResults(true)}
                className="pl-10"
              />
            </div>
            
            {/* Surgery Search Results */}
            {showSurgeryResults && surgerySearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredSurgeries.length > 0 ? (
                  filteredSurgeries.map((surgery) => (
                    <div
                      key={surgery.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => addSurgeryToPatient(surgery)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{String(surgery.name || '')}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Code: {String(surgery.code || '')} • ₹{String(surgery.amount || '')}
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500 text-center">
                    No surgeries found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Surgeries */}
          {selectedSurgeries.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Selected Surgeries</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {selectedSurgeries.map((surgery) => (
                  <div key={surgery.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{String(surgery.name || '')}</div>
                      <div className="text-xs text-gray-600 mt-1">Code: {String(surgery.code || '')}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="bg-white">
                          ₹{String(surgery.amount || '')}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSurgery(surgery.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Complications Management
          </CardTitle>
          <CardDescription>
            Monitor and manage potential complications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Related Complications */}
          {relatedComplications.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Related Complications (Based on Diagnoses)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                {relatedComplications.map((complication) => (
                  <div
                    key={complication.id}
                    className="p-2 bg-orange-50 rounded border border-orange-200 cursor-pointer hover:bg-orange-100"
                    onClick={() => addComplicationToPatient(complication)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{String(complication.name || '')}</div>
                        <Badge className={`${getSeverityColor(String(complication.severity || 'moderate'))} text-xs`}>
                          {String(complication.severity || 'moderate')}
                        </Badge>
                      </div>
                      <Plus className="h-4 w-4 text-orange-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complication Search */}
          <div className="relative" ref={complicationSearchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search complications by name, severity, or category..."
                value={complicationSearch}
                onChange={(e) => {
                  setComplicationSearch(e.target.value);
                  setShowComplicationResults(true);
                }}
                onFocus={() => setShowComplicationResults(true)}
                className="pl-10"
              />
            </div>
            
            {/* Complication Search Results */}
            {showComplicationResults && complicationSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredComplications.length > 0 ? (
                  filteredComplications.map((complication) => (
                    <div
                      key={complication.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => addComplicationToPatient(complication)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{String(complication.name || '')}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${getSeverityColor(String(complication.severity || 'moderate'))} text-xs`}>
                              {String(complication.severity || 'moderate')}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {String(complication.category || '')}
                            </span>
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-orange-600" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500 text-center">
                    No complications found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Patient Complications */}
          {patientComplications.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Active Complications</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {patientComplications.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{String(item.complication?.name || '')}</div>
                      <div className="text-xs text-gray-600 mt-1">{String(item.complication?.description || '')}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getSeverityColor(String(item.complication?.severity || 'moderate'))}>
                          {String(item.complication?.severity || 'moderate')}
                        </Badge>
                        <Badge className={getStatusColor(String(item.status || 'active'))}>
                          {String(item.status || 'active')}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Occurred: {new Date(item.occurred_date || new Date()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeComplication(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save to Billing Section */}
      {(patientDiagnoses.length > 0 || selectedSurgeries.length > 0 || patientComplications.length > 0) && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Receipt className="h-5 w-5" />
              Save to Billing
            </CardTitle>
            <CardDescription className="text-green-600">
              Save all selected diagnoses, surgeries, and complications to create a billing record
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium text-sm text-gray-700 mb-2">Summary to be saved:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-600">Diagnoses:</span>
                    <span className="ml-2">{patientDiagnoses.length} selected</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-600">Surgeries:</span>
                    <span className="ml-2">{selectedSurgeries.length} selected</span>
                  </div>
                  <div>
                    <span className="font-medium text-orange-600">Complications:</span>
                    <span className="ml-2">{patientComplications.length} active</span>
                  </div>
                </div>
              </div>
              
              {/* Save Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={saveToBilling}
                  disabled={isSavingToBilling}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSavingToBilling ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Saving to Billing...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Billing
                    </>
                  )}
                </Button>
              </div>
              
              {billingId && (
                <div className="text-sm text-green-600 text-center">
                  ✅ Successfully saved to billing (ID: {billingId})
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 