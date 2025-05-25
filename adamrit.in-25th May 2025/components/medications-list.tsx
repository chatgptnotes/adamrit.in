"use client"

// Mock data - in a real app, this would come from an API based on the selected complication
const mockMedications = {
  c1: [
    { id: "m1", name: "Regular Insulin", dosage: "0.1 units/kg/hr IV infusion", duration: "Until resolution" },
    { id: "m2", name: "Normal Saline", dosage: "1L over 1 hour, then 500mL/hr", duration: "Until hydrated" },
    { id: "m3", name: "Potassium Chloride", dosage: "As per serum levels", duration: "As needed" },
    { id: "m13", name: "Metformin", dosage: "500mg twice daily", duration: "Ongoing" },
    { id: "m14", name: "Lisinopril", dosage: "10mg once daily", duration: "Ongoing" },
    { id: "m15", name: "Amlodipine", dosage: "5mg once daily", duration: "Ongoing" },
    { id: "m16", name: "Furosemide", dosage: "40mg once daily", duration: "As needed" },
    { id: "m17", name: "Hydrochlorothiazide", dosage: "25mg once daily", duration: "Ongoing" },
    { id: "m18", name: "Simvastatin", dosage: "20mg at bedtime", duration: "Ongoing" },
    { id: "m19", name: "Enoxaparin", dosage: "40mg subcut daily", duration: "7 days" },
  ],
  c2: [
    { id: "m4", name: "Dextrose 50%", dosage: "50mL IV push", duration: "Once, may repeat" },
    { id: "m5", name: "Glucagon", dosage: "1mg IM/SC", duration: "Once, may repeat in 15 min" },
    { id: "m20", name: "Sodium Bicarbonate", dosage: "1 amp IV", duration: "As needed" },
    { id: "m21", name: "Calcium Gluconate", dosage: "10mL IV", duration: "As needed" },
    { id: "m22", name: "Magnesium Sulfate", dosage: "2g IV", duration: "As needed" },
    { id: "m23", name: "Vitamin K", dosage: "10mg IM", duration: "Once" },
    { id: "m24", name: "Ondansetron", dosage: "4mg IV", duration: "As needed for nausea" },
    { id: "m25", name: "Ceftriaxone", dosage: "1g IV", duration: "7 days" },
    { id: "m26", name: "Azithromycin", dosage: "500mg once daily", duration: "5 days" },
    { id: "m27", name: "Levofloxacin", dosage: "750mg once daily", duration: "7 days" },
  ],
  c3: [
    { id: "m6", name: "Pregabalin", dosage: "75mg twice daily", duration: "Ongoing" },
    { id: "m7", name: "Duloxetine", dosage: "60mg once daily", duration: "Ongoing" },
    { id: "m28", name: "Gabapentin", dosage: "300mg three times daily", duration: "Ongoing" },
    { id: "m29", name: "Amitriptyline", dosage: "10mg at bedtime", duration: "Ongoing" },
    { id: "m30", name: "Tramadol", dosage: "50mg as needed", duration: "As needed" },
    { id: "m31", name: "Ibuprofen", dosage: "400mg every 8 hours", duration: "As needed" },
    { id: "m32", name: "Diclofenac", dosage: "50mg twice daily", duration: "5 days" },
    { id: "m33", name: "Paracetamol", dosage: "500mg every 6 hours", duration: "As needed" },
    { id: "m34", name: "Codeine", dosage: "30mg every 6 hours", duration: "As needed" },
    { id: "m35", name: "Morphine", dosage: "2mg IV", duration: "As needed" },
  ],
  c9: [
    { id: "m8", name: "Nitroglycerin", dosage: "0.4mg sublingual", duration: "As needed for chest pain" },
    { id: "m9", name: "Aspirin", dosage: "325mg", duration: "Once" },
    { id: "m36", name: "Clopidogrel", dosage: "75mg daily", duration: "Ongoing" },
    { id: "m37", name: "Atorvastatin", dosage: "40mg daily", duration: "Ongoing" },
    { id: "m38", name: "Bisoprolol", dosage: "5mg once daily", duration: "Ongoing" },
    { id: "m39", name: "Ramipril", dosage: "2.5mg once daily", duration: "Ongoing" },
    { id: "m40", name: "Eplerenone", dosage: "25mg once daily", duration: "Ongoing" },
    { id: "m41", name: "Furosemide", dosage: "40mg once daily", duration: "As needed" },
    { id: "m42", name: "Spironolactone", dosage: "25mg once daily", duration: "Ongoing" },
    { id: "m43", name: "Enalapril", dosage: "5mg twice daily", duration: "Ongoing" },
  ],
  c10: [
    { id: "m10", name: "Aspirin", dosage: "325mg", duration: "Once, then 81mg daily" },
    { id: "m11", name: "Clopidogrel", dosage: "300mg loading, then 75mg daily", duration: "1 year" },
    { id: "m12", name: "Atorvastatin", dosage: "80mg daily", duration: "Ongoing" },
    { id: "m44", name: "Rosuvastatin", dosage: "20mg daily", duration: "Ongoing" },
    { id: "m45", name: "Ticagrelor", dosage: "90mg twice daily", duration: "1 year" },
    { id: "m46", name: "Metoprolol", dosage: "50mg twice daily", duration: "Ongoing" },
    { id: "m47", name: "Ivabradine", dosage: "5mg twice daily", duration: "Ongoing" },
    { id: "m48", name: "Diltiazem", dosage: "60mg three times daily", duration: "Ongoing" },
    { id: "m49", name: "Verapamil", dosage: "80mg three times daily", duration: "Ongoing" },
    { id: "m50", name: "Digoxin", dosage: "0.25mg once daily", duration: "Ongoing" },
  ],
  // Surgery complications
  sc1: [
    { id: "sm1", name: "Regular Insulin", dosage: "0.1 units/kg/hr IV infusion", duration: "Until resolution" },
    { id: "sm2", name: "Metformin", dosage: "500mg twice daily", duration: "Ongoing" },
    { id: "sm5", name: "Cefazolin", dosage: "1g IV before surgery", duration: "Once" },
    { id: "sm6", name: "Cefuroxime", dosage: "1.5g IV", duration: "Once" },
    { id: "sm7", name: "Amoxicillin-Clavulanate", dosage: "1.2g IV", duration: "7 days" },
    { id: "sm8", name: "Gentamicin", dosage: "80mg IV", duration: "Once" },
    { id: "sm9", name: "Vancomycin", dosage: "1g IV", duration: "Once" },
    { id: "sm10", name: "Linezolid", dosage: "600mg twice daily", duration: "7 days" },
    { id: "sm11", name: "Piperacillin-Tazobactam", dosage: "4.5g IV", duration: "7 days" },
    { id: "sm12", name: "Meropenem", dosage: "1g IV", duration: "7 days" },
  ],
  sc3: [
    { id: "sm3", name: "Pregabalin", dosage: "75mg twice daily", duration: "Ongoing" },
    { id: "sm4", name: "Gabapentin", dosage: "300mg three times daily", duration: "Ongoing" },
    { id: "sm13", name: "Tramadol", dosage: "50mg as needed", duration: "As needed" },
    { id: "sm14", name: "Paracetamol", dosage: "500mg every 6 hours", duration: "As needed" },
    { id: "sm15", name: "Ibuprofen", dosage: "400mg every 8 hours", duration: "As needed" },
    { id: "sm16", name: "Diclofenac", dosage: "50mg twice daily", duration: "5 days" },
    { id: "sm17", name: "Morphine", dosage: "2mg IV", duration: "As needed" },
    { id: "sm18", name: "Codeine", dosage: "30mg every 6 hours", duration: "As needed" },
    { id: "sm19", name: "Amitriptyline", dosage: "10mg at bedtime", duration: "Ongoing" },
    { id: "sm20", name: "Duloxetine", dosage: "60mg once daily", duration: "Ongoing" },
  ],
  // Default basic medications for any diagnosis
  basic: [
    { id: "bm1", name: "Paracetamol", dosage: "500mg every 6 hours", duration: "As needed for fever/pain" },
    { id: "bm2", name: "Pantoprazole", dosage: "40mg once daily", duration: "5 days" },
    { id: "bm3", name: "Multivitamin", dosage: "1 tablet daily", duration: "7 days" },
    { id: "bm4", name: "Cefixime", dosage: "200mg twice daily", duration: "5 days" },
    { id: "bm5", name: "Amoxicillin", dosage: "500mg three times daily", duration: "7 days" },
    { id: "bm6", name: "Vitamin C", dosage: "500mg once daily", duration: "7 days" },
    { id: "bm7", name: "Calcium Carbonate", dosage: "500mg once daily", duration: "7 days" },
    { id: "bm8", name: "Folic Acid", dosage: "5mg once daily", duration: "7 days" },
    { id: "bm9", name: "Iron Sucrose", dosage: "100mg IV", duration: "5 doses" },
    { id: "bm10", name: "Doxycycline", dosage: "100mg twice daily", duration: "7 days" },
    { id: "bm11", name: "Azithromycin", dosage: "500mg once daily", duration: "3 days" },
    { id: "bm12", name: "Cetirizine", dosage: "10mg once daily", duration: "As needed" },
    { id: "bm13", name: "Loratadine", dosage: "10mg once daily", duration: "As needed" },
    { id: "bm14", name: "Salbutamol Inhaler", dosage: "2 puffs as needed", duration: "As needed" },
    { id: "bm15", name: "Budesonide Inhaler", dosage: "2 puffs twice daily", duration: "Ongoing" },
    { id: "bm16", name: "Metformin", dosage: "500mg twice daily", duration: "Ongoing" },
    { id: "bm17", name: "Gliclazide", dosage: "40mg once daily", duration: "Ongoing" },
    { id: "bm18", name: "Insulin Glargine", dosage: "10 units at bedtime", duration: "Ongoing" },
    { id: "bm19", name: "Losartan", dosage: "50mg once daily", duration: "Ongoing" },
    { id: "bm20", name: "Amlodipine", dosage: "5mg once daily", duration: "Ongoing" },
  ],
}

