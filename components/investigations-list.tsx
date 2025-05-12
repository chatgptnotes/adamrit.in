"use client"

import { Pencil, Trash2, Eye } from "lucide-react";

// Mock data - in a real app, this would come from an API based on the selected complication
const mockInvestigations = {
  c1: [
    { id: "i1", name: "Blood Glucose", value: "250-600 mg/dL", normal: "70-140 mg/dL" },
    { id: "i2", name: "Arterial Blood Gas", value: "pH < 7.3", normal: "pH 7.35-7.45" },
    { id: "i3", name: "Serum Ketones", value: "Positive", normal: "Negative" },
    { id: "i12", name: "Chest X-ray", value: "Infiltrates", normal: "Clear" },
    { id: "i13", name: "CBC", value: "WBC 12,000", normal: "WBC 4,000-11,000" },
    { id: "i14", name: "Liver Function Test", value: "ALT 60", normal: "ALT < 40" },
    { id: "i15", name: "Kidney Function Test", value: "Creatinine 1.5", normal: "0.6-1.2" },
    { id: "i16", name: "Urine Routine", value: "Protein +", normal: "Negative" },
    { id: "i17", name: "ECG", value: "Sinus Tachycardia", normal: "Normal" },
    { id: "i18", name: "Ultrasound Abdomen", value: "Mild fatty liver", normal: "Normal" },
  ],
  c2: [
    { id: "i4", name: "Blood Glucose", value: "< 70 mg/dL", normal: "70-140 mg/dL" },
    { id: "i19", name: "CBC", value: "WBC 10,000", normal: "WBC 4,000-11,000" },
    { id: "i20", name: "Urine Routine", value: "Normal", normal: "Normal" },
    { id: "i21", name: "Chest X-ray", value: "Normal", normal: "Clear" },
    { id: "i22", name: "MRI Brain", value: "Normal", normal: "Normal" },
  ],
  c3: [
    { id: "i5", name: "Nerve Conduction Study", value: "Reduced conduction velocity", normal: "Normal conduction" },
    { id: "i6", name: "Monofilament Test", value: "Reduced sensation", normal: "Normal sensation" },
    { id: "i23", name: "CBC", value: "WBC 8,000", normal: "WBC 4,000-11,000" },
    { id: "i24", name: "Liver Function Test", value: "Normal", normal: "ALT < 40" },
    { id: "i25", name: "CT Head", value: "Normal", normal: "Normal" },
  ],
  c9: [
    { id: "i7", name: "ECG", value: "ST depression", normal: "No ST changes" },
    { id: "i8", name: "Troponin", value: "Normal", normal: "< 0.04 ng/mL" },
    { id: "i26", name: "CBC", value: "WBC 9,000", normal: "WBC 4,000-11,000" },
    { id: "i27", name: "Chest X-ray", value: "Normal", normal: "Clear" },
    { id: "i28", name: "Ultrasound Heart", value: "Normal", normal: "Normal" },
  ],
  c10: [
    { id: "i9", name: "ECG", value: "ST elevation", normal: "No ST changes" },
    { id: "i10", name: "Troponin", value: "Elevated", normal: "< 0.04 ng/mL" },
    { id: "i11", name: "CK-MB", value: "Elevated", normal: "< 25 U/L" },
    { id: "i29", name: "CBC", value: "WBC 11,000", normal: "WBC 4,000-11,000" },
    { id: "i30", name: "CT Chest", value: "Normal", normal: "Normal" },
    { id: "i31", name: "Liver Function Test", value: "ALT 45", normal: "ALT < 40" },
  ],
  // Surgery complications
  sc1: [
    { id: "si1", name: "Blood Glucose", value: "250-600 mg/dL", normal: "70-140 mg/dL" },
    { id: "si2", name: "Serum Ketones", value: "Positive", normal: "Negative" },
    { id: "si4", name: "Chest X-ray", value: "Normal", normal: "Clear" },
    { id: "si5", name: "CBC", value: "WBC 7,000", normal: "WBC 4,000-11,000" },
    { id: "si6", name: "Ultrasound Abdomen", value: "Normal", normal: "Normal" },
    { id: "si7", name: "Liver Function Test", value: "ALT 38", normal: "ALT < 40" },
    { id: "si8", name: "Kidney Function Test", value: "Creatinine 1.0", normal: "0.6-1.2" },
  ],
  sc3: [
    { id: "si3", name: "Nerve Conduction Study", value: "Reduced", normal: "Normal" },
    { id: "si9", name: "CBC", value: "WBC 8,500", normal: "WBC 4,000-11,000" },
    { id: "si10", name: "MRI Spine", value: "Disc bulge", normal: "Normal" },
    { id: "si11", name: "Urine Routine", value: "Normal", normal: "Normal" },
  ],
  // Default basic investigations for any diagnosis
  basic: [
    { id: "bi1", name: "CBC", value: "WBC 9,500", normal: "WBC 4,000-11,000" },
    { id: "bi2", name: "Blood Glucose", value: "110 mg/dL", normal: "70-140 mg/dL" },
    { id: "bi3", name: "Urine Routine", value: "Normal", normal: "Normal" },
    { id: "bi4", name: "Liver Function Test", value: "ALT 35", normal: "ALT < 40" },
    { id: "bi5", name: "Kidney Function Test", value: "Creatinine 1.1", normal: "0.6-1.2" },
    { id: "bi6", name: "Chest X-ray", value: "Normal", normal: "Clear" },
    { id: "bi7", name: "ECG", value: "Normal", normal: "Normal" },
    { id: "bi8", name: "Ultrasound Abdomen", value: "Normal", normal: "Normal" },
    { id: "bi9", name: "CT Head", value: "Normal", normal: "Normal" },
    { id: "bi10", name: "MRI Brain", value: "Normal", normal: "Normal" },
    { id: "bi11", name: "D-Dimer", value: "0.3", normal: "< 0.5" },
    { id: "bi12", name: "CRP", value: "2.0", normal: "< 5.0" },
    { id: "bi13", name: "Procalcitonin", value: "0.1", normal: "< 0.5" },
    { id: "bi14", name: "HbA1c", value: "6.5%", normal: "< 5.7%" },
    { id: "bi15", name: "Thyroid Profile", value: "Normal", normal: "Normal" },
    { id: "bi16", name: "Lipid Profile", value: "Normal", normal: "Normal" },
    { id: "bi17", name: "Serum Calcium", value: "9.2", normal: "8.5-10.5" },
    { id: "bi18", name: "Serum Sodium", value: "140", normal: "135-145" },
    { id: "bi19", name: "Serum Potassium", value: "4.2", normal: "3.5-5.0" },
    { id: "bi20", name: "Magnesium", value: "2.0", normal: "1.7-2.2" },
  ],
}

