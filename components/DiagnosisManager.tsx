"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
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
import EditBillingModal from "@/components/EditBillingModal";
import { supabase } from "@/lib/supabase/client";

// Types
interface Diagnosis {
  id: string;
  name: string;
  icd_code?: string;
}

interface CGHSSurgery {
  id: string;
  name: string;
  code: string;
  amount: string;
}

interface Complication {
  id: string;
  name: string;
  source_type: 'diagnosis' | 'surgery';
  source_id: string;
  severity?: string;
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
  // Search states
  const [diagnosisSearch, setDiagnosisSearch] = useState('');
  const [surgerySearch, setSurgerySearch] = useState('');
  const [complicationSearch, setComplicationSearch] = useState('');
  const [investigationSearch, setInvestigationSearch] = useState('');
  const [medicationSearch, setMedicationSearch] = useState('');

  // Search results
  const [diagnosisResults, setDiagnosisResults] = useState<Diagnosis[]>([]);
  const [surgeryResults, setSurgeryResults] = useState<CGHSSurgery[]>([]);
  const [complicationResults, setComplicationResults] = useState<Complication[]>([]);

  // Selected items
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<Diagnosis[]>([]);
  const [selectedSurgery, setSelectedSurgery] = useState<CGHSSurgery | null>(null);
  const [selectedComplications, setSelectedComplications] = useState<Complication[]>([]);

  // Loading states
  const [isDiagnosisLoading, setIsDiagnosisLoading] = useState(false);
  const [isSurgeryLoading, setIsSurgeryLoading] = useState(false);
  const [isComplicationLoading, setIsComplicationLoading] = useState(false);

  // Add a new state for selected surgeries list
  const [selectedSurgeries, setSelectedSurgeries] = useState<CGHSSurgery[]>([]);

  // New states for new sections
  const [investigationSurgerySearch, setInvestigationSurgerySearch] = useState('');
  const [medicationSurgerySearch, setMedicationSurgerySearch] = useState('');

  // Helper functions for styling
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

  // Search functions
  const searchDiagnoses = async (searchTerm: string) => {
    setIsDiagnosisLoading(true);
    setDiagnosisSearch(searchTerm);
    
    try {
      const { data, error } = await supabase
        .from('diagnosis')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      setDiagnosisResults(data || []);
    } catch (error) {
      console.error('Error searching diagnoses:', error);
    } finally {
      setIsDiagnosisLoading(false);
    }
  };

  const searchSurgeries = async (searchTerm: string) => {
    setIsSurgeryLoading(true);
    setSurgerySearch(searchTerm);

    try {
      const { data, error } = await supabase
        .from('cghs_surgery')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      setSurgeryResults(data || []);
    } catch (error) {
      console.error('Error searching surgeries:', error);
    } finally {
      setIsSurgeryLoading(false);
    }
  };

  const searchComplications = async (searchTerm: string, source_type?: string) => {
    setIsComplicationLoading(true);
    setComplicationSearch(searchTerm);

    try {
      const { data, error } = await supabase
        .from('complication')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .eq('source_type', source_type)
        .limit(10);

      if (error) throw error;
      setComplicationResults(data || []);
    } catch (error) {
      console.error('Error searching complications:', error);
    } finally {
      setIsComplicationLoading(false);
    }
  };