// Dummy medications for D1, D2, D3, D4
const mockMedicationsByDay: { [key: string]: { id: string; name: string; dosage: string; duration: string }[] } = {
  D1: [
    { id: "d1m1", name: "Paracetamol", dosage: "500mg every 6 hours", duration: "1 day" },
    { id: "d1m2", name: "Amoxicillin", dosage: "500mg three times daily", duration: "1 day" },
  ],
  D2: [
    { id: "d2m1", name: "Ibuprofen", dosage: "400mg every 8 hours", duration: "1 day" },
    { id: "d2m2", name: "Cefixime", dosage: "200mg twice daily", duration: "1 day" },
  ],
  D3: [
    { id: "d3m1", name: "Azithromycin", dosage: "500mg once daily", duration: "1 day" },
    { id: "d3m2", name: "Vitamin C", dosage: "500mg once daily", duration: "1 day" },
  ],
  D4: [
    { id: "d4m1", name: "Pantoprazole", dosage: "40mg once daily", duration: "1 day" },
    { id: "d4m2", name: "Multivitamin", dosage: "1 tablet daily", duration: "1 day" },
  ],
};

interface MedicationsListProps {
  complicationIds: string[];
  day?: string; // D1, D2, D3, D4
}

export function MedicationsList({ complicationIds, day }: MedicationsListProps) {
  // Get all medications for all selected complications
  const allMedications: { id: string; name: string; dosage: string; duration: string }[] = [];
  
  // Always show dummy medications for the selected day at the top
  if (day && mockMedicationsByDay[day]) {
    mockMedicationsByDay[day].forEach((medication: any) => {
      allMedications.push(medication);
    });
  }
  // For each selected complication, add its medications to the list (but skip if ID already exists)
  complicationIds.forEach((complicationId) => {
    const medications = mockMedications[complicationId as keyof typeof mockMedications] || [];
    medications.forEach((medication) => {
      if (!allMedications.some(m => m.id === medication.id)) {
        allMedications.push(medication);
      }
    });
  });

  if (allMedications.length === 0) {
    return <p className="text-sm text-muted-foreground">No medications recommended for selected complications.</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Medications</h2>
        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Request New Medication</button>
      </div>
      {day && (
        <div className="mb-2 text-xs text-blue-600 font-semibold">Showing medications for <span className="bg-blue-50 px-2 py-1 rounded-full">{day}</span></div>
      )}
      {allMedications.map((medication) => (
        <div key={medication.id} className="rounded-md border p-3">
          <h4 className="font-medium text-sm">{medication.name}</h4>
          <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
            <div>
              <span className="text-muted-foreground">Dosage:</span> {medication.dosage}
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span> {medication.duration}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
