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
  Eye
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
}

export function DiagnosisManager({ patientUniqueId, visitId }: DiagnosisManagerProps) {
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
      
      if (error) throw error;
      setComplications(data || []);
    } catch (error) {
      console.error('Error fetching complications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch complications",
        variant: "destructive"
      });
    }
  };

  const fetchPatientData = async () => {
    try {
      // Fetch patient diagnoses (with error handling for missing tables)
      const { data: diagnosisData, error: diagnosisError } = await supabase
        .from('patient_diagnosis')
        .select(`
          *,
          diagnosis:diagnosis_id (*)
        `)
        .eq('patient_unique_id', patientUniqueId)
        .order('diagnosed_date', { ascending: false });

      if (diagnosisError) {
        console.log('Patient diagnosis table not available:', diagnosisError.message);
        setPatientDiagnoses([]);
      } else {
        setPatientDiagnoses(diagnosisData || []);
      }

      // Fetch patient complications (with error handling for missing tables)
      const { data: complicationData, error: complicationError } = await supabase
        .from('patient_complications')
        .select(`
          *,
          complication:complication_id (*)
        `)
        .eq('patient_unique_id', patientUniqueId)
        .order('occurred_date', { ascending: false });

      if (complicationError) {
        console.log('Patient complications table not available:', complicationError.message);
        setPatientComplications([]);
      } else {
        setPatientComplications(complicationData || []);
      }

    } catch (error) {
      console.log('Patient tables not yet set up, using empty state');
      setPatientDiagnoses([]);
      setPatientComplications([]);
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
      const { data, error } = await supabase
        .from('patient_complications')
        .insert({
          patient_unique_id: patientUniqueId,
          complication_id: complication.id,
          diagnosis_id: diagnosisId,
          visit_id: visitId,
          status: 'active',
          occurred_date: new Date().toISOString().split('T')[0]
        })
        .select(`
          *,
          complication:complication_id (*)
        `)
        .single();

      if (error) throw error;
      
      setPatientComplications(prev => [data, ...prev]);
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

  const removeComplication = async (id: number) => {
    try {
      const { error } = await supabase
        .from('patient_complications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPatientComplications(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "Success",
        description: "Complication removed"
      });
    } catch (error) {
      console.error('Error removing complication:', error);
      toast({
        title: "Error",
        description: "Failed to remove complication",
        variant: "destructive"
      });
    }
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

  return (
    <div className="space-y-6">
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
                          <div className="font-medium text-sm">{diagnosis.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Complications: {[diagnosis.complication1, diagnosis.complication2, diagnosis.complication3, diagnosis.complication4].filter(Boolean).join(', ') || 'None'}
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
                      <div className="font-medium text-sm">{item.diagnosis.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Related complications available
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Diagnosed: {new Date(item.diagnosed_date).toLocaleDateString()}
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
                placeholder="Search surgeries by name or category..."
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
                          <div className="font-medium text-sm">{surgery.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Code: {surgery.code} • ₹{surgery.amount}
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
                      <div className="font-medium text-sm">{surgery.name}</div>
                      <div className="text-xs text-gray-600 mt-1">Code: {surgery.code}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="bg-white">
                          ₹{surgery.amount}
                        </Badge>
                        {surgery.complication1 && (
                          <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                            {surgery.complication1}
                          </Badge>
                        )}
                        {surgery.complication2 && (
                          <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">
                            {surgery.complication2}
                          </Badge>
                        )}
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
                        <div className="text-sm font-medium">{complication.name}</div>
                        <Badge className={`${getSeverityColor(complication.severity)} text-xs`}>
                          {complication.severity}
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
                          <div className="font-medium text-sm">{complication.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`${getSeverityColor(complication.severity)} text-xs`}>
                              {complication.severity}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {complication.category}
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
                      <div className="font-medium text-sm">{item.complication.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{item.complication.description}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getSeverityColor(item.complication.severity)}>
                          {item.complication.severity}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Occurred: {new Date(item.occurred_date).toLocaleDateString()}
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
    </div>
  );
} 