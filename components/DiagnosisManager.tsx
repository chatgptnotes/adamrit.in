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
  id: number;
  diagnosis_code: string;
  name: string;
  icd_code: string;
  category: string;
  description: string;
  is_active: boolean;
}

interface Package {
  id: number;
  package_code: string;
  name: string;
  description: string;
  base_amount: number;
  category: string;
  duration_days: number;
  is_active: boolean;
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
  const [packages, setPackages] = useState<Package[]>([]);
  const [complications, setComplications] = useState<Complication[]>([]);
  const [relatedComplications, setRelatedComplications] = useState<Complication[]>([]);
  
  const [patientDiagnoses, setPatientDiagnoses] = useState<PatientDiagnosis[]>([]);
  const [patientComplications, setPatientComplications] = useState<PatientComplication[]>([]);
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);
  
  // Search and selection states
  const [diagnosisSearch, setDiagnosisSearch] = useState('');
  const [packageSearch, setPackageSearch] = useState('');
  const [complicationSearch, setComplicationSearch] = useState('');
  const [showDiagnosisResults, setShowDiagnosisResults] = useState(false);
  const [showPackageResults, setShowPackageResults] = useState(false);
  const [showComplicationResults, setShowComplicationResults] = useState(false);
  
  // Dialog states
  const [showAddDiagnosisDialog, setShowAddDiagnosisDialog] = useState(false);
  const [showAddPackageDialog, setShowAddPackageDialog] = useState(false);
  const [showAddComplicationDialog, setShowAddComplicationDialog] = useState(false);
  
  // Form states
  const [newDiagnosis, setNewDiagnosis] = useState({
    diagnosis_code: '',
    name: '',
    icd_code: '',
    category: '',
    description: ''
  });
  
  const [newPackage, setNewPackage] = useState({
    package_code: '',
    name: '',
    description: '',
    base_amount: '',
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
  const packageSearchRef = useRef<HTMLDivElement>(null);
  const complicationSearchRef = useRef<HTMLDivElement>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchDiagnoses();
    fetchPackages();
    fetchComplications();
    fetchPatientData();
  }, [patientUniqueId]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (diagnosisSearchRef.current && !diagnosisSearchRef.current.contains(event.target as Node)) {
        setShowDiagnosisResults(false);
      }
      if (packageSearchRef.current && !packageSearchRef.current.contains(event.target as Node)) {
        setShowPackageResults(false);
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
        .eq('is_active', true)
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

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch packages",
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
      // Fetch patient diagnoses
      const { data: diagnosisData, error: diagnosisError } = await supabase
        .from('patient_diagnosis')
        .select(`
          *,
          diagnosis:diagnosis_id (*)
        `)
        .eq('patient_unique_id', patientUniqueId)
        .order('diagnosed_date', { ascending: false });

      if (diagnosisError) throw diagnosisError;
      setPatientDiagnoses(diagnosisData || []);

      // Fetch patient complications
      const { data: complicationData, error: complicationError } = await supabase
        .from('patient_complications')
        .select(`
          *,
          complication:complication_id (*)
        `)
        .eq('patient_unique_id', patientUniqueId)
        .order('occurred_date', { ascending: false });

      if (complicationError) throw complicationError;
      setPatientComplications(complicationData || []);

    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  // Filter functions for search
  const filteredDiagnoses = diagnoses.filter(diagnosis =>
    diagnosis.name.toLowerCase().includes(diagnosisSearch.toLowerCase()) ||
    diagnosis.icd_code.toLowerCase().includes(diagnosisSearch.toLowerCase()) ||
    diagnosis.category.toLowerCase().includes(diagnosisSearch.toLowerCase())
  );

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(packageSearch.toLowerCase()) ||
    pkg.category.toLowerCase().includes(packageSearch.toLowerCase())
  );

  const filteredComplications = complications.filter(complication =>
    complication.name.toLowerCase().includes(complicationSearch.toLowerCase()) ||
    complication.category.toLowerCase().includes(complicationSearch.toLowerCase()) ||
    complication.severity.toLowerCase().includes(complicationSearch.toLowerCase())
  );

  // Add functions
  const addDiagnosisToPatient = async (diagnosis: Diagnosis) => {
    try {
      const { data, error } = await supabase
        .from('patient_diagnosis')
        .insert({
          patient_unique_id: patientUniqueId,
          diagnosis_id: diagnosis.id,
          visit_id: visitId,
          status: 'active',
          diagnosed_date: new Date().toISOString().split('T')[0]
        })
        .select(`
          *,
          diagnosis:diagnosis_id (*)
        `)
        .single();

      if (error) throw error;
      
      setPatientDiagnoses(prev => [data, ...prev]);
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

  const addPackageToPatient = async (pkg: Package) => {
    if (selectedPackages.find(p => p.id === pkg.id)) {
      toast({
        title: "Package already added",
        description: "This package is already selected",
        variant: "destructive"
      });
      return;
    }

    setSelectedPackages(prev => [...prev, pkg]);
    setPackageSearch('');
    setShowPackageResults(false);
    
    toast({
      title: "Success",
      description: `Added package: ${pkg.name}`
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

  const fetchRelatedComplications = async (diagnosisIds: number[]) => {
    try {
      const { data, error } = await supabase
        .from('diagnosis_complications')
        .select(`
          complication:complication_id (*),
          probability
        `)
        .in('diagnosis_id', diagnosisIds);

      if (error) throw error;
      
      const related = data?.map((item: any) => item.complication).filter(Boolean) || [];
      setRelatedComplications(related as Complication[]);
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
        diagnosis_code: '',
        name: '',
        icd_code: '',
        category: '',
        description: ''
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
  const removeDiagnosis = async (id: number) => {
    try {
      const { error } = await supabase
        .from('patient_diagnosis')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPatientDiagnoses(prev => prev.filter(d => d.id !== id));
      
      toast({
        title: "Success",
        description: "Diagnosis removed"
      });
    } catch (error) {
      console.error('Error removing diagnosis:', error);
      toast({
        title: "Error",
        description: "Failed to remove diagnosis",
        variant: "destructive"
      });
    }
  };

  const removePackage = (id: number) => {
    setSelectedPackages(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Success",
      description: "Package removed"
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Diagnosis Code</Label>
                        <Input
                          value={newDiagnosis.diagnosis_code}
                          onChange={(e) => setNewDiagnosis(prev => ({ ...prev, diagnosis_code: e.target.value }))}
                          placeholder="e.g., DG011"
                        />
                      </div>
                      <div>
                        <Label>ICD Code</Label>
                        <Input
                          value={newDiagnosis.icd_code}
                          onChange={(e) => setNewDiagnosis(prev => ({ ...prev, icd_code: e.target.value }))}
                          placeholder="e.g., E11"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Diagnosis Name</Label>
                      <Input
                        value={newDiagnosis.name}
                        onChange={(e) => setNewDiagnosis(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter diagnosis name"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        value={newDiagnosis.category}
                        onChange={(e) => setNewDiagnosis(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Cardiovascular"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newDiagnosis.description}
                        onChange={(e) => setNewDiagnosis(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter description"
                      />
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
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                            ICD: {diagnosis.icd_code} • Category: {diagnosis.category}
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
              <div className="space-y-2">
                {patientDiagnoses.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.diagnosis.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        ICD: {item.diagnosis.icd_code} • Category: {item.diagnosis.category}
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

      {/* Packages Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Treatment Packages
          </CardTitle>
          <CardDescription>
            Select treatment packages for the patient
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Package Search */}
          <div className="relative" ref={packageSearchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search packages by name or category..."
                value={packageSearch}
                onChange={(e) => {
                  setPackageSearch(e.target.value);
                  setShowPackageResults(true);
                }}
                onFocus={() => setShowPackageResults(true)}
                className="pl-10"
              />
            </div>
            
            {/* Package Search Results */}
            {showPackageResults && packageSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredPackages.length > 0 ? (
                  filteredPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => addPackageToPatient(pkg)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{pkg.name}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            ₹{pkg.base_amount?.toLocaleString()} • {pkg.duration_days} days • {pkg.category}
                          </div>
                        </div>
                        <Plus className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500 text-center">
                    No packages found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Packages */}
          {selectedPackages.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Selected Packages</Label>
              <div className="space-y-2">
                {selectedPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{pkg.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{pkg.description}</div>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="bg-white">
                          ₹{pkg.base_amount?.toLocaleString()}
                        </Badge>
                        <Badge variant="outline" className="bg-white">
                          {pkg.duration_days} days
                        </Badge>
                        <Badge variant="outline" className="bg-white">
                          {pkg.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePackage(pkg.id)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
              <div className="space-y-2">
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