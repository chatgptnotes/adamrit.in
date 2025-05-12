"use client"
import { Badge } from "@/components/ui/badge"
import { Trash2, Pencil, FileText } from "lucide-react"
import { useState, useEffect } from "react"

// Define diagnosis type for better type safety
export interface Diagnosis {
  id: string
  name: string
  approved: boolean
  clinicalNotes?: {
    findings: string;
    history: string;
    examination: string;
  }
}

interface DiagnosisListProps {
  onSelect: (id: string | null) => void
  selected: string | null
  diagnoses?: Diagnosis[]
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
  onViewClinicalNotes?: (id: string) => void
}

// Default diagnoses data
const defaultDiagnoses: Diagnosis[] = [
  { id: "d1", name: "Type 2 Diabetes Mellitus", approved: true },
  { id: "d2", name: "Hypertension", approved: true },
  { id: "d3", name: "Coronary Artery Disease", approved: true },
  { id: "d4", name: "Diabetic Nephropathy", approved: false },
]

export function DiagnosisList({ 
  onSelect, 
  selected, 
  diagnoses = defaultDiagnoses,
  onDelete,
  onEdit,
  onViewClinicalNotes
}: DiagnosisListProps) {
  
  const [internalDiagnoses, setInternalDiagnoses] = useState<Diagnosis[]>(defaultDiagnoses)
  
  // Update internal state when external diagnoses change
  useEffect(() => {
    if (diagnoses && diagnoses.length > 0) {
      setInternalDiagnoses(diagnoses)
    }
  }, [diagnoses])
  
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the parent onClick
    
    if (onDelete) {
      onDelete(id)
    } else {
      // Internal state management if no onDelete prop is provided
      setInternalDiagnoses(internalDiagnoses.filter(diagnosis => diagnosis.id !== id))
    }
    
    // If we're deleting the currently selected diagnosis, deselect it
    if (selected === id) {
      onSelect(null)
    }
  }

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the parent onClick
    
    if (onEdit) {
      onEdit(id)
    }
  }
  
  const handleViewClinicalNotes = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the parent onClick
    
    if (onViewClinicalNotes) {
      onViewClinicalNotes(id)
    }
  }

  // Use the prop if provided, otherwise use internal state
  const diagnosesToRender = onDelete && diagnoses ? diagnoses : internalDiagnoses

  return (
    <div className="space-y-2">
      {diagnosesToRender && diagnosesToRender.length > 0 ? (
        diagnosesToRender.map((diagnosis) => (
          <div
            key={diagnosis.id}
            className={`flex items-center justify-between rounded-md border p-2 cursor-pointer hover:bg-muted/50 ${
              selected === diagnosis.id ? "bg-muted" : ""
            }`}
            onClick={() => onSelect(diagnosis.id)}
          >
            <span className="text-sm font-medium">{diagnosis.name}</span>
            <div className="flex items-center gap-2">
              {diagnosis.approved ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                  Approved
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                  Pending
                </Badge>
              )}
              <button 
                onClick={(e) => handleViewClinicalNotes(diagnosis.id, e)}
                className="text-gray-500 hover:text-blue-500 h-5 w-5 flex items-center justify-center rounded-full hover:bg-gray-100"
                title="Clinical Notes"
              >
                <FileText size={14} />
              </button>
              <button 
                onClick={(e) => handleEdit(diagnosis.id, e)}
                className="text-gray-500 hover:text-blue-500 h-5 w-5 flex items-center justify-center rounded-full hover:bg-gray-100"
                title="Edit diagnosis"
              >
                <Pencil size={14} />
              </button>
              <button 
                onClick={(e) => handleDelete(diagnosis.id, e)}
                className="text-gray-500 hover:text-red-500 h-5 w-5 flex items-center justify-center rounded-full hover:bg-gray-100"
                title="Delete diagnosis"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          No diagnoses found.
        </div>
      )}
    </div>
  )
}
