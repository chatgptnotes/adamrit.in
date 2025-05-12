"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Common type for complication
export interface Complication {
  id: string;
  name: string;
}

// Mock data - in a real app, this would come from an API based on the selected diagnosis
export const mockComplications: Record<string, Complication[]> = {
  d1: [
    { id: "c1", name: "Diabetic Ketoacidosis" },
    { id: "c2", name: "Hypoglycemia" },
    { id: "c3", name: "Diabetic Neuropathy" },
    { id: "c4", name: "Diabetic Retinopathy" },
    { id: "c5", name: "Diabetic Foot Ulcer" },
  ],
  d2: [
    { id: "c6", name: "Hypertensive Crisis" },
    { id: "c7", name: "Hypertensive Heart Disease" },
    { id: "c8", name: "Hypertensive Retinopathy" },
  ],
  d3: [
    { id: "c9", name: "Angina Pectoris" },
    { id: "c10", name: "Myocardial Infarction" },
    { id: "c11", name: "Heart Failure" },
  ],
  d4: [
    { id: "c12", name: "Chronic Kidney Disease" },
    { id: "c13", name: "Proteinuria" },
    { id: "c14", name: "Edema" },
  ],
}

// Diagnosis names for reference
const diagnosisNames: Record<string, string> = {
  'd1': 'Type 2 Diabetes Mellitus',
  'd2': 'Hypertension',
  'd3': 'Coronary Artery Disease',
  'd4': 'Diabetic Nephropathy'
}

interface ComplicationsListProps {
  diagnosisId: string
  onSelect: (ids: string[]) => void
  selected: string[]
  allSelected?: boolean // New prop to indicate if we should show all selected complications
  allDiagnoses?: string[] // List of all selected diagnoses
}

export function ComplicationsList({ 
  diagnosisId, 
  onSelect, 
  selected, 
  allSelected = false,
  allDiagnoses = []
}: ComplicationsListProps) {
  // If we're in "show all selected" mode, get complications from all diagnoses
  // Otherwise, get complications only from the current diagnosis
  let complications = [] as Array<{ id: string; name: string; diagnosisId?: string; diagnosisName?: string }>;
  
  if (allSelected) {
    // For each diagnosis, add its complications with a reference to the diagnosis
    allDiagnoses.forEach(dId => {
      const diagnosisComplications = mockComplications[dId as keyof typeof mockComplications] || [];
      complications.push(...diagnosisComplications.map(c => ({
        ...c,
        diagnosisId: dId,
        diagnosisName: diagnosisNames[dId]
      })));
    });
    
    // Filter to only include selected complications
    complications = complications.filter(c => selected.includes(c.id));
  } else {
    // Regular mode - just show complications for the current diagnosis
    complications = mockComplications[diagnosisId as keyof typeof mockComplications] || [];
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      // Add to selected if not already included
      if (!selected.includes(id)) {
        onSelect([...selected, id])
      }
    } else {
      // Remove from selected
      onSelect(selected.filter(selectedId => selectedId !== id))
    }
  }

  if (allSelected && complications.length === 0) {
    return <p className="text-sm text-muted-foreground">No complications selected. Select a diagnosis and check complications to see them listed here.</p>;
  }

  return (
    <div className="space-y-3">
      {complications.map((complication) => (
        <div key={complication.id} className="flex items-start space-x-2">
          {!allSelected ? (
            <Checkbox
              id={complication.id}
              checked={selected.includes(complication.id)}
              onCheckedChange={(checked) => handleCheckboxChange(complication.id, checked === true)}
            />
          ) : null}
          <div className="flex flex-col">
            <Label
              htmlFor={allSelected ? undefined : complication.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {complication.name}
            </Label>
            {allSelected && complication.diagnosisName && (
              <Badge variant="outline" className="mt-1 text-xs">
                {complication.diagnosisName}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
