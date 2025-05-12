"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Complication } from "./complications-list"

// Mock data - in a real app, this would come from an API based on the selected surgery
export const mockSurgeryComplications: Record<string, Complication[]> = {
  s1: [
    { id: "sc1", name: "Diabetic Ketoacidosis" },
    { id: "sc2", name: "Hypoglycemia" },
    { id: "sc3", name: "Diabetic Neuropathy" },
    { id: "sc4", name: "Diabetic Retinopathy" },
    { id: "sc5", name: "Diabetic Foot Ulcer" },
  ],
  s2: [
    { id: "sc6", name: "Diabetic Ketoacidosis" },
    { id: "sc7", name: "Hypoglycemia" },
    { id: "sc8", name: "Diabetic Neuropathy" },
    { id: "sc9", name: "Diabetic Retinopathy" },
  ],
  s3: [
    { id: "sc10", name: "Diabetic Ketoacidosis" },
    { id: "sc11", name: "Hypoglycemia" },
  ],
  s4: [
    { id: "sc12", name: "Diabetic Neuropathy" },
    { id: "sc13", name: "Diabetic Retinopathy" },
    { id: "sc14", name: "Diabetic Foot Ulcer" },
  ],
}

// Surgery names for reference
const surgeryNames: Record<string, string> = {
  's1': 'Laparoscopic Cholecystectomy',
  's2': 'Coronary Angioplasty',
  's3': 'Cataract Surgery',
  's4': 'Total Knee Replacement',
}

interface SurgeryComplicationsListProps {
  surgeryId: string
  onSelect: (ids: string[]) => void
  selected: string[]
  allSelected?: boolean // New prop to indicate if we should show all selected complications
  allSurgeries?: string[] // List of all selected surgeries
}

export function SurgeryComplicationsList({ 
  surgeryId, 
  onSelect, 
  selected,
  allSelected = false,
  allSurgeries = []
}: SurgeryComplicationsListProps) {
  // If we're in "show all selected" mode, get complications from all surgeries
  // Otherwise, get complications only from the current surgery
  let complications = [] as Array<{ id: string; name: string; surgeryId?: string; surgeryName?: string }>;
  
  if (allSelected) {
    // For each surgery, add its complications with a reference to the surgery
    allSurgeries.forEach(sId => {
      const surgeryComplications = mockSurgeryComplications[sId as keyof typeof mockSurgeryComplications] || [];
      complications.push(...surgeryComplications.map(c => ({
        ...c,
        surgeryId: sId,
        surgeryName: surgeryNames[sId]
      })));
    });
    
    // Filter to only include selected complications
    complications = complications.filter(c => selected.includes(c.id));
  } else {
    // Regular mode - just show complications for the current surgery
    complications = mockSurgeryComplications[surgeryId as keyof typeof mockSurgeryComplications] || [];
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
    return <p className="text-sm text-muted-foreground">No complications selected. Select a surgery and check complications to see them listed here.</p>;
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
            {allSelected && complication.surgeryName && (
              <Badge variant="outline" className="mt-1 text-xs">
                {complication.surgeryName}
              </Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 