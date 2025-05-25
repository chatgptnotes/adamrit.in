"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"

// Mock database of diagnoses
const diagnosisDatabase = [
  { id: "d5", name: "Chronic Kidney Disease", icd: "N18" },
  { id: "d6", name: "Asthma", icd: "J45" },
  { id: "d7", name: "Rheumatoid Arthritis", icd: "M05" },
  { id: "d8", name: "Congestive Heart Failure", icd: "I50" },
  { id: "d9", name: "Chronic Obstructive Pulmonary Disease", icd: "J44" },
  { id: "d10", name: "Osteoporosis", icd: "M81" },
  { id: "d11", name: "Parkinson's Disease", icd: "G20" },
  { id: "d12", name: "Multiple Sclerosis", icd: "G35" },
  { id: "d13", name: "Hypothyroidism", icd: "E03" },
  { id: "d14", name: "Alzheimer's Disease", icd: "G30" },
  { id: "d15", name: "Epilepsy", icd: "G40" },
  { id: "d16", name: "Gastroesophageal Reflux Disease", icd: "K21" },
  { id: "d17", name: "Migraine", icd: "G43" },
  { id: "d18", name: "Anemia", icd: "D64" },
  { id: "d19", name: "Glaucoma", icd: "H40" },
  { id: "d20", name: "Psoriasis", icd: "L40" },
]

interface DiagnosisSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddDiagnosis: (diagnosis: { id: string; name: string }) => void
}

export function DiagnosisSearchDialog({
  open,
  onOpenChange,
  onAddDiagnosis,
}: DiagnosisSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filter diagnoses based on search term
  const filteredDiagnoses = diagnosisDatabase.filter(
    (diagnosis) => 
      diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.icd.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Diagnosis</DialogTitle>
          <DialogDescription>
            Search for a diagnosis to add to this patient's record.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            placeholder="Search by diagnosis name or ICD code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="mt-4 max-h-[300px] overflow-y-auto border rounded-md">
          {filteredDiagnoses.length > 0 ? (
            <div className="divide-y">
              {filteredDiagnoses.map((diagnosis) => (
                <div 
                  key={diagnosis.id}
                  className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{diagnosis.name}</p>
                    <p className="text-sm text-muted-foreground">ICD: {diagnosis.icd}</p>
                  </div>
                  <Button
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      onAddDiagnosis({ id: diagnosis.id, name: diagnosis.name });
                      onOpenChange(false);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No diagnoses found. Try a different search term.
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 