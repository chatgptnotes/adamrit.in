import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase/client";

interface EditBillingModalProps {
  record: any; // You can replace 'any' with a more specific type if available
  onClose: () => void;
  onSave?: () => void;
}

export default function EditBillingModal({ record, onClose, onSave }: EditBillingModalProps) {
  const [form, setForm] = useState({
    patient_name: record.patient_name || "",
    bill_date: record.bill_date || "",
    status: record.status || "",
    primary_diagnosis: record.primary_diagnosis || "",
    total_amount: record.total_amount || 0,
    claim_id: record.claim_id || "",
    bill_number: record.bill_number || "",
    visit_id: record.visit_id || "",
    // Add other fields as needed
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("patient_billing")
      .update(form)
      .eq("id", record.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Billing record updated." });
      onSave && onSave();
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Billing Record</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input name="patient_name" value={form.patient_name} onChange={handleChange} placeholder="Patient Name" />
          <Input name="bill_date" type="date" value={form.bill_date} onChange={handleChange} placeholder="Bill Date" />
          <Input name="status" value={form.status} onChange={handleChange} placeholder="Status" />
          <Input name="primary_diagnosis" value={form.primary_diagnosis} onChange={handleChange} placeholder="Diagnosis" />
          <Input name="total_amount" type="number" value={form.total_amount} onChange={handleChange} placeholder="Total Amount" />
          <Input name="claim_id" value={form.claim_id} onChange={handleChange} placeholder="Claim ID" />
          <Input name="bill_number" value={form.bill_number} onChange={handleChange} placeholder="Bill Number" />
          <Input name="visit_id" value={form.visit_id} onChange={handleChange} placeholder="Visit ID" />
          {/* Add more fields as needed */}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 