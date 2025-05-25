import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Define the updated interface for diagnosis submission
interface DiagnosisFormData {
  name: string;
  complication1: string;
  complication2: string;
  complication3: string;
  complication4: string;
}

// Use existing complications from the system
const availableComplications = [
  { id: "c1", name: "Infection", riskLevel: "High" },
  { id: "c2", name: "Bleeding", riskLevel: "Medium" },
  { id: "c3", name: "Allergic Reaction", riskLevel: "Medium" },
  { id: "c4", name: "Blood Clot", riskLevel: "High" },
  { id: "c5", name: "Pneumonia", riskLevel: "Medium" },
  { id: "c6", name: "Diabetic Ketoacidosis", riskLevel: "High" },
  { id: "c7", name: "Hypoglycemia", riskLevel: "Medium" },
  { id: "c8", name: "Diabetic Neuropathy", riskLevel: "Medium" },
  { id: "c9", name: "Diabetic Retinopathy", riskLevel: "High" },
  { id: "c10", name: "Diabetic Foot Ulcer", riskLevel: "High" },
  { id: "c11", name: "Hypertensive Crisis", riskLevel: "High" },
  { id: "c12", name: "Hypertensive Heart Disease", riskLevel: "High" },
  { id: "c13", name: "Hypertensive Retinopathy", riskLevel: "Medium" },
  { id: "c14", name: "Angina Pectoris", riskLevel: "Medium" },
  { id: "c15", name: "Myocardial Infarction", riskLevel: "High" },
  { id: "c16", name: "Heart Failure", riskLevel: "High" },
  { id: "c17", name: "Chronic Kidney Disease", riskLevel: "High" },
  { id: "c18", name: "Proteinuria", riskLevel: "Medium" },
  { id: "c19", name: "Edema", riskLevel: "Low" },
  { id: "c20", name: "Acute Respiratory Failure", riskLevel: "High" }
];

export default function AddDiagnosisForm({ 
  onCancel, 
  onSubmit 
}: { 
  onCancel: () => void, 
  onSubmit: (name: string, formData?: DiagnosisFormData) => void 
}) {
  const [formData, setFormData] = useState<DiagnosisFormData>({
    name: "",
    complication1: "none",
    complication2: "none",
    complication3: "none",
    complication4: "none"
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData.name.trim(), formData);
    }
  }

  // Helper function to update form state
  const updateFormData = (field: keyof DiagnosisFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Add Diagnosis</h3>
        
        <div className="space-y-4">
          {/* Diagnosis Name Field */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="diagnosisName" className="font-medium">
              Diagnosis Name <span className="text-red-500">*</span>
            </Label>
        <input
              id="diagnosisName"
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter diagnosis name"
              value={formData.name}
              onChange={e => updateFormData("name", e.target.value)}
          required
        />
          </div>

          {/* Complications Section Header */}
          <div className="pt-2 border-t">
            <h4 className="text-md font-medium mb-2">Common Complications</h4>
            <p className="text-sm text-gray-500 mb-3">
              Select up to 4 common complications associated with this diagnosis
            </p>
          </div>
          
          {/* Complication 1 */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="complication1" className="font-medium">
              Complication 1
            </Label>
            <Select 
              value={formData.complication1} 
              onValueChange={(value) => updateFormData("complication1", value)}
            >
              <SelectTrigger id="complication1">
                <SelectValue placeholder="Select a complication" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {availableComplications.map((complication) => (
                  <SelectItem key={complication.id} value={complication.name}>
                    {complication.name} ({complication.riskLevel} risk)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Complication 2 */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="complication2" className="font-medium">
              Complication 2
            </Label>
            <Select 
              value={formData.complication2} 
              onValueChange={(value) => updateFormData("complication2", value)}
            >
              <SelectTrigger id="complication2">
                <SelectValue placeholder="Select a complication" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {availableComplications.map((complication) => (
                  <SelectItem key={complication.id} value={complication.name}>
                    {complication.name} ({complication.riskLevel} risk)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Complication 3 */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="complication3" className="font-medium">
              Complication 3
            </Label>
            <Select 
              value={formData.complication3} 
              onValueChange={(value) => updateFormData("complication3", value)}
            >
              <SelectTrigger id="complication3">
                <SelectValue placeholder="Select a complication" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {availableComplications.map((complication) => (
                  <SelectItem key={complication.id} value={complication.name}>
                    {complication.name} ({complication.riskLevel} risk)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Complication 4 */}
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="complication4" className="font-medium">
              Complication 4
            </Label>
            <Select 
              value={formData.complication4} 
              onValueChange={(value) => updateFormData("complication4", value)}
            >
              <SelectTrigger id="complication4">
                <SelectValue placeholder="Select a complication" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {availableComplications.map((complication) => (
                  <SelectItem key={complication.id} value={complication.name}>
                    {complication.name} ({complication.riskLevel} risk)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" className="px-3 py-1 rounded border" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
} 