  // Selection handlers
  const handleDiagnosisSelect = async (diagnosis: Diagnosis) => {
    console.log('Selected diagnosis:', diagnosis);
    console.log('patientUniqueId:', patientUniqueId, 'visitId:', visitId);
    try {
      if (!patientUniqueId || !visitId) {
        toast({
          title: "Error",
          description: "Missing patient or visit ID",
          variant: "destructive"
        });
        return;
      }
      if (!diagnosis?.name) {
        toast({
          title: "Error",
          description: "Invalid diagnosis data",
          variant: "destructive"
        });
        return;
      }
      // Prevent duplicate
      if (selectedDiagnoses.some(d => d.id === diagnosis.id)) {
        toast({
          title: "Already Selected",
          description: "This diagnosis has already been selected.",
          variant: "default"
        });
        return;
      }
      // Update UI first
      setDiagnosisSearch("");
      setDiagnosisResults([]);
      // Insert with visit_id and patient_unique_id
      const insertData = {
        patient_unique_id: patientUniqueId,
        visit_id: visitId,
        diagnosis_id: diagnosis.id || null,
        diagnosis_name: diagnosis.name,
        status: 'active',
        diagnosed_date: new Date().toISOString().split('T')[0],
        notes: 'Added from Clinical Management'
      };
      const { data, error } = await supabase
        .from('billing_diagnoses')
        .insert([insertData]);
      if (error) {
        toast({
          title: "Error",
          description: "Failed to save diagnosis",
          variant: "destructive"
        });
        return;
      }
      setSelectedDiagnoses(prev => [...prev, diagnosis]);
      toast({
        title: "Success",
        description: "Diagnosis saved successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleSurgerySelect = async (surgery: CGHSSurgery) => {
    try {
      // Input validation
      if (!patientUniqueId || !surgery?.name) {
        toast({
          title: "Error",
          description: "Missing required data",
          variant: "destructive"
        });
        return;
      }

      // Check if already selected
      if (selectedSurgeries.some(s => s.id === surgery.id)) {
        toast({
          title: "Already Selected",
          description: "This surgery has already been selected.",
          variant: "default"
        });
        return;
      }

      // Update UI first
      setSelectedSurgery(surgery);
      setSurgerySearch('');
      setSurgeryResults([]);

      // Save directly to billing_surgeries
      const surgeryData = {
        patient_unique_id: patientUniqueId,
        visit_id: visitId,
        surgery_id: surgery.id,
        surgery_name: surgery.name,
        surgery_code: surgery.code,
        surgery_amount: surgery.amount,
        surgery_date: new Date().toISOString().split('T')[0],
        status: 'active',
        notes: 'Added from Clinical Management'
      };

      console.log('visitId at surgery insert:', visitId);
      console.log('surgeryData:', surgeryData);

      // Try to insert
      const { error } = await supabase
        .from('billing_surgeries')
        .insert([surgeryData]);

      if (error) {
        console.error('Surgery error:', error);
        toast({
          title: "Error",
          description: "Failed to save surgery",
          variant: "destructive"
        });
        return;
      }

      // Add to selected surgeries list
      setSelectedSurgeries(prev => [...prev, surgery]);

      toast({
        title: "Success",
        description: "Surgery added successfully",
        variant: "default"
      });

    } catch (error: any) {
      console.error('Surgery error:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to add surgery",
        variant: "destructive"
      });
    }
  };

  // Add a remove surgery handler
  const handleRemoveSurgery = async (surgeryToRemove: CGHSSurgery) => {
    try {
      // Remove from database
      const { error } = await supabase
        .from('billing_surgeries')
        .delete()
        .match({ 
          patient_unique_id: patientUniqueId,
          surgery_id: surgeryToRemove.id 
        });

      if (error) {
        throw error;
      }

      // Remove from selected surgeries list
      setSelectedSurgeries(prev => prev.filter(s => s.id !== surgeryToRemove.id));
      
      // Clear current selection if it's the same surgery
      if (selectedSurgery?.id === surgeryToRemove.id) {
        setSelectedSurgery(null);
      }

      toast({
        title: "Success",
        description: "Surgery removed successfully",
        variant: "default"
      });

    } catch (error: any) {
      console.error('Error removing surgery:', error);
      toast({
        title: "Error",
        description: "Failed to remove surgery",
        variant: "destructive"
      });
    }
  };

  const handleComplicationSelect = async (complication: Complication) => {
    try {
      // First check if complication already exists in selected list
      if (selectedComplications.some(c => c.id === complication.id)) {
        toast({
          title: "Already Selected",
          description: "This complication has already been selected.",
          variant: "default"
        });
        return;
      }

      // Log the incoming data
      console.log('Attempting to save complication:', {
        complication,
        patientUniqueId,
        selectedDiagnoses
      });

      // Prepare minimal required data
      const complicationData = {
        patient_unique_id: patientUniqueId,
        visit_id: visitId,
        complication_name: complication.name,
        status: 'active',
        occurred_date: new Date().toISOString()
      };

      // Log the data being sent
      console.log('Sending data to Supabase:', complicationData);

      // Insert into billing_complications
      console.log('visitId at complication insert:', visitId);
      const { data, error } = await supabase
        .from('billing_complications')
        .insert(complicationData);

      if (error) {
        console.error('Detailed Supabase error:', JSON.stringify(error, null, 2), complicationData);
        toast({
          title: "Error",
          description: error.message || "Failed to save complication",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setSelectedComplications([...selectedComplications, complication]);
      setComplicationSearch('');
      setComplicationResults([]);

      toast({
        title: "Success",
        description: "Complication added successfully.",
        variant: "default"
      });

      console.log('Complication saved successfully:', data);
    } catch (error: any) {
      console.error('Detailed error:', {
        error,
        message: error?.message,
        stack: error?.stack
      });
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Add useEffect to load diagnoses for this patient and visit
  useEffect(() => {
    const loadDiagnoses = async () => {
      if (!patientUniqueId || !visitId) return;
      const { data, error } = await supabase
        .from('billing_diagnoses')
        .select('diagnosis_id, diagnosis_name, icd_code')
        .eq('patient_unique_id', patientUniqueId)
        .eq('visit_id', visitId)
        .eq('status', 'active');
      if (!error && data) {
        setSelectedDiagnoses(data.map(d => ({
          id: d.diagnosis_id,
          name: d.diagnosis_name,
          icd_code: d.icd_code || undefined
        })));
      }
    };
    loadDiagnoses();
  }, [patientUniqueId, visitId]);

  // Add remove handler for diagnosis
  const handleRemoveDiagnosis = async (diagnosis: Diagnosis) => {
    try {
      const { error } = await supabase
        .from('billing_diagnoses')
        .delete()
        .match({
          patient_unique_id: patientUniqueId,
          visit_id: visitId,
          diagnosis_id: diagnosis.id
        });
      if (error) throw error;
      setSelectedDiagnoses(prev => prev.filter(d => d.id !== diagnosis.id));
      toast({
        title: "Success",
        description: "Diagnosis removed successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove diagnosis",
        variant: "destructive"
      });
    }
  };

  // UI placeholder data (empty states)
  const isLoadingPatientData = false;
  const existingBillingRecords: any[] = [];
  const patientDiagnoses: PatientDiagnosis[] = [];
  const patientComplications: PatientComplication[] = [];
  const relatedComplications: Complication[] = [];
  const showAddDiagnosisDialog = false;
  const showEditModal = false;
  const editingRecord = null;
  const isSavingToBilling = false;
  const billingId = null;

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
                      <div className="text-sm text-gray-600 space-y-2">
                        <p><strong>Diagnosis:</strong> {String(record.primary_diagnosis || 'Not specified')}</p>
                        <p><strong>Surgery:</strong> {String(record.surgery_package || 'None')}</p>
                        <p><strong>Complications:</strong> {String(record.complications || 'None')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 ml-3">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
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

      {/* Diagnosis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-blue-700">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            Diagnosis
          </CardTitle>
          <CardDescription>
            Search and add diagnoses, view related complications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={diagnosisSearch}
                onChange={(e) => searchDiagnoses(e.target.value)}
                placeholder="Search diagnoses by name or ICD code..."
                className="pl-10"
              />
            </div>
            
            {diagnosisResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {diagnosisResults.map((diagnosis) => (
                  <div
                    key={diagnosis.id}
                    className="p-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleDiagnosisSelect(diagnosis)}
                  >
                    <div className="font-medium">{diagnosis.name}</div>
                    {diagnosis.icd_code && (
                      <div className="text-sm text-gray-500">ICD: {diagnosis.icd_code}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedDiagnoses.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedDiagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium">{diagnosis.name}</div>
                  {diagnosis.icd_code && (
                    <div className="text-sm text-gray-600">ICD: {diagnosis.icd_code}</div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-600"
                    onClick={() => handleRemoveDiagnosis(diagnosis)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CGHS Surgery Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-blue-700">
            <Package className="h-5 w-5 text-green-600" />
            CGHS SURGERY
          </CardTitle>
          <CardDescription>
            Select treatment surgeries for the patient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={surgerySearch}
                onChange={(e) => searchSurgeries(e.target.value)}
                placeholder="Search surgeries by name or code..."
                className="pl-10"
              />
            </div>
            
            {surgeryResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {surgeryResults.map((surgery) => (
                  <div
                    key={surgery.id}
                    className="p-2 hover:bg-green-50 cursor-pointer"
                    onClick={() => handleSurgerySelect(surgery)}
                  >
                    <div className="font-medium">{surgery.name}</div>
                    <div className="text-sm text-gray-500">
                      Code: {surgery.code} | Amount: ₹{surgery.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedSurgeries.length > 0 && (
            <div className="mt-4 space-y-2">
              {selectedSurgeries.map((surgery) => (
                <div key={surgery.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium">{surgery.name}</div>
                  <div className="text-sm text-gray-600">
                    Code: {surgery.code} | Amount: ₹{surgery.amount}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-600"
                    onClick={() => handleRemoveSurgery(surgery)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complications mapped to diagnosis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-blue-700">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Complications mapped to diagnosis
          </CardTitle>
          <CardDescription>
            Monitor and manage potential complications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={complicationSearch}
                onChange={(e) => searchComplications(e.target.value)}
                placeholder="Search complications..."
                className="pl-10"
              />
            </div>
            
            {complicationResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {complicationResults.map((complication) => (
                  <div
                    key={complication.id}
                    className="p-2 hover:bg-orange-50 cursor-pointer"
                    onClick={() => handleComplicationSelect(complication)}
                  >
                    <div className="font-medium">{complication.name}</div>
                    <div className="text-sm text-gray-500">
                      Type: {complication.source_type}
                      {complication.severity && ` | Severity: ${complication.severity}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Investigations mapped to complications (mapped to diagnosis) Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-blue-700">
            <Eye className="h-5 w-5 text-blue-600" />
            Investigations mapped to complications (mapped to diagnosis)
          </CardTitle>
          <CardDescription>
            Monitor and manage investigations related to complications for the selected diagnosis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={investigationSearch}
                onChange={(e) => setInvestigationSearch(e.target.value)}
                placeholder="Search investigations mapped to complications..."
                className="pl-10"
              />
            </div>
            {/* Placeholder for investigations list */}
          </div>
        </CardContent>
      </Card>

      {/* Medications mapped to complications (mapped to diagnosis) Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-blue-700">
            <Package className="h-5 w-5 text-green-600" />
            Medications mapped to complications (mapped to diagnosis)
          </CardTitle>
          <CardDescription>
            Monitor and manage medications related to complications for the selected diagnosis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={medicationSearch}
                onChange={(e) => setMedicationSearch(e.target.value)}
                placeholder="Search medications mapped to complications..."
                className="pl-10"
              />
            </div>
            {/* Placeholder for medications list */}
          </div>
        </CardContent>
      </Card>

      {/* Complications mapped to CGHS surgery Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-blue-700">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Complications mapped to CGHS surgery
          </CardTitle>
          <CardDescription>
            Monitor and manage potential complications related to selected surgeries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={complicationSearch}
                onChange={(e) => searchComplications(e.target.value, 'surgery')}
                placeholder="Search complications mapped to CGHS surgery..."
                className="pl-10"
              />
            </div>
            {/* Display complications where source_type === 'surgery' */}
            {complicationResults.filter(c => c.source_type === 'surgery').length > 0 && (
              <div className="mt-4 space-y-2">
                {complicationResults.filter(c => c.source_type === 'surgery').map((complication) => (
                  <div key={complication.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="font-medium">{complication.name}</div>
                    <div className="text-sm text-gray-600">
                      Type: {complication.source_type}
                      {complication.severity && ` | Severity: ${complication.severity}`}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-600"
                      onClick={() => setSelectedComplications(
                        selectedComplications.filter(c2 => c2.id !== complication.id)
                      )}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Investigations mapped to complications (mapped to CGHS surgery) Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-blue-700">
            <Eye className="h-5 w-5 text-blue-600" />
            Investigations mapped to complications (mapped to CGHS surgery)
          </CardTitle>
          <CardDescription>
            Monitor and manage investigations related to complications for the selected CGHS surgery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={investigationSurgerySearch}
                onChange={(e) => setInvestigationSurgerySearch(e.target.value)}
                placeholder="Search investigations mapped to complications..."
                className="pl-10"
              />
            </div>
            {/* Placeholder for investigations list */}
          </div>
        </CardContent>
      </Card>

      {/* Medications mapped to complications (mapped to CGHS surgery) Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-blue-700">
            <Package className="h-5 w-5 text-green-600" />
            Medications mapped to complications (mapped to CGHS surgery)
          </CardTitle>
          <CardDescription>
            Monitor and manage medications related to complications for the selected CGHS surgery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={medicationSurgerySearch}
                onChange={(e) => setMedicationSurgerySearch(e.target.value)}
                placeholder="Search medications mapped to complications..."
                className="pl-10"
              />
            </div>
            {/* Placeholder for medications list */}
          </div>
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

      {showEditModal && editingRecord && (
        <EditBillingModal
          record={editingRecord}
          onClose={() => {}}
          onSave={() => {}}
        />
      )}
    </div>
  );
} 