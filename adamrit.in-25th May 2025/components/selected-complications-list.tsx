"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComplicationsList } from "@/components/complications-list"
import { SurgeryComplicationsList } from "@/components/surgery-complications-list"

interface SelectedComplicationsListProps {
  diagnosisComplications: string[]
  surgeryComplications: string[]
  selectedDiagnoses: string[]
  selectedSurgeries: string[]
}

export function SelectedComplicationsList({ 
  diagnosisComplications,
  surgeryComplications,
  selectedDiagnoses,
  selectedSurgeries
}: SelectedComplicationsListProps) {
  const hasDiagnosisComplications = diagnosisComplications.length > 0;
  const hasSurgeryComplications = surgeryComplications.length > 0;
  
  if (!hasDiagnosisComplications && !hasSurgeryComplications) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Selected Complications</CardTitle>
          <CardDescription>All selected complications</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No complications selected yet. Select a diagnosis or surgery and check complications to see them listed here.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Selected Complications</CardTitle>
        <CardDescription>All selected complications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {hasDiagnosisComplications && (
            <div>
              <h3 className="text-sm font-medium mb-2">From Diagnoses:</h3>
              <ComplicationsList 
                diagnosisId="" // Not used in allSelected mode
                onSelect={() => {}} // Read-only view
                selected={diagnosisComplications}
                allSelected={true}
                allDiagnoses={selectedDiagnoses}
              />
            </div>
          )}
          
          {hasSurgeryComplications && (
            <div>
              <h3 className="text-sm font-medium mb-2">From Surgeries:</h3>
              <SurgeryComplicationsList
                surgeryId="" // Not used in allSelected mode
                onSelect={() => {}} // Read-only view
                selected={surgeryComplications}
                allSelected={true}
                allSurgeries={selectedSurgeries}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 