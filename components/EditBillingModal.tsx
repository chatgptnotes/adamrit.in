import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase/client";

// Import types from DiagnosisManager (copy here for now)
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
interface PatientSurgery {
  id: number;
  surgery: Package;
  surgery_date: string;
  notes: string;
  amount: string;
}
interface PatientComplication {
  id: number;
  complication: Complication;
  status: 'active' | 'resolved' | 'monitoring';
  occurred_date: string;
  notes: string;
  severity: string;
}

interface EditBillingModalProps {
  record: any;
  onClose: () => void;
  onSave?: () => void;
}

export default function EditBillingModal({ record, onClose, onSave }: EditBillingModalProps) {
  // Simplified form with only medical information
  const [form, setForm] = useState({
    primary_diagnosis: record.primary_diagnosis || "",
    surgery_package: record.surgery_package || "",
    complications: record.complications || "",
  });
  const [saving, setSaving] = useState(false);

  // No need for related data as we're focusing only on the three main fields

  // Save logic (only medical information)
  const handleSubmit = async () => {
    setSaving(true);
    // Update only the medical information fields
    const { error: billingError } = await supabase
      .from("patient_billing")
      .update({
        primary_diagnosis: form.primary_diagnosis,
        surgery_package: form.surgery_package,
        complications: form.complications
      })
      .eq("id", record.id);
    if (billingError) {
      setSaving(false);
      toast({ title: "Error", description: billingError.message, variant: "destructive" });
      return;
    }
    setSaving(false);
    toast({ title: "Success", description: "Medical information updated." });
    onSave && onSave();
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Medical Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-w-full">
          {/* Medical information only */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Diagnosis</label>
            <Input 
              name="primary_diagnosis" 
              value={form.primary_diagnosis} 
              onChange={e => setForm({ ...form, primary_diagnosis: e.target.value })} 
              placeholder="Diagnosis" 
              className="w-full" 
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Surgery</label>
            <Input 
              name="surgery_package" 
              value={form.surgery_package} 
              onChange={e => setForm({ ...form, surgery_package: e.target.value })} 
              placeholder="Surgery" 
              className="w-full" 
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Complications</label>
            <Input 
              name="complications" 
              value={form.complications} 
              onChange={e => setForm({ ...form, complications: e.target.value })} 
              placeholder="Complications" 
              className="w-full" 
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between w-full gap-2 sm:justify-end">
          <Button onClick={onClose} variant="outline" size="sm" className="flex-1 sm:flex-initial">Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving} size="sm" className="flex-1 sm:flex-initial">
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 