interface InvestigationsListProps {
  complicationIds: string[];
  type?: 'radiology' | 'lab' | 'other';
  day?: string; // D1, D2, D3, D4
}

export function InvestigationsList({ complicationIds, type, day }: InvestigationsListProps) {
  // Get all investigations for all selected complications
  let allInvestigations: { id: string; name: string; value: string; normal: string }[] = [];
  
  // For each selected complication, add its investigations to the list
  complicationIds.forEach((complicationId) => {
    const investigations = mockInvestigations[complicationId as keyof typeof mockInvestigations] || [];
    investigations.forEach((investigation) => {
      // Only add if it's not already in the list (to avoid duplicates)
      if (!allInvestigations.some(i => i.id === investigation.id)) {
        allInvestigations.push(investigation);
      }
    });
  });

  // Filter by type if provided
  if (type === 'radiology') {
    allInvestigations = allInvestigations.filter(inv => {
      const n = inv.name.toLowerCase();
      return n.includes('x-ray') || n.includes('ct') || n.includes('mri') || n.includes('ultrasound') || n.includes('ecg');
    });
  } else if (type === 'lab') {
    allInvestigations = allInvestigations.filter(inv => {
      const n = inv.name.toLowerCase();
      return n.includes('cbc') || n.includes('blood') || n.includes('liver function') || n.includes('kidney function') || n.includes('urine') || n.includes('crp') || n.includes('d-dimer') || n.includes('procalcitonin') || n.includes('hba1c') || n.includes('thyroid') || n.includes('lipid') || n.includes('serum calcium') || n.includes('serum sodium') || n.includes('serum potassium') || n.includes('magnesium');
    });
  } else if (type === 'other') {
    allInvestigations = allInvestigations.filter(inv => {
      const n = inv.name.toLowerCase();
      return !(
        n.includes('x-ray') || n.includes('ct') || n.includes('mri') || n.includes('ultrasound') || n.includes('ecg') ||
        n.includes('cbc') || n.includes('blood') || n.includes('liver function') || n.includes('kidney function') || n.includes('urine') || n.includes('crp') || n.includes('d-dimer') || n.includes('procalcitonin') || n.includes('hba1c') || n.includes('thyroid') || n.includes('lipid') || n.includes('serum calcium') || n.includes('serum sodium') || n.includes('serum potassium') || n.includes('magnesium')
      );
    });
  }

  if (allInvestigations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Investigations</h2>
        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Request New Investigation</button>
      </div>
      {day && (
        <div className="mb-2 text-xs text-blue-600 font-semibold">Showing investigations for <span className="bg-blue-50 px-2 py-1 rounded-full">{day}</span></div>
      )}
      {allInvestigations.map((investigation) => (
        <div key={investigation.id} className="rounded-md border p-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-medium text-sm">{investigation.name}</h4>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-blue-50 rounded" title="Edit Investigation">
                <Pencil className="h-4 w-4 text-blue-600" />
              </button>
              <button className="p-1 hover:bg-red-50 rounded" title="Delete Investigation">
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
              <button className="p-1 hover:bg-green-50 rounded" title="View Report">
                <Eye className="h-4 w-4 text-green-600" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Expected:</span> {investigation.value}
            </div>
            <div>
              <span className="text-muted-foreground">Normal:</span> {investigation.normal}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Master list for Radiology Investigations
export const radiologyMaster = [
  { id: "r1", name: "Chest X-ray" },
  { id: "r2", name: "CT Head" },
  { id: "r3", name: "MRI Brain" },
  { id: "r4", name: "Ultrasound Abdomen" },
  { id: "r5", name: "ECG" },
];

// Master list for Lab Investigations
export const labMaster = [
  { id: "l1", name: "CBC" },
  { id: "l2", name: "Blood Glucose" },
  { id: "l3", name: "Liver Function Test" },
  { id: "l4", name: "Kidney Function Test" },
  { id: "l5", name: "Urine Routine" },
  { id: "l6", name: "CRP" },
  { id: "l7", name: "D-Dimer" },
  { id: "l8", name: "Procalcitonin" },
  { id: "l9", name: "HbA1c" },
  { id: "l10", name: "Thyroid Profile" },
  { id: "l11", name: "Lipid Profile" },
  { id: "l12", name: "Serum Calcium" },
  { id: "l13", name: "Serum Sodium" },
  { id: "l14", name: "Serum Potassium" },
  { id: "l15", name: "Magnesium" },
];

// Master list for Other Investigations
export const otherInvestigationsMaster = [
  { id: "o1", name: "Nerve Conduction Study" },
  { id: "o2", name: "Monofilament Test" },
  { id: "o3", name: "Other Special Test" },
];
