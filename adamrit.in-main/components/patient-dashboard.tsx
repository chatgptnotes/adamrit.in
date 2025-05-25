"use client"

import { useEffect, useState, useRef } from "react"
import { DiagnosisManager } from "./DiagnosisManager"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ComplicationsList, mockComplications } from "@/components/complications-list"
import { SurgeryComplicationsList, mockSurgeryComplications } from "@/components/surgery-complications-list"
import { InvestigationsList } from "@/components/investigations-list"
import { MedicationsList } from "@/components/medications-list"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { SelectedComplicationsList } from "@/components/selected-complications-list"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { 
  PlusCircle, 
  FileText, 
  AlertCircle, 
  UserRound, 
  CalendarDays, 
  Phone, 
  Printer, 
  ClipboardCheck,
  Receipt,
  Search,
  Plus,
  XCircle,
  Scissors,
  ClipboardList,
  Trash2,
  ChevronUp,
  ChevronDown
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import React from "react"
import { useRouter, useParams } from "next/navigation"
import { DiagnosisList } from "@/components/diagnosis-list"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase/client"; // Make sure this import is correct

// Mock patient data
const patientData = {
  id: "ESIC-2023-1001",
  name: "Rahul Sharma",
  age: 42,
  gender: "Male",
  phone: "+91 98765 43210",
  address: "123 Park Street, New Delhi",
  insuranceStatus: "Active",
  registrationDate: "15 Jan 2023",
  lastVisit: "22 Apr 2023",
  dateOfAdmission: "10 Jun 2023",
  dateOfDischarge: "15 Jun 2023"
};

// Mock visit history data
const visitHistoryData = [
  {
    visitId: "VISIT-2023-0087",
    date: "22 Apr 2023",
    reason: "Follow-up for diabetes management",
    doctor: "Dr. Neha Patel",
    department: "Endocrinology", 
    notes: "Patient's blood sugar levels are stable. Continue with current medication."
  },
  {
    visitId: "VISIT-2023-0042",
    date: "18 Mar 2023",
    reason: "Regular check-up",
    doctor: "Dr. Vikram Singh",
    department: "General Medicine",
    notes: "Vital signs normal. Recommended annual eye examination."
  },
  {
    visitId: "VISIT-2023-0015",
    date: "04 Feb 2023",
    reason: "Eye examination",
    doctor: "Dr. Anjali Gupta",
    department: "Ophthalmology",
    notes: "Early signs of diabetic retinopathy. Scheduled for follow-up in 3 months."
  },
];

// Add this at the top of the file (after imports):
export const doctorMasterList = [
  { id: 'dr1', name: 'Dr. Dhiraj Gupta MS. (Ortho)' },
  { id: 'dr2', name: 'Dr. Ashwin Chinchkhede (MD. Med.)' },
  // Add more doctors here as needed
];

// Re-add the surgery data since we still need it
// Surgery interface to match cghs_surgery table
interface Surgery {
  id: number;
  name: string;
  description: string;
  cghs_code: string;
  amount: number;
  category: string;
  duration_days: number;
  is_active: boolean;
}

// Define the Diagnosis type since it's still used in some places
interface Diagnosis {
  id: string;
  name: string;
  approved: boolean;
}

// Add the missing interface definition for SelectedComplicationsList
interface SelectedComplicationsListProps {
  surgeryComplications: string[];
  selectedSurgeries: string[];
  diagnosisComplications?: string[];
  selectedDiagnoses?: string[];
}

// Add some mock diagnoses data
// Add this after the surgeries array
const initialDiagnoses: Diagnosis[] = [
  { id: "d1", name: "Type 2 Diabetes Mellitus", approved: true },
  { id: "d2", name: "Hypertension", approved: true },
  { id: "d3", name: "Coronary Artery Disease", approved: true },
  { id: "d4", name: "Diabetic Nephropathy", approved: false },
]

// Add a mock database of diagnoses for search
// Add this after initialDiagnoses
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

// Add these interfaces at the top of the file, after the imports
interface InvoiceSubItem {
  sr: string;
  item: string;
  code?: string;
  rate: string;
  qty: number;
  amount: string;
  details?: string;
}

interface InvoiceItem {
  section?: string;
  sr?: string;
  item?: string;
  code?: string;
  rate?: string;
  qty?: number;
  amount?: string;
  details?: string;
  sub?: InvoiceSubItem[];
}

// Add print styles as a constant
const printStyles = `
  @media print {
    html, body {
      width: 210mm;
      min-height: 297mm;
      font-size: 12px;
      color: #000;
    }
    .invoice-a4-page {
      page-break-after: always;
      width: 100%;
      min-height: 297mm;
      box-sizing: border-box;
      padding: 20mm 10mm;
    }
    .no-print { display: none !important; }
  }
  .invoice-table th, .invoice-table td {
    border: 1px solid #000;
    padding: 4px 6px;
    font-size: 12px;
  }
  .invoice-table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 8px;
  }
  .invoice-header {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    border: 1px solid #000;
    padding: 4px;
  }
  .invoice-section-title {
    font-weight: bold;
    background: #f2f2f2;
  }
  .invoice-green {
    background: #b6e7b0;
    font-weight: bold;
  }
  .invoice-total-row {
    font-weight: bold;
    font-size: 16px;
    background: #f2f2f2;
  }
`;

function InvoicePage({ patientId, diagnoses, conservativeStart, conservativeEnd, surgicalStart, surgicalEnd, visits }: {
  patientId: string,
  diagnoses: Diagnosis[],
  conservativeStart: string,
  conservativeEnd: string,
  surgicalStart: string,
  surgicalEnd: string,
  visits: Visit[]
}) {
  // State for patient and visit data
  const [patientUniqueId, setPatientUniqueId] = useState<string>('');
  const [allVisits, setAllVisits] = useState<Visit[]>([]);
  const [patientData, setPatientData] = useState<any>(null);
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  // Format visit_id to bill number format
  const formatBillNumber = (visitId: string) => {
    const number = visitId.split('-')[1] || '04003';
    return `BL24D-16/04`;
  };

  // Format claim ID
  const formatClaimId = () => {
    return '29935890';
  };

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch visits
        const { data: visitsData, error: visitsError } = await supabase
          .from('visits')
          .select('*')
          .order('created_at', { ascending: false });

        if (visitsError) {
          console.error("Error fetching visits:", visitsError);
          return;
        }

        // Fetch doctors
        const { data: doctorsData, error: doctorsError } = await supabase
          .from('doctors')
          .select('*')
          .order('name');

        if (doctorsError) {
          console.error("Error fetching doctors:", doctorsError);
        } else {
          console.log("✅ Successfully fetched doctors:", doctorsData);
          setDoctors(doctorsData || []);
        }

        if (visitsData && visitsData.length > 0) {
          setAllVisits(visitsData);
          const latestVisit = visitsData[0];
          
          const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .select('*')
            .eq('unique_id', latestVisit.patient_unique_id)
            .single();

          if (patientError) {
            console.error("Error fetching patient data:", patientError);
            return;
          }

          if (patientData) {
            setPatientData(patientData);
            setPatientUniqueId(latestVisit.patient_unique_id);
          }
        }
      } catch (err) {
        console.error("Error in fetchData:", err);
      }
    }

    fetchData();
  }, []);

  // Initialize comprehensive invoice items
  useEffect(() => {
    if (patientData && allVisits.length > 0) {
      const latestVisit = allVisits[0];
      const items = [
        // Conservative Treatment Section
        { 
          type: "section", 
          title: "Conservative Treatment", 
          dateRange: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`
        },
        
        // Surgical Package Section
        { 
          type: "section", 
          title: "Surgical Package (5 Days)", 
          dateRange: `Dt. (${surgicalStart.split('-').reverse().join('/')} TO ${surgicalEnd.split('-').reverse().join('/')})`
        },
        
        // 1) Consultation for Inpatients
        {
          type: "main",
          sr: "1)",
          item: "Consultation for Inpatients",
          code: "2",
          subItems: [
            {
              sr: "i)",
              item: "Dr. Pranal Sahare,(Urologist)",
              details: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`,
              rate: 350.00,
              qty: 8,
              amount: 2800.00
            },
            {
              sr: "ii)",
              item: "Dr. Ashwin Chichkhede, MD (Medicine)",
              details: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`,
              rate: 350.00,
              qty: 8,
              amount: 2800.00
            }
          ]
        },
        
        // 2) Accommodation Charges
        {
          type: "main",
          sr: "2)",
          item: "Accommodation Charges",
          subItems: [
            {
              sr: "i)",
              item: "Accommodation For General Ward",
              details: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`,
              rate: 1500.00,
              qty: 8,
              amount: 12000.00
            }
          ]
        },
        
        // 3) Pathology Charges
        {
          type: "main",
          sr: "3)",
          item: "Pathology Charges",
          details: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`,
          note: "Note:Attached Pathology Break-up",
          rate: 3545.00,
          qty: 1,
          amount: 3545.00
        },
        
        // 4) Medicine Charges
        {
          type: "main",
          sr: "4)",
          item: "Medicine Charges",
          details: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`,
          note: "Note:Attached Pharmacy Statement with Bills",
          rate: 9343.00,
          qty: 1,
          amount: 9343.00
        },
        
        // 5) OTHER CHARGES
        {
          type: "main",
          sr: "5)",
          item: "OTHER CHARGES",
          subItems: [
            { sr: "i)", item: "ECG", code: "590", rate: 175.00, qty: 1, amount: 175.00 },
            { sr: "ii)", item: "Chest PA view", code: "1608", rate: 230.00, qty: 1, amount: 230.00 },
            { sr: "iii)", item: "Voiding-cysto-urethrogram and retrograde urethrogram(Nephrostogram)", code: "894", rate: 476.00, qty: 1, amount: 476.00 },
            { sr: "iv)", item: "Abdomen USG", code: "1591", rate: 800.00, qty: 1, amount: 800.00 },
            { sr: "v)", item: "Pelvic USG", code: "1592", rate: 500.00, qty: 1, amount: 500.00 },
            { sr: "vi)", item: "2D echocardiography", code: "592", rate: 1475.00, qty: 1, amount: 1475.00 }
          ]
        },
        
        // 7) Surgical Treatment
        {
          type: "main",
          sr: "7)",
          item: `Surgical Treatment (${surgicalStart.split('-').reverse().join('/')})`,
          subItems: [
            {
              sr: "i)",
              item: "Resection Bladder Neck Endoscopic /Bladder neckincision/transurethral incision on prostrate",
              code: "874",
              pricing: {
                baseAmount: 11308,
                primaryAdjustment: "ward10",
                discountAmount: 1130,
                finalAmount: 10178.00
              }
            },
            {
              sr: "ii)",
              item: "Suprapubic Drainage (Cystostomy/vesicostomy)",
              code: "750",
              pricing: {
                baseAmount: 6900,
                primaryAdjustment: "ward10",
                secondaryAdjustment: "guideline50",
                discountAmount: 690,
                subDiscountAmount: 6210,
                finalAmount: 3105.00
              }
            },
            {
              sr: "iii)",
              item: "Diagnostic cystoscopy",
              code: "694",
              pricing: {
                baseAmount: 3306,
                primaryAdjustment: "ward10",
                secondaryAdjustment: "guideline50",
                discountAmount: 330,
                subDiscountAmount: 2976,
                finalAmount: 1488.00
              }
            },
            {
              sr: "iv)",
              item: "Meatotomy",
              code: "780",
              pricing: {
                baseAmount: 2698,
                primaryAdjustment: "ward10",
                secondaryAdjustment: "guideline50",
                discountAmount: 269,
                subDiscountAmount: 2429,
                finalAmount: 1214.00
              }
            }
          ]
        }
      ];
      
      setInvoiceItems(items);
    }
  }, [patientData, allVisits, conservativeStart, conservativeEnd, surgicalStart, surgicalEnd]);

  const latestVisit = allVisits[0];

  if (!patientData || !latestVisit) {
    return <div className="p-4">Loading invoice...</div>;
  }

  // Calculate total
  const calculateTotal = () => {
    let total = 0;
    invoiceItems.forEach(item => {
      if (item.type === "main") {
        if (item.subItems) {
          item.subItems.forEach((sub: any) => {
            if (sub.pricing) {
              total += sub.pricing.finalAmount;
            } else {
              total += sub.amount || 0;
            }
          });
        } else {
          total += item.amount || 0;
        }
      }
    });
    return total;
  };

  // Handler to update quantity and recalculate amount
  const handleQtyChange = (itemIdx: number, subIdx?: number, newQty?: number) => {
    setInvoiceItems(prevItems => {
      return prevItems.map((item, idx) => {
        if (idx !== itemIdx || item.type !== "main") return item;
        
        if (item.subItems && typeof subIdx === 'number') {
          const newSubItems = item.subItems.map((sub: any, sIdx: number) => {
            if (sIdx !== subIdx) return sub;
            const qty = newQty || 1;
            if (sub.pricing) {
              // For surgical items with complex pricing, don't change the pricing structure
              return sub;
            } else {
              return { ...sub, qty, amount: (sub.rate * qty) };
            }
          });
          return { ...item, subItems: newSubItems };
        } else {
          const qty = newQty || 1;
          return { ...item, qty, amount: (item.rate * qty) };
        }
      });
    });
  };

  // Handler to add new row to a section
  const handleAddRow = (itemIdx: number, sectionType: string) => {
    setInvoiceItems(prevItems => {
      return prevItems.map((item, idx) => {
        if (idx !== itemIdx || item.type !== "main") return item;
        
        if (!item.subItems) return item;
        
        const newSubItem = {
          sr: `${String.fromCharCode(105 + item.subItems.length)})`, // i), ii), iii), etc.
          item: getDefaultItemName(sectionType),
          code: "",
          rate: getDefaultRate(sectionType),
          qty: 1,
          amount: getDefaultRate(sectionType)
        };

        return {
          ...item,
          subItems: [...item.subItems, newSubItem]
        };
      });
    });
  };

  // Get default item name based on section type
  const getDefaultItemName = (sectionType: string) => {
    switch (sectionType) {
      case 'consultation': return 'New Doctor Consultation';
      case 'accommodation': return 'Additional Accommodation';
      case 'other': return 'New Investigation';
      case 'surgical': return 'Additional Procedure';
      default: return 'New Item';
    }
  };

  // Get default rate based on section type
  const getDefaultRate = (sectionType: string) => {
    switch (sectionType) {
      case 'consultation': return 350.00;
      case 'accommodation': return 1500.00;
      case 'other': return 100.00;
      case 'surgical': return 1000.00;
      default: return 100.00;
    }
  };

  // Handler to update item name
  const handleItemNameChange = (itemIdx: number, subIdx: number, newName: string) => {
    setInvoiceItems(prevItems => {
      return prevItems.map((item, idx) => {
        if (idx !== itemIdx || item.type !== "main" || !item.subItems) return item;
        
        const newSubItems = item.subItems.map((sub: any, sIdx: number) => {
          if (sIdx !== subIdx) return sub;
          return { ...sub, item: newName };
        });
        
        return { ...item, subItems: newSubItems };
      });
    });
  };

  // Handler to update rate
  const handleRateChange = (itemIdx: number, subIdx?: number, newRate?: number) => {
    setInvoiceItems(prevItems => {
      return prevItems.map((item, idx) => {
        if (idx !== itemIdx || item.type !== "main") return item;
        
        if (item.subItems && typeof subIdx === 'number') {
          const newSubItems = item.subItems.map((sub: any, sIdx: number) => {
            if (sIdx !== subIdx) return sub;
            const rate = newRate || 0;
            return { ...sub, rate, amount: (rate * (sub.qty || 1)) };
          });
          return { ...item, subItems: newSubItems };
        } else {
          const rate = newRate || 0;
          return { ...item, rate, amount: (rate * (item.qty || 1)) };
        }
      });
    });
  };

  const formatDateForDisplay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // CGHS pricing adjustment options
  const cghsAdjustmentOptions = [
    { value: 'none', label: 'No Adjustment', percentage: 0, type: 'none' },
    { value: 'ward10', label: 'Less 10% Gen. Ward Charges as per CGHS', percentage: 10, type: 'discount' },
    { value: 'guideline50', label: 'Less 50% as per CGHS Guideline', percentage: 50, type: 'discount' },
    { value: 'guideline25', label: 'Less 25% as per CGHS Guideline', percentage: 25, type: 'discount' },
    { value: 'special15', label: 'Add 15% Specialward Charges as per CGHS', percentage: 15, type: 'addition' }
  ];

  // List of available consultants - now dynamic from database
  const consultantOptions = doctors.map(doctor => ({
    value: doctor.dr_id,
    label: `${doctor.name}${doctor.specialization ? ` (${doctor.specialization})` : ''}`
  }));

  // Handler to update consultant name
  const handleConsultantChange = (itemIdx: number, subIdx: number, consultantValue: string) => {
    const selectedConsultant = consultantOptions.find(opt => opt.value === consultantValue);
    if (!selectedConsultant) return;

    setInvoiceItems((prevItems: any[]) => {
      return prevItems.map((item, idx) => {
        if (idx !== itemIdx || item.type !== "main" || !item.subItems) return item;
        
        const newSubItems = item.subItems.map((sub: any, sIdx: number) => {
          if (sIdx !== subIdx) return sub;
          return { ...sub, item: selectedConsultant.label };
        });
        
        return { ...item, subItems: newSubItems };
      });
    });
  };

  // Handler to delete main items
  const handleDeleteMainItem = (itemIdx: number) => {
    setInvoiceItems(prevItems => {
      return prevItems.filter((_, idx) => idx !== itemIdx);
    });
  };

  // Handler to delete sub items
  const handleDeleteSubItem = (itemIdx: number, subIdx: number) => {
    setInvoiceItems(prevItems => {
      return prevItems.map((item, idx) => {
        if (idx !== itemIdx || item.type !== "main" || !item.subItems) return item;
        
        const newSubItems = item.subItems.filter((_: any, sIdx: number) => sIdx !== subIdx);
        return { ...item, subItems: newSubItems };
      });
    });
  };

  // Handler to move sub items up
  const handleMoveSubItemUp = (itemIdx: number, subIdx: number) => {
    if (subIdx === 0) return; // Can't move first item up
    
    setInvoiceItems(prevItems => {
      return prevItems.map((item, idx) => {
        if (idx !== itemIdx || item.type !== "main" || !item.subItems) return item;
        
        const newSubItems = [...item.subItems];
        // Swap with previous item
        [newSubItems[subIdx - 1], newSubItems[subIdx]] = [newSubItems[subIdx], newSubItems[subIdx - 1]];
        
        return { ...item, subItems: newSubItems };
      });
    });
  };

  // Handler to move sub items down
  const handleMoveSubItemDown = (itemIdx: number, subIdx: number) => {
    setInvoiceItems(prevItems => {
      return prevItems.map((item, idx) => {
        if (idx !== itemIdx || item.type !== "main" || !item.subItems) return item;
        
        if (subIdx === item.subItems.length - 1) return item; // Can't move last item down
        
        const newSubItems = [...item.subItems];
        // Swap with next item
        [newSubItems[subIdx], newSubItems[subIdx + 1]] = [newSubItems[subIdx + 1], newSubItems[subIdx]];
        
        return { ...item, subItems: newSubItems };
      });
    });
  };

  // Handler to update CGHS adjustment for surgical items
  const handleCGHSAdjustmentChange = (itemIdx: number, subIdx: number, adjustmentType: string, adjustmentValue: string) => {
    setInvoiceItems((prevItems: any[]) => {
      return prevItems.map((item, idx) => {
        if (idx !== itemIdx || item.type !== "main" || !item.subItems) return item;
        
        const newSubItems = item.subItems.map((sub: any, sIdx: number) => {
          if (sIdx !== subIdx || !sub.pricing) return sub;
          
          const selectedOption = cghsAdjustmentOptions.find(opt => opt.value === adjustmentValue);
          if (!selectedOption) return sub;
          
          const baseAmount = sub.pricing.baseAmount;
          let finalAmount = baseAmount;
          let adjustmentAmount = 0;
          
          if (adjustmentType === 'primary') {
            // Primary adjustment (10% ward charges)
            if (selectedOption.type === 'discount') {
              adjustmentAmount = Math.round(baseAmount * selectedOption.percentage / 100);
              finalAmount = baseAmount - adjustmentAmount;
            } else if (selectedOption.type === 'addition') {
              adjustmentAmount = Math.round(baseAmount * selectedOption.percentage / 100);
              finalAmount = baseAmount + adjustmentAmount;
            }
            
            // Apply secondary adjustment if exists
            if (sub.pricing.secondaryAdjustment && sub.pricing.secondaryAdjustment !== 'none') {
              const secondaryOption = cghsAdjustmentOptions.find(opt => opt.value === sub.pricing.secondaryAdjustment);
              if (secondaryOption && secondaryOption.type === 'discount') {
                const secondaryDiscount = Math.round(finalAmount * secondaryOption.percentage / 100);
                finalAmount = finalAmount - secondaryDiscount;
              }
            }
            
            return {
              ...sub,
              pricing: {
                ...sub.pricing,
                primaryAdjustment: adjustmentValue,
                discountAmount: selectedOption.type === 'discount' ? adjustmentAmount : 0,
                additionAmount: selectedOption.type === 'addition' ? adjustmentAmount : 0,
                finalAmount: finalAmount
              }
            };
          } else if (adjustmentType === 'secondary') {
            // Secondary adjustment (additional discount)
            let primaryAmount = baseAmount;
            
            // Apply primary adjustment first
            if (sub.pricing.primaryAdjustment && sub.pricing.primaryAdjustment !== 'none') {
              const primaryOption = cghsAdjustmentOptions.find(opt => opt.value === sub.pricing.primaryAdjustment);
              if (primaryOption) {
                if (primaryOption.type === 'discount') {
                  primaryAmount = baseAmount - Math.round(baseAmount * primaryOption.percentage / 100);
                } else if (primaryOption.type === 'addition') {
                  primaryAmount = baseAmount + Math.round(baseAmount * primaryOption.percentage / 100);
                }
              }
            }
            
            // Apply secondary adjustment
            if (selectedOption.type === 'discount') {
              const secondaryDiscount = Math.round(primaryAmount * selectedOption.percentage / 100);
              finalAmount = primaryAmount - secondaryDiscount;
            }
            
            return {
              ...sub,
              pricing: {
                ...sub.pricing,
                secondaryAdjustment: adjustmentValue,
                subDiscountAmount: selectedOption.type === 'discount' ? Math.round(primaryAmount * selectedOption.percentage / 100) : 0,
                finalAmount: finalAmount
              }
            };
          }
          
          return sub;
        });
        
        return { ...item, subItems: newSubItems };
      });
    });
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-a4-page bg-white shadow-lg border" style={{ maxWidth: '210mm', margin: '0 auto', padding: '16px', fontFamily: 'Arial, sans-serif' }}>

      
      <style>{`
        .invoice-table { border-collapse: collapse; width: 100%; font-size: 12px; }
        .invoice-table th, .invoice-table td { border: 1px solid #000; padding: 4px 6px; text-align: left; }
        .invoice-table th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
        .invoice-section { background-color: #f5f5f5; font-weight: bold; }
        .invoice-header { text-align: center; font-weight: bold; font-size: 16px; border: 2px solid #000; padding: 6px; margin-bottom: 2px; }
        .patient-info { font-size: 12px; margin: 8px 0; }
        .right-align { text-align: right; }
        .center-align { text-align: center; }
        .surgery-pricing { font-size: 11px; }
        
        /* Print Button Styles */
        .print-button {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }
        
        .print-button:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }
        
        @media print {
          /* Hide everything except the invoice */
          body * { visibility: hidden; }
          .invoice-a4-page, .invoice-a4-page * { visibility: visible; }
          .invoice-a4-page { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100% !important;
            box-shadow: none !important; 
            border: none !important;
            margin: 0 !important;
            padding: 10mm !important;
          }
          
          /* Hide print button during printing */
          .print-button { display: none !important; }
          .no-print { display: none !important; }
          
          /* Ensure proper page setup */
          @page {
            size: A4;
            margin: 10mm;
          }
          
          /* Make sure interactive elements are hidden */
          button:not(.print-button) { display: none !important; }
          input[type="button"] { display: none !important; }
          select { border: none !important; background: transparent !important; }
          input { border: none !important; background: transparent !important; }
        }
      `}</style>
      
      {/* Header */}
      <div className="invoice-header">FINAL BILL</div>
      <div className="invoice-header">ECHS</div>
      <div className="invoice-header">CLAIM ID - {formatClaimId()}</div>
      
      {/* Patient Information */}
      <div className="flex justify-between patient-info" style={{ marginTop: '8px', marginBottom: '8px' }}>
        <div style={{ width: '48%' }}>
          <div><strong>BILL NO</strong>: {formatBillNumber(latestVisit.visit_id)}</div>
          <div><strong>REGISTRATION NO</strong>: {patientData.unique_id || 'IH24D04003'}</div>
          <div><strong>NAME OF PATIENT</strong>: {patientData.name.toUpperCase()}</div>
          <div><strong>AGE</strong>: {patientData.age} YEARS</div>
          <div><strong>SEX</strong>: {patientData.gender.toUpperCase()}</div>
          <div><strong>NAME OF ECHS BENEFICIARY</strong>: {patientData.name.toUpperCase()}</div>
          <div><strong>RELATION WITH ECHS EMPLOYEE</strong>: SELF</div>
          <div><strong>RANK</strong>: Sep (RETD)</div>
          <div><strong>SERVICE NO</strong>: 1231207F</div>
          <div><strong>CATEGORY</strong>: <span style={{ backgroundColor: '#90EE90', padding: '2px' }}>GENERAL</span></div>
        </div>
        <div style={{ width: '48%' }}>
          <div style={{ textAlign: 'right' }}><strong>DATE:-</strong> {formatDateForDisplay(new Date().toISOString())}</div>
          <div style={{ marginTop: '20px' }}><strong>DIAGNOSIS</strong>:</div>
          <div style={{ margin: '8px 0' }}>
            URETHRAL STRICTURE WITH CYSTITIS WITH UTI WITH SEPSIS. KNOWN CASE OF PTH HTN CHRONIC OESOPHAGEAL STRICTURE.
          </div>
          <div><strong>DATE OF ADMISSION</strong>: {formatDateForDisplay(conservativeStart)}</div>
          <div><strong>DATE OF DISCHARGE</strong>: {formatDateForDisplay(conservativeEnd)}</div>
        </div>
      </div>

      {/* Main Invoice Table */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th style={{ width: '8%' }}>SR.NO</th>
            <th style={{ width: '35%' }}>ITEM</th>
            <th style={{ width: '12%' }}>CGHS NABH CODE No.</th>
            <th style={{ width: '12%' }}>CGHS NABH RATE</th>
            <th style={{ width: '8%' }}>QTY</th>
            <th style={{ width: '12%' }}>AMOUNT</th>
            <th style={{ width: '13%' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item, idx) => {
            if (item.type === "section") {
              return (
                <tr key={idx} className="invoice-section">
                  <td colSpan={7}>
                    <strong>{item.title}</strong>
                    {item.dateRange && <br />}
                    {item.dateRange}
                  </td>
                </tr>
              );
            }
            
            if (item.type === "main") {
              if (item.subItems) {
                const sectionType = item.sr === "1)" ? "consultation" : 
                                  item.sr === "2)" ? "accommodation" : 
                                  item.sr === "5)" ? "other" : 
                                  item.sr === "7)" ? "surgical" : "other";
                
                return (
                  <React.Fragment key={idx}>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                      <td><strong>{item.sr}</strong></td>
                      <td colSpan={3}><strong>{item.item}</strong></td>
                      <td>
                        <button
                          onClick={() => handleAddRow(idx, sectionType)}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                          style={{ fontSize: '10px' }}
                        >
                          + Add Row
                        </button>
                      </td>
                      <td></td>
                      <td>
                        <button
                          onClick={() => handleDeleteMainItem(idx)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
                          style={{ fontSize: '10px' }}
                          title="Delete section"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                    {item.subItems.map((sub: any, subIdx: number) => (
                      <tr key={`${idx}-${subIdx}`}>
                        <td>{sub.sr}</td>
                        <td>
                          {sectionType === "consultation" ? (
                            <select
                              value={consultantOptions.find(opt => opt.label === sub.item)?.value || ''}
                              onChange={(e) => handleConsultantChange(idx, subIdx, e.target.value)}
                              className="w-full border border-gray-300 rounded text-xs p-1 bg-white"
                              style={{ minHeight: '20px' }}
                            >
                              <option value="">Select Doctor</option>
                              {consultantOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={sub.item}
                              onChange={(e) => handleItemNameChange(idx, subIdx, e.target.value)}
                              className="w-full border-none bg-transparent text-xs p-1"
                              style={{ minHeight: '20px' }}
                            />
                          )}
                          {sub.details && <><br /><span style={{ fontSize: '11px', color: '#555' }}>{sub.details}</span></>}
                          
                          {/* Complex pricing for surgical items */}
                          {sub.pricing && (
                            <div className="surgery-pricing" style={{ marginTop: '4px' }}>
                              <div>Base Amount: {sub.pricing.baseAmount}</div>
                              
                              {/* Primary Adjustment Dropdown */}
                              <div style={{ marginTop: '2px' }}>
                                <select
                                  value={sub.pricing.primaryAdjustment || 'none'}
                                  onChange={(e) => handleCGHSAdjustmentChange(idx, subIdx, 'primary', e.target.value)}
                                  className="text-xs border rounded px-1 py-0.5 w-full"
                                  style={{ fontSize: '10px' }}
                                >
                                  {cghsAdjustmentOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                {sub.pricing.discountAmount > 0 && (
                                  <div style={{ fontSize: '10px', color: '#dc2626' }}>
                                    -{sub.pricing.discountAmount}
                                  </div>
                                )}
                                {sub.pricing.additionAmount > 0 && (
                                  <div style={{ fontSize: '10px', color: '#059669' }}>
                                    +{sub.pricing.additionAmount}
                                  </div>
                                )}
                              </div>
                              
                              {/* Secondary Adjustment Dropdown */}
                              {sub.pricing.primaryAdjustment && sub.pricing.primaryAdjustment !== 'none' && (
                                <div style={{ marginTop: '2px' }}>
                                  <select
                                    value={sub.pricing.secondaryAdjustment || 'none'}
                                    onChange={(e) => handleCGHSAdjustmentChange(idx, subIdx, 'secondary', e.target.value)}
                                    className="text-xs border rounded px-1 py-0.5 w-full"
                                    style={{ fontSize: '10px' }}
                                  >
                                    <option value="none">No Additional Adjustment</option>
                                    {cghsAdjustmentOptions.filter(opt => opt.type === 'discount').map(option => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  {sub.pricing.subDiscountAmount > 0 && (
                                    <div style={{ fontSize: '10px', color: '#dc2626' }}>
                                      -{sub.pricing.subDiscountAmount}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="center-align">
                          <input
                            type="text"
                            value={sub.code || ''}
                            className="w-full border-none bg-transparent text-xs text-center p-1"
                            style={{ minHeight: '20px' }}
                            readOnly
                          />
                        </td>
                        <td className="right-align">
                          {sub.pricing ? (
                            <div>
                              <div>{sub.pricing.baseAmount}</div>
                              <div>-{sub.pricing.discountAmount}</div>
                              {sub.pricing.subDiscountAmount && <div>-{sub.pricing.subDiscountAmount}</div>}
                            </div>
                          ) : (
                            <input
                              type="number"
                              value={sub.rate || 0}
                              onChange={(e) => handleRateChange(idx, subIdx, parseFloat(e.target.value) || 0)}
                              className="w-full border-none bg-transparent text-xs text-right p-1"
                              style={{ minHeight: '20px' }}
                              step="0.01"
                            />
                          )}
                        </td>
                        <td className="center-align">
                          {sub.pricing ? (
                            <div>
                              <div>{sub.pricing.baseAmount}</div>
                              <div>{sub.pricing.discountAmount}</div>
                              {sub.pricing.subDiscountAmount && <div>{sub.pricing.subDiscountAmount}</div>}
                            </div>
                          ) : (
                            <input
                              type="number"
                              value={sub.qty || 1}
                              onChange={(e) => handleQtyChange(idx, subIdx, parseInt(e.target.value) || 1)}
                              className="w-full border-none bg-transparent text-xs text-center p-1"
                              style={{ minHeight: '20px' }}
                              min="1"
                            />
                          )}
                        </td>
                        <td className="right-align">
                          <strong>{(sub.pricing ? sub.pricing.finalAmount : sub.amount)?.toFixed(2)}</strong>
                        </td>
                        <td className="center-align">
                          <div className="flex items-center justify-center gap-1">
                            {/* Move Up Button */}
                            <button
                              onClick={() => handleMoveSubItemUp(idx, subIdx)}
                              disabled={subIdx === 0}
                              className={`px-1 py-1 rounded transition-colors flex items-center justify-center ${
                                subIdx === 0 
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                  : 'bg-blue-500 text-white hover:bg-blue-600'
                              }`}
                              style={{ fontSize: '10px' }}
                              title="Move up"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            
                            {/* Move Down Button */}
                            <button
                              onClick={() => handleMoveSubItemDown(idx, subIdx)}
                              disabled={item.subItems && subIdx === item.subItems.length - 1}
                              className={`px-1 py-1 rounded transition-colors flex items-center justify-center ${
                                item.subItems && subIdx === item.subItems.length - 1
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                  : 'bg-blue-500 text-white hover:bg-blue-600'
                              }`}
                              style={{ fontSize: '10px' }}
                              title="Move down"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteSubItem(idx, subIdx)}
                              className="px-1 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
                              style={{ fontSize: '10px' }}
                              title="Delete row"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              } else {
                return (
                  <tr key={idx}>
                    <td><strong>{item.sr}</strong></td>
                    <td>
                      <input
                        type="text"
                        value={item.item}
                        className="w-full border-none bg-transparent text-xs p-1"
                        style={{ minHeight: '20px' }}
                        readOnly
                      />
                      {item.details && <><br /><span style={{ fontSize: '11px', color: '#555' }}>{item.details}</span></>}
                      {item.note && <><br /><span style={{ fontSize: '11px', fontStyle: 'italic' }}>{item.note}</span></>}
                    </td>
                    <td className="center-align">{item.code || ''}</td>
                    <td className="right-align">
                      <input
                        type="number"
                        value={item.rate || 0}
                        onChange={(e) => handleRateChange(idx, undefined, parseFloat(e.target.value) || 0)}
                        className="w-full border-none bg-transparent text-xs text-right p-1"
                        style={{ minHeight: '20px' }}
                        step="0.01"
                      />
                    </td>
                    <td className="center-align">
                      <input
                        type="number"
                        value={item.qty || 1}
                        onChange={(e) => handleQtyChange(idx, undefined, parseInt(e.target.value) || 1)}
                        className="w-full border-none bg-transparent text-xs text-center p-1"
                        style={{ minHeight: '20px' }}
                        min="1"
                      />
                    </td>
                    <td className="right-align"><strong>{item.amount?.toFixed(2) || ''}</strong></td>
                    <td className="center-align">
                      <button
                        onClick={() => handleDeleteMainItem(idx)}
                        className="px-1 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
                        style={{ fontSize: '10px' }}
                        title="Delete item"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              }
            }
            
            return null;
          })}
          
          {/* Total Row */}
          <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', fontSize: '14px' }}>
            <td colSpan={5} className="center-align"><strong>TOTAL BILL AMOUNT</strong></td>
            <td className="right-align"><strong>{calculateTotal().toFixed(2)}</strong></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Signature Section */}
      <div className="flex justify-between" style={{ marginTop: '32px', fontSize: '12px' }}>
        <div style={{ textAlign: 'center', width: '18%' }}>
          <div style={{ borderTop: '1px solid #000', paddingTop: '4px' }}>Bill Manager</div>
        </div>
        <div style={{ textAlign: 'center', width: '18%' }}>
          <div style={{ borderTop: '1px solid #000', paddingTop: '4px' }}>Cashier</div>
        </div>
        <div style={{ textAlign: 'center', width: '18%' }}>
          <div style={{ borderTop: '1px solid #000', paddingTop: '4px' }}>Patient/Attender Sign</div>
        </div>
        <div style={{ textAlign: 'center', width: '18%' }}>
          <div style={{ borderTop: '1px solid #000', paddingTop: '4px' }}>Med.Supdt</div>
        </div>
        <div style={{ textAlign: 'center', width: '18%' }}>
          <div style={{ borderTop: '1px solid #000', paddingTop: '4px' }}>Authorised Signatory</div>
        </div>
      </div>

      {/* Print Button - Now positioned below Final Bill */}
      <div className="flex justify-center" style={{ marginTop: '24px' }}>
        <button 
          onClick={handlePrint}
          className="print-button"
          title="Print Final Bill"
        >
          <Printer className="inline mr-2 h-4 w-4" />
          Print Bill
        </button>
      </div>
    </div>
  );
}

// Remove the mock patient data since we'll get it from props
interface Patient {
  id: string;
  patient_id: string;
  unique_id: string;  // Added this line
  patient_unique_id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  address?: string;
  insurance_status?: string;
  registration_date: string;
  last_visit_date?: string;
  date_of_admission?: string;
  date_of_discharge?: string;
}

// Add Visit interface after the Patient interface
interface Visit {
  id: string;
  visit_id: string;
  patient_unique_id: string;
  visit_date: string;
  visit_type: string;
  appointment_with: string;
  visit_reason: string;
  referring_doctor: string;
  diagnosis: string;
  surgery: string;
  created_at: string;
  claim_id: string;
}

interface PatientDashboardProps {
  patient: Patient;
}

export function PatientDashboard({ patient }: PatientDashboardProps) {
  // Add null check at the start of the component
  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading patient data...</h2>
        </div>
      </div>
    );
  }

  // Add state variables for treatment dates
  const [conservativeStart, setConservativeStart] = useState('2024-03-04');
  const [conservativeEnd, setConservativeEnd] = useState('2024-03-09');
  const [surgicalStart, setSurgicalStart] = useState('2024-03-10');
  const [surgicalEnd, setSurgicalEnd] = useState('2024-03-15');
  const [conservativeStart2, setConservativeStart2] = useState('2024-03-16');
  const [conservativeEnd2, setConservativeEnd2] = useState('2024-03-21');

  // Use patient data from props instead of mock data
  const patientData = {
    id: patient.id,
    unique_id: patient.unique_id,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    phone: patient.phone || '',
    address: patient.address || '',
    insuranceStatus: patient.insurance_status || 'Active',
    registrationDate: new Date(patient.registration_date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    lastVisit: patient.last_visit_date ? new Date(patient.last_visit_date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) : 'No visits yet',
    dateOfAdmission: patient.date_of_admission ? new Date(patient.date_of_admission).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) : 'Not admitted',
    dateOfDischarge: patient.date_of_discharge ? new Date(patient.date_of_discharge).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) : 'Not discharged'
  };

  const [visits, setVisits] = useState<Visit[]>([]);
  const [isVisitFormOpen, setIsVisitFormOpen] = useState(false)
  const [newVisit, setNewVisit] = useState({
    reason: "",
    doctor: "",
    department: "",
    notes: ""
  })
  
  // Patient image state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [patientImage, setPatientImage] = useState<string | null>(null);
  
  // State for diagnoses and selected diagnosis
  const [diagnosisSearchTerm, setDiagnosisSearchTerm] = useState('')
  const [isSearchResultsVisible, setIsSearchResultsVisible] = useState(false)
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null)
  
  // State for surgeries and selected surgery
  const [surgerySearchTerm, setSurgerySearchTerm] = useState('')
  const [isSurgerySearchResultsVisible, setIsSurgerySearchResultsVisible] = useState(false)
  const [selectedSurgeries, setSelectedSurgeries] = useState<string[]>([])
  const [temporarySelectedSurgeries, setTemporarySelectedSurgeries] = useState<string[]>([])
  const [surgeryDetails, setSurgeryDetails] = useState({
    surgeonName: "",
    anesthetistName: "",
    anesthesiaType: "",
    notes: "",
    surgeryDate: "",
    surgeryTime: ""
  })
  const [showSurgerySelectionDialog, setShowSurgerySelectionDialog] = useState(false)
  const [showSurgeryDetailForm, setShowSurgeryDetailForm] = useState(false)
  const [currentSelectedSurgery, setCurrentSelectedSurgery] = useState<any>(null)
  
  // State for investigations, medications, etc.
  const [selectedInvTab, setSelectedInvTab] = useState('all')
  const [selectedInvDay, setSelectedInvDay] = useState('D1')
  const [selectedMedDay, setSelectedMedDay] = useState('D1')
  
  // UI state
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const surgerySearchContainerRef = useRef<HTMLDivElement>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(240); // Initial width reduced from 288px to 240px
  const [isResizing, setIsResizing] = useState(false);
  const resizingRef = useRef<{ startX: number, startWidth: number } | null>(null);
  
  const basicComplicationId = "BC1";
  
  // Filter diagnoses based on search term
  const filteredDiagnoses = diagnosisDatabase.filter(
    (diagnosis) => 
      diagnosis.name.toLowerCase().includes(diagnosisSearchTerm.toLowerCase()) ||
      diagnosis.icd.toLowerCase().includes(diagnosisSearchTerm.toLowerCase())
  );
  
  // State for surgeries from database
  const [surgeryDatabase, setSurgeryDatabase] = useState<Surgery[]>([]);
  
  // Filter surgeries based on search term
  const filteredSurgeries = surgeryDatabase.filter(
    (surgery) => 
      surgery.name.toLowerCase().includes(surgerySearchTerm.toLowerCase()) ||
      surgery.cghs_code.toLowerCase().includes(surgerySearchTerm.toLowerCase()) ||
      surgery.category.toLowerCase().includes(surgerySearchTerm.toLowerCase())
  );

  const router = useRouter();
  const params = useParams();
  const patientId = params.id; // or whatever your param is called

  // Navigate to settings page
  const goToSettings = () => {
    router.push("/settings");
  };

  // Add effect for saving changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Effect for closing search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchResultsVisible(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSaveChanges = () => {
    // Here you would save all changes to backend
    toast({
      title: "Changes saved",
      description: "All changes have been saved successfully.",
    });
    setHasUnsavedChanges(false);
  };

  const handleGenerateCaseSheet = () => {
    // Create a window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      toast({
        title: "Error opening print window",
        description: "Please disable pop-up blockers for this site.",
        variant: "destructive"
      });
      return;
    }
    
    // Get selected diagnoses
    const diagnosesText = diagnoses.map(d => `<li>${d.name}</li>`).join('');

    // Use this data to create the HTML content
    const content = `
      <html>
        <head>
          <title>Patient Case Sheet - ${patientData.name}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #0070f3; }
            .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 18px; font-weight: bold; color: #0070f3; margin-bottom: 10px; }
            .investigation-item, .medication-item { margin-bottom: 8px; padding-left: 20px; position: relative; }
            .investigation-item:before, .medication-item:before { content: "•"; position: absolute; left: 0; color: #0070f3; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f0f7ff; color: #0070f3; font-weight: bold; }
            .complication { background-color: #fdf9eb; padding: 8px; border-left: 3px solid #f59e0b; margin-bottom: 5px; }
            .signature { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-line { width: 200px; border-top: 1px solid #000; padding-top: 5px; text-align: center; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Hope Hospital</h1>
            <h2>Patient Case Sheet</h2>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          
            <div class="patient-info">
            <div>
              <strong>Patient Name:</strong> ${patientData.name}
            </div>
            <div>
              <strong>Patient ID:</strong> ${patientData.unique_id}
          </div>
            <div>
              <strong>Age:</strong> ${patientData.age} years
            </div>
            <div>
              <strong>Gender:</strong> ${patientData.gender}
            </div>
            <div>
              <strong>Registration Date:</strong> ${patientData.registrationDate}
            </div>
            <div>
              <strong>Contact:</strong> ${patientData.phone}
            </div>
            <div>
              <strong>Date of Admission:</strong> ${patientData.dateOfAdmission}
            </div>
            <div>
              <strong>Date of Discharge:</strong> ${patientData.dateOfDischarge}
            </div>
          </div>
          
      <div class="section">
            <div class="section-title">Diagnoses</div>
            ${diagnoses.length > 0 ? `<ul>${diagnosesText}</ul>` : `<p>No diagnoses recorded.</p>`}
      </div>
    
        <div class="section">
            <div class="section-title">Investigations (${selectedInvDay})</div>
            <div>
              ${
                [
                  // Fake investigations for the demo to show all possible complications
                  { name: 'Complete Blood Count (CBC)', result: 'Normal', normal: true },
                  { name: 'Erythrocyte Sedimentation Rate (ESR)', result: 'Elevated (30 mm/hr)', normal: false },
                  { name: 'C-Reactive Protein (CRP)', result: 'Elevated (15 mg/L)', normal: false },
                  { name: 'Blood Glucose', result: 'Normal fasting', normal: true },
                  { name: 'Liver Function Tests', result: 'Within normal limits', normal: true },
                  { name: 'Kidney Function Tests', result: 'Creatinine slightly elevated', normal: false },
                  { name: 'X-Ray Chest', result: 'Clear lung fields', normal: true },
                  { name: 'ECG', result: 'Normal sinus rhythm', normal: true },
                  { name: 'Urinalysis', result: 'No abnormalities detected', normal: true }
                ].map(inv => `
                  <div class="investigation-item">
                    <strong>${inv.name}:</strong> 
                    <span style="color: ${inv.normal ? 'green' : 'red'}">${inv.result}</span>
        </div>
                `).join('')
    }
            </div>
          </div>
    
        <div class="section">
            <div class="section-title">Medications (${selectedMedDay})</div>
            <div>
              ${
                [
                  // Fake medications for the demo
                  { name: 'Amoxicillin', dosage: '500mg', frequency: 'TID', duration: '7 days' },
                  { name: 'Ibuprofen', dosage: '400mg', frequency: 'BID', duration: '5 days' },
                  { name: 'Pantoprazole', dosage: '40mg', frequency: 'OD', duration: '10 days' },
                  { name: 'Hydrochlorothiazide', dosage: '25mg', frequency: 'OD', duration: 'Continuous' },
                  { name: 'Amlodipine', dosage: '5mg', frequency: 'OD', duration: 'Continuous' }
                ].map(med => `
                  <div class="medication-item">
                    <strong>${med.name}</strong> - ${med.dosage} ${med.frequency} for ${med.duration}
        </div>
                `).join('')
    }
            </div>
          </div>
    
        <div class="section">
            <div class="section-title">Clinical Notes</div>
            <p>
              Patient presented with symptoms of fever and productive cough for 5 days. Physical examination revealed normal vital signs except for temperature of 38.2°C. Chest auscultation showed clear breath sounds bilaterally. Patient was started on empiric antibiotics and supportive care.
            </p>
            <p>
              Patient has been responding well to the treatment. Fever subsided on day 2 of admission. Cough has decreased in frequency and severity. Plan for discharge with oral antibiotics to complete a 7-day course.
            </p>
        </div>
    
      <div class="section">
            <div class="section-title">Management Plan</div>
            <ol>
              <li>Complete antibiotic course as prescribed</li>
              <li>Follow-up in outpatient clinic in 1 week</li>
              <li>Continue regular medications for chronic conditions</li>
              <li>Return immediately if symptoms worsen or new symptoms develop</li>
              <li>Avoid strenuous activities for 1 week</li>
            </ol>
      </div>
          
          <div class="signature">
            <div>
              <div class="signature-line">Patient's Signature</div>
      </div>
            <div>
              <div class="signature-line">Doctor's Signature</div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.print();" style="padding: 10px 20px; background-color: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Case Sheet
            </button>
        </div>
      </body>
    </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Auto-print
    setTimeout(() => {
      printWindow.print();
      toast({
        title: "Case Sheet Generated",
        description: "The case sheet is ready for printing."
      });
    }, 500);
  };

  // Generate a unique visit ID
  const generateVisitId = () => {
    const date = new Date();
    const year = date.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `VISIT-${year}-${random}`;
  };

  // Handle submitting a new visit
  const handleSubmitVisit = () => {
    if (!newVisit.reason || !newVisit.doctor || !newVisit.department) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    const visit = {
      visitId: generateVisitId(),
      date: formattedDate,
      ...newVisit
    };
    
    setVisits([visit, ...visits]);
    setIsVisitFormOpen(false);
    setNewVisit({
      reason: "",
      doctor: "",
      department: "",
      notes: ""
    });
    
    toast({
      title: "Visit recorded",
      description: "The new visit has been added to the patient's record."
    });
  };

  const handleGenerateInvoice = () => {
      toast({
      title: "Invoice Generated",
      description: "Invoice is being prepared"
    });
  };

  // Add this handler for image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function(event) {
        setPatientImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setHasUnsavedChanges(true);
    }
  };

  // Function to add a diagnosis
  const handleAddDiagnosis = (diagnosis: { id: string, name: string, icd: string }) => {
    // Check if diagnosis already exists
    if (diagnoses.some(d => d.id === diagnosis.id)) {
      toast({
        title: "Diagnosis already added",
        description: "This diagnosis is already in the patient's record.",
        variant: "destructive"
      });
      return;
    }

    const newDiagnosis: Diagnosis = {
      id: diagnosis.id,
      name: diagnosis.name,
      approved: false
    };
    
    setDiagnoses([...diagnoses, newDiagnosis]);
    setDiagnosisSearchTerm("");
    setIsSearchResultsVisible(false);
    setHasUnsavedChanges(true);
  };

  // Function to remove a diagnosis
  const handleRemoveDiagnosis = (id: string) => {
    setDiagnoses(diagnoses.filter(d => d.id !== id));
    if (selectedDiagnosis === id) {
      setSelectedDiagnosis(null);
    }
    setHasUnsavedChanges(true);
  };

  // Function to handle surgery selection
  const handleAddSurgery = (surgeryId: string) => {
    if (selectedSurgeries.includes(surgeryId)) {
      toast({
        title: "Surgery already added",
        description: "This surgery is already in the patient's record.",
        variant: "destructive"
      });
              return;
            }
            
    setSelectedSurgeries([...selectedSurgeries, surgeryId]);
    setSurgerySearchTerm("");
    setIsSurgerySearchResultsVisible(false);
    setHasUnsavedChanges(true);
  };
  
  // Function to toggle surgery selection in the dialog
  const toggleSurgerySelection = (surgeryId: string) => {
    if (temporarySelectedSurgeries.includes(surgeryId)) {
      setTemporarySelectedSurgeries(temporarySelectedSurgeries.filter(id => id !== surgeryId));
    } else {
      setTemporarySelectedSurgeries([...temporarySelectedSurgeries, surgeryId]);
    }
  };

  // Function to remove a surgery
  const handleRemoveSurgery = (surgeryId: string) => {
    setSelectedSurgeries(selectedSurgeries.filter(id => id !== surgeryId));
    setHasUnsavedChanges(true);
  };

  // Add resize event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizingRef.current) return;
      
      const { startX, startWidth } = resizingRef.current;
      const diffX = e.clientX - startX;
      const newWidth = Math.max(240, Math.min(800, startWidth + diffX)); // Allow expansion up to 800px
      
      setSidebarWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      resizingRef.current = null;
    };
    
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizingRef.current = {
      startX: e.clientX,
      startWidth: sidebarWidth
    };
  };

  const fetchVisits = async () => {
    if (!patient?.unique_id) return;
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('patient_unique_id', patient.unique_id) // filter by patient
      .order('created_at', { ascending: false });
    if (error) { /* handle error */ }
    setVisits(data || []);
  };

  // Fetch surgeries from cghs_surgery table
  const fetchSurgeries = async () => {
    try {
      const { data, error } = await supabase
        .from('cghs_surgery')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.error('Supabase error fetching surgeries:', error.message || error);
        throw error;
      }
      
      setSurgeryDatabase(data || []);
    } catch (error: any) {
      console.error('Error fetching surgeries:', error?.message || error?.toString() || 'Unknown error occurred');
      // Set empty array as fallback
      setSurgeryDatabase([]);
    }
  };

  useEffect(() => {
    fetchVisits();
    fetchSurgeries();
  }, [patient?.unique_id]);

  // Initialize comprehensive invoice items
  useEffect(() => {
    if (patientData && visits.length > 0) {
      const latestVisit = visits[0];
      const items = [
        // Conservative Treatment Section
        { 
          type: "section", 
          title: "Conservative Treatment", 
          dateRange: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`
        },
        
        // Surgical Package Section
        { 
          type: "section", 
          title: "Surgical Package (5 Days)", 
          dateRange: `Dt. (${surgicalStart.split('-').reverse().join('/')} TO ${surgicalEnd.split('-').reverse().join('/')})`
        },
        
        // 1) Consultation for Inpatients
        {
          type: "main",
          sr: "1)",
          item: "Consultation for Inpatients",
          code: "2",
          subItems: [
            {
              sr: "i)",
              item: "Dr. Pranal Sahare,(Urologist)",
              details: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`,
              rate: 350.00,
              qty: 8,
              amount: 2800.00
            },
            {
              sr: "ii)",
              item: "Dr. Ashwin Chichkhede, MD (Medicine)",
              details: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`,
              rate: 350.00,
              qty: 8,
              amount: 2800.00
            }
          ]
        },
        
        // 2) Accommodation Charges
        {
          type: "main",
          sr: "2)",
          item: "Accommodation Charges",
          subItems: [
            {
              sr: "i)",
              item: "Accommodation For General Ward",
              details: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`,
              rate: 1500.00,
              qty: 8,
              amount: 12000.00
            }
          ]
        },
        
        // 3) Pathology Charges
        {
          type: "main",
          sr: "3)",
          item: "Pathology Charges",
          details: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`,
          note: "Note:Attached Pathology Break-up",
          rate: 3545.00,
          qty: 1,
          amount: 3545.00
        },
        
        // 4) Medicine Charges
        {
          type: "main",
          sr: "4)",
          item: "Medicine Charges",
          details: `Dt.(${conservativeStart.split('-').reverse().join('/')} TO ${conservativeEnd.split('-').reverse().join('/')})`,
          note: "Note:Attached Pharmacy Statement with Bills",
          rate: 9343.00,
          qty: 1,
          amount: 9343.00
        },
        
        // 5) OTHER CHARGES
        {
          type: "main",
          sr: "5)",
          item: "OTHER CHARGES",
          subItems: [
            { sr: "i)", item: "ECG", code: "590", rate: 175.00, qty: 1, amount: 175.00 },
            { sr: "ii)", item: "Chest PA view", code: "1608", rate: 230.00, qty: 1, amount: 230.00 },
            { sr: "iii)", item: "Voiding-cysto-urethrogram and retrograde urethrogram(Nephrostogram)", code: "894", rate: 476.00, qty: 1, amount: 476.00 },
            { sr: "iv)", item: "Abdomen USG", code: "1591", rate: 800.00, qty: 1, amount: 800.00 },
            { sr: "v)", item: "Pelvic USG", code: "1592", rate: 500.00, qty: 1, amount: 500.00 },
            { sr: "vi)", item: "2D echocardiography", code: "592", rate: 1475.00, qty: 1, amount: 1475.00 }
          ]
        },
        
        // 7) Surgical Treatment
        {
          type: "main",
          sr: "7)",
          item: `Surgical Treatment (${surgicalStart.split('-').reverse().join('/')})`,
          subItems: [
            {
              sr: "i)",
              item: "Resection Bladder Neck Endoscopic /Bladder neckincision/transurethral incision on prostrate",
              code: "874",
              pricing: {
                baseAmount: 11308,
                primaryAdjustment: "ward10",
                discountAmount: 1130,
                finalAmount: 10178.00
              }
            },
            {
              sr: "ii)",
              item: "Suprapubic Drainage (Cystostomy/vesicostomy)",
              code: "750",
              pricing: {
                baseAmount: 6900,
                primaryAdjustment: "ward10",
                secondaryAdjustment: "guideline50",
                discountAmount: 690,
                subDiscountAmount: 6210,
                finalAmount: 3105.00
              }
            },
            {
              sr: "iii)",
              item: "Diagnostic cystoscopy",
              code: "694",
              pricing: {
                baseAmount: 3306,
                primaryAdjustment: "ward10",
                secondaryAdjustment: "guideline50",
                discountAmount: 330,
                subDiscountAmount: 2976,
                finalAmount: 1488.00
              }
            },
            {
              sr: "iv)",
              item: "Meatotomy",
              code: "780",
              pricing: {
                baseAmount: 2698,
                primaryAdjustment: "ward10",
                secondaryAdjustment: "guideline50",
                discountAmount: 269,
                subDiscountAmount: 2429,
                finalAmount: 1214.00
              }
            }
          ]
        }
      ];
      
      // setInvoiceItems(items);
    }
  }, [patientData, visits, conservativeStart, conservativeEnd, surgicalStart, surgicalEnd]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Resizable Secondary Sidebar */}
      <div
        className={`transition-all relative bg-white/85 backdrop-blur-lg border-r border-blue-100/60 shadow-2xl flex flex-col h-full sticky top-0 z-20 ${isSidebarExpanded ? '' : 'w-12'} min-h-screen`}
        style={{ 
          width: isSidebarExpanded ? `${sidebarWidth}px` : '3rem', 
          minWidth: isSidebarExpanded ? '180px' : '3rem', 
          margin: 0, 
          padding: 0,
          transition: isResizing ? 'none' : 'all 0.3s ease'
        }}
      >
        {/* Resize handle - only visible when expanded */}
        {isSidebarExpanded && (
          <div 
            className="absolute top-0 right-0 w-4 h-full cursor-col-resize z-30 flex items-center justify-center"
            onMouseDown={startResizing}
          >
            <div className="h-16 w-[3px] bg-gradient-to-b from-blue-400 to-purple-400 rounded-full opacity-50 hover:opacity-100 transition-all duration-300 hover:shadow-lg" />
          </div>
        )}
        
        {/* Expand button, only show when collapsed */}
        {!isSidebarExpanded && (
          <button
            className="w-full py-4 border-b border-blue-100/60 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 flex items-center justify-center group"
            onClick={() => setIsSidebarExpanded(true)}
          >
            <span className="sr-only">Expand sidebar</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
        
        {/* Collapse button, only show when expanded */}
        {isSidebarExpanded && (
          <button
            className="w-full py-4 border-b border-blue-100/60 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 flex items-center justify-center group"
            onClick={() => setIsSidebarExpanded(false)}
          >
            <span className="sr-only">Collapse sidebar</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
        
        <div className="flex-1 flex flex-col gap-0 p-0 m-0">
          {/* Merged Surgeries/Complications Card with Tabs */}
          <div className={isSidebarExpanded ? '' : 'hidden'}>
            <Card className="shadow-xl border border-blue-100/50 m-3 mt-6 bg-white/75 backdrop-blur-md rounded-2xl">
              <CardHeader className="pb-4 px-6 pt-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-t-2xl">
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent tracking-tight">Patient Details</CardTitle>
                <CardDescription className="text-blue-600/70 text-sm mt-1 leading-relaxed">Diagnoses and Complications</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <Tabs defaultValue="diagnoses" className="w-full">
                  <TabsList className="flex gap-1.5 mb-5 bg-blue-50/60 p-1.5 rounded-xl w-full border border-blue-100/50">
                    <TabsTrigger 
                      value="diagnoses" 
                      className="flex-1 text-center rounded-lg px-3 py-2.5 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:shadow-md data-[state=active]:text-blue-700 text-xs tracking-wide transition-all duration-300"
                    >
                      Clinical Mgmt
                    </TabsTrigger>
                    <TabsTrigger 
                      value="surgeries"
                      className="flex-1 text-center rounded-lg px-3 py-2.5 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:shadow-md data-[state=active]:text-blue-700 text-xs tracking-wide transition-all duration-300"
                    >
                      Surgeries
                    </TabsTrigger>
                    <TabsTrigger 
                      value="complications"
                      className="flex-1 text-center rounded-lg px-3 py-2.5 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:shadow-md data-[state=active]:text-blue-700 text-xs tracking-wide transition-all duration-300"
                    >
                      Compl.
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="diagnoses">
                    <DiagnosisManager 
                      patientUniqueId={patient?.unique_id || ''} 
                      visitId={visits[0]?.visit_id || undefined}
                    />
                  </TabsContent>
                  
                  {/* Surgeries Tab */}
                  <TabsContent value="surgeries">
                    <div className="mb-4" ref={surgerySearchContainerRef}>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          placeholder="Search by surgery name, CGHS code, or category..."
                          value={surgerySearchTerm}
                          onChange={(e) => {
                            setSurgerySearchTerm(e.target.value)
                            setIsSurgerySearchResultsVisible(true)
                          }}
                          onFocus={() => setIsSurgerySearchResultsVisible(true)}
                          className="pl-11 py-3 border-blue-200/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 bg-white/85 backdrop-blur-sm rounded-xl shadow-sm transition-all duration-300 focus:shadow-md text-sm"
                        />
                      </div>
                      
                      {/* Surgery Search Results */}
                      {isSurgerySearchResultsVisible && surgerySearchTerm && (
                        <div className="mt-3 border rounded-xl max-h-[300px] overflow-y-auto shadow-lg bg-white/95 backdrop-blur-sm">
                          {filteredSurgeries.length > 0 ? (
                            <div className="divide-y">
                              {filteredSurgeries.map((surgery) => (
                                <div 
                                  key={surgery.id}
                                  className="flex items-center justify-between p-4 hover:bg-blue-50/50 cursor-pointer transition-colors"
                                >
                                                    <div className="flex-grow">
                    <p className="font-medium">{surgery.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                        CGHS: {surgery.cghs_code}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                        {surgery.category}
                      </Badge>
                    </div>
                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-semibold text-blue-700">₹{surgery.amount.toLocaleString()}</p>
                                  </div>
                                  <div className="ml-4">
                                    <Button
                                      size="sm" 
                                      variant="ghost" 
                                      onClick={() => {
                                        setShowSurgerySelectionDialog(true);
                                        setSurgerySearchTerm("");
                                        setIsSurgerySearchResultsVisible(false);
                                      }}
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Add Surgery
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-6 text-center text-gray-500 text-sm">
                              No surgeries found. Try a different search term.
                      </div>
                    )}
                      </div>
                    )}
                      
                      {/* Selected Surgeries List */}
                      {selectedSurgeries.length > 0 && (
                        <div className="mt-4 border rounded-md overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surgery</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surgeon</th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {selectedSurgeries.map((surgeryId) => {
                                const surgery = surgeryDatabase.find(s => s.id.toString() === surgeryId);
                                if (!surgery) return null;
                                
                                return (
                                  <tr key={surgeryId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                                            <div className="text-sm font-medium text-gray-900">{surgery.name}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 px-1.5 py-0.5 text-[10px]">
                          CGHS: {surgery.cghs_code}
                        </Badge>
                                        <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 px-1.5 py-0.5 text-[10px]">
                                          {surgery.category}
                                        </Badge>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="text-sm text-gray-900">{surgeryDetails.surgeryDate || "Not scheduled"}</div>
                                      <div className="text-xs text-gray-500">{surgeryDetails.surgeryTime || ""}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="text-sm text-gray-900">{surgeryDetails.surgeonName || "Not assigned"}</div>
                                      {surgeryDetails.anesthetistName && (
                                        <div className="text-xs text-gray-500 mt-1">
                                          Anesthetist: {surgeryDetails.anesthetistName}
                                        </div>
                                      )}
                                      {surgeryDetails.anesthesiaType && (
                                        <div className="text-xs text-gray-500">
                                          {surgeryDetails.anesthesiaType}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            // Open edit form for this surgery
                                            setCurrentSelectedSurgery(surgery);
                                            setShowSurgeryDetailForm(true);
                                          }}
                                          className="text-blue-600 hover:text-blue-800"
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleRemoveSurgery(surgeryId)}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                      
                      {/* Add Surgery Button */}
                      <div className="mt-4">
                        <Button 
                          variant="outline"
                          className="w-full bg-white/80 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md rounded-xl"
                          onClick={() => {
                            setTemporarySelectedSurgeries([]);
                            setShowSurgerySelectionDialog(true);
                          }}
                        >
                          <PlusCircle className="mr-2 h-4 w-4 text-blue-600" />
                          Add Surgery
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="complications">
                    <div className="mt-2">
                      <SelectedComplicationsList
                        surgeryComplications={[]}
                        selectedSurgeries={[]}
                        diagnosisComplications={[]}
                        selectedDiagnoses={[]}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          {/* Show icons when collapsed */}
          <div className={`flex flex-col items-center gap-8 mt-6 ${isSidebarExpanded ? 'hidden' : ''}`}>
            <div className="flex flex-col items-center gap-1">
              <ClipboardCheck className="h-4 w-4 text-blue-600" />
              <span className="text-[9px] text-blue-700 text-center">Diagnoses</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Scissors className="h-4 w-4 text-blue-600" />
              <span className="text-[9px] text-blue-700 text-center">Surgeries</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ClipboardList className="h-4 w-4 text-blue-600" />
              <span className="text-[9px] text-blue-700 text-center whitespace-normal px-1">Complications</span>
          </div>
        </div>
      </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Patient Information Card at the very top, always visible and aligned to the right of the sidebar */}
        <div className="p-6" style={{ minWidth: 0 }}>
          <Card className="border-blue-200/40 transition-all duration-300 shadow-2xl bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden">
            <CardHeader className="pb-6 px-8 pt-8 bg-gradient-to-r from-blue-50/60 via-indigo-50/60 to-purple-50/60 border-b border-blue-100/40">
              <div className="flex justify-between items-start gap-6">
                <div className="flex items-center gap-6">
                  {/* Avatar with upload */}
                  <div className="relative group">
                    <Avatar
                      className={`transition-all duration-300 border-4 border-white shadow-xl h-24 w-24 cursor-pointer group-hover:scale-105 group-hover:shadow-2xl`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {patientImage ? (
                        <AvatarImage src={patientImage} alt={patientData.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-700 text-2xl font-bold">
                          {patientData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium rounded-full px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">Edit</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-4xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight leading-tight">{patientData.name}</h2>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant="outline" className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200/60 shadow-sm font-medium tracking-wide">
                        ID: {patientData.unique_id} , {patientData.age} years, {patientData.gender}
                      </Badge>
                      {/* <span className="text-sm text-muted-foreground">
                        {patientData.age} years, {patientData.gender}
                      </span> */}
                    </div>
                  </div>
                </div>
                <Badge className={patientData.insuranceStatus === "Active" ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg px-4 py-2 font-semibold tracking-wide" : "bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg px-4 py-2 font-semibold tracking-wide"}>
                  {patientData.insuranceStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="py-6 px-8 bg-white/60">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border border-blue-50">
                  <Phone className="h-5 w-5 mr-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 tracking-wide">{patientData.phone}</span>
                </div>
                <div className="flex items-center p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border border-blue-50">
                  <CalendarDays className="h-5 w-5 mr-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 tracking-wide">Last Visit: {patientData.lastVisit}</span>
                </div>
                <div className="flex items-center p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border border-blue-50">
                  <UserRound className="h-5 w-5 mr-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700 tracking-wide">Registered: {patientData.registrationDate}</span>
                </div>
                <div className="flex items-center p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border border-blue-50">
                  <CalendarDays className="h-5 w-5 mr-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700 tracking-wide">Admission: {patientData.dateOfAdmission}</span>
                </div>
                <div className="flex items-center p-4 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border border-blue-50">
                  <CalendarDays className="h-5 w-5 mr-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-700 tracking-wide">Discharge: {patientData.dateOfDischarge}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="px-6 grid gap-8 md:grid-cols-12">
          {/* Investigations, Medications, and Action Buttons */}
          <div className="md:col-span-4 space-y-8">
            {/* Investigations Section with Tabs */}
            <Card className="shadow-2xl bg-white/95 backdrop-blur-lg rounded-3xl border border-blue-100/40 overflow-hidden">
              <CardHeader className="pb-4 px-6 pt-6 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border-b border-blue-100/30">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent tracking-tight">Investigations</CardTitle>
                    <CardDescription className="text-blue-600/70 text-sm mt-1 leading-relaxed">All investigations and reports</CardDescription>
                  </div>
                  {/* Investigation Tabs */}
                  <div className="flex gap-2.5">
                    {['all', 'radiology', 'lab', 'other'].map(tab => (
                      <button
                        key={tab}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 border shadow-sm ${selectedInvTab === tab ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg scale-105' : 'bg-white/90 text-blue-600 border-blue-200/60 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:scale-105'}`}
                        onClick={() => setSelectedInvTab(tab)}
                      >
                        {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="bg-white/60 px-6 py-5">
                {/* Day Tabs (D1-D4) for all except 'all' tab */}
                {selectedInvTab !== 'all' && (
                  <div className="flex gap-2.5 mb-6">
                    {['D1', 'D2', 'D3', 'D4'].map(day => (
                      <button
                        key={day}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 border shadow-sm ${selectedInvDay === day ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg' : 'bg-white/90 text-blue-600 border-blue-200/60 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md'}`}
                        onClick={() => setSelectedInvDay(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
                {selectedInvTab === 'all' && (
                  <InvestigationsList 
                    complicationIds={[basicComplicationId]}
                  />
                )}
                {selectedInvTab === 'radiology' && (
                  <InvestigationsList 
                    complicationIds={[basicComplicationId]}
                    type="radiology"
                    day={selectedInvDay}
                  />
                )}
                {selectedInvTab === 'lab' && (
                  <InvestigationsList 
                    complicationIds={[basicComplicationId]}
                    type="lab"
                    day={selectedInvDay}
                  />
                )}
                {selectedInvTab === 'other' && (
                  <InvestigationsList 
                    complicationIds={[basicComplicationId]}
                    type="other"
                    day={selectedInvDay}
                  />
                )}
              </CardContent>
            </Card>
            {/* Medications Section with Day Tabs */}
            <Card className="shadow-2xl bg-white/95 backdrop-blur-lg rounded-3xl border border-blue-100/40 overflow-hidden">
              <CardHeader className="pb-4 px-6 pt-6 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border-b border-blue-100/30">
                    <div className="flex items-center justify-between">
                      <div>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent tracking-tight">Medications</CardTitle>
                <CardDescription className="text-blue-600/70 text-sm mt-1 leading-relaxed">To be given</CardDescription>
                      </div>
                      {/* Day Tabs */}
                      <div className="flex gap-2.5">
                        {['D1', 'D2', 'D3', 'D4'].map(day => (
                          <button
                            key={day}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 border shadow-sm ${selectedMedDay === day ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg' : 'bg-white/90 text-blue-600 border-blue-200/60 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md'}`}
                            onClick={() => setSelectedMedDay(day)}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
              </CardHeader>
              <CardContent className="bg-white/60 px-6 py-5">
                      <MedicationsList 
                  complicationIds={[basicComplicationId]}
                        day={selectedMedDay}
                      />
              </CardContent>
            </Card>
            <div className="flex justify-end gap-4 pt-2">
                <Button variant="outline" onClick={handleGenerateInvoice} className="bg-white/90 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-blue-200/60 hover:border-blue-300 transition-all duration-300 hover:shadow-md rounded-xl font-medium px-6 py-3">
                  <Receipt className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
                <Button variant="outline" onClick={handleGenerateCaseSheet} className="bg-white/90 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-blue-200/60 hover:border-blue-300 transition-all duration-300 hover:shadow-md rounded-xl font-medium px-6 py-3">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Case Sheet
                </Button>
                <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold px-6 py-3 tracking-wide">
                  Save Changes
                </Button>
            </div>
          </div>
          {/* Invoice Page to the right */}
          <div className="md:col-span-8 space-y-6">
            <div className="flex flex-col md:flex-row gap-2 mb-3 p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50">
              <div className="flex-1">
                <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Conservative Start</label>
                <input type="date" value={conservativeStart} onChange={e => setConservativeStart(e.target.value)} className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Conservative End</label>
                <input type="date" value={conservativeEnd} onChange={e => setConservativeEnd(e.target.value)} className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Surgical Start</label>
                <input type="date" value={surgicalStart} onChange={e => setSurgicalStart(e.target.value)} className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Surgical End</label>
                <input type="date" value={surgicalEnd} onChange={e => setSurgicalEnd(e.target.value)} className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Conservative Start</label>
                <input type="date" value={conservativeStart2} onChange={e => setConservativeStart2(e.target.value)} className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-medium mb-0.5 text-gray-700 tracking-wide">Conservative End</label>
                <input type="date" value={conservativeEnd2} onChange={e => setConservativeEnd2(e.target.value)} className="border border-blue-200/60 rounded-lg px-2 py-1.5 bg-white/90 focus:border-blue-400 focus:ring-1 focus:ring-blue-200/50 transition-all duration-300 text-[10px] font-medium w-full" />
              </div>
            </div>
            <InvoicePage 
              patientId={patientData.id} 
              diagnoses={diagnoses} 
              conservativeStart={conservativeStart} 
              conservativeEnd={conservativeEnd}
              surgicalStart={surgicalStart} 
              surgicalEnd={surgicalEnd}
              visits={visits}
            />
          </div>
        </div>
        
        {/* Visit History Section */}
        <div className="p-4 mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base">Visit History</CardTitle>
                  <CardDescription>Record of hospital visits</CardDescription>
                </div>
                {/* Removed Register New Visit button as requested */}
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative overflow-auto max-h-[400px]">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="bg-blue-50">
                      <tr className="border-b transition-colors">
                          <th className="h-12 px-4 text-left align-middle font-medium text-blue-700">Visit ID</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-blue-700">Date</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-blue-700">Reason</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-blue-700">Doctor</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-blue-700">Department</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-blue-700">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.map((visit, index) => (
                        <tr
                          key={visit.id}
                            className={index % 2 === 0 
                              ? "bg-white hover:bg-blue-50/50 transition-colors" 
                              : "bg-blue-50/20 hover:bg-blue-50/50 transition-colors"}
                        >
                          <td className="p-4 align-middle font-medium">{visit.visit_id}</td>
                          <td className="p-4 align-middle">{new Date(visit.visit_date).toLocaleDateString('en-GB')}</td>
                          <td className="p-4 align-middle">{visit.visit_reason}</td>
                          <td className="p-4 align-middle">{visit.appointment_with}</td>
                          <td className="p-4 align-middle">{visit.visit_type}</td>
                          <td className="p-4 align-middle text-muted-foreground">{visit.diagnosis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* All Dialogs (Visit Registration, Clinical Notes, etc.) */}
        <Dialog open={isVisitFormOpen} onOpenChange={setIsVisitFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Register New Visit</DialogTitle>
              <DialogDescription>
                Fill in the details for the new hospital visit.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSubmitVisit();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Reason for Visit <span className="text-red-500">*</span></label>
                <Input
                  required
                  placeholder="Reason for visit"
                  value={newVisit.reason}
                  onChange={e => setNewVisit({ ...newVisit, reason: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Doctor <span className="text-red-500">*</span></label>
                <Input
                  required
                  placeholder="Doctor's name"
                  value={newVisit.doctor}
                  onChange={e => setNewVisit({ ...newVisit, doctor: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department <span className="text-red-500">*</span></label>
                <Input
                  required
                  placeholder="Department"
                  value={newVisit.department}
                  onChange={e => setNewVisit({ ...newVisit, department: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Textarea
                  placeholder="Any additional notes"
                  value={newVisit.notes}
                  onChange={e => setNewVisit({ ...newVisit, notes: e.target.value })}
                />
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit">Save Visit</Button>
                <Button type="button" variant="outline" onClick={() => setIsVisitFormOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Surgery Selection Dialog */}
        <Dialog open={showSurgerySelectionDialog} onOpenChange={setShowSurgerySelectionDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Surgery</DialogTitle>
              <DialogDescription>
                Enter details for a new surgery to add to the patient's record.
              </DialogDescription>
            </DialogHeader>
            
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Search by surgery name, CGHS code, or category..."
                value={surgerySearchTerm}
                onChange={(e) => {
                  setSurgerySearchTerm(e.target.value)
                  setIsSurgerySearchResultsVisible(true)
                }}
                onFocus={() => setIsSurgerySearchResultsVisible(true)}
                className="pl-11 py-3 border-blue-200/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 bg-white/85 backdrop-blur-sm rounded-xl shadow-sm transition-all duration-300 focus:shadow-md text-sm"
              />
            </div>
            
            <div className="mt-2 border rounded-md overflow-y-auto" style={{ maxHeight: "400px" }}>
              {filteredSurgeries.length > 0 ? (
                <div className="divide-y">
                  {filteredSurgeries.map((surgery) => (
                    <div 
                      key={surgery.id}
                      className="flex items-center p-4 hover:bg-blue-50/50 cursor-pointer transition-colors"
                      onClick={() => toggleSurgerySelection(surgery.id.toString())}
                    >
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          checked={temporarySelectedSurgeries.includes(surgery.id.toString())}
                          onChange={() => toggleSurgerySelection(surgery.id.toString())}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex-grow ml-3">
                        <p className="font-medium">{surgery.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                            CGHS: {surgery.cghs_code}
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            {surgery.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-700">₹{surgery.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No surgeries found. Try a different search term.
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {temporarySelectedSurgeries.length} surgery/surgeries selected
              </p>
            </div>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setShowSurgerySelectionDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (temporarySelectedSurgeries.length > 0) {
                    setShowSurgerySelectionDialog(false);
                    setShowSurgeryDetailForm(true);
                  } else {
                    toast({
                      title: "No surgeries selected",
                      description: "Please select at least one surgery to continue.",
                      variant: "destructive"
                    });
                  }
                }} 
                disabled={temporarySelectedSurgeries.length === 0}
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Surgery Details Form Dialog */}
        <Dialog open={showSurgeryDetailForm} onOpenChange={setShowSurgeryDetailForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add details for {temporarySelectedSurgeries.length} selected surgery/surgeries</DialogTitle>
              <DialogDescription>
                {temporarySelectedSurgeries.map((surgeryId) => {
                  const surgery = surgeryDatabase.find(s => s.id.toString() === surgeryId);
                  return surgery ? surgery.name : "";
                }).join(", ")}
              </DialogDescription>
            </DialogHeader>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Add all selected surgeries with the same details
                temporarySelectedSurgeries.forEach(surgeryId => {
                  if (!selectedSurgeries.includes(surgeryId)) {
                    setSelectedSurgeries(prev => [...prev, surgeryId]);
                  }
                });
                setShowSurgeryDetailForm(false);
                setHasUnsavedChanges(true);
                toast({
                  title: "Surgeries added",
                  description: `Added ${temporarySelectedSurgeries.length} surgeries to the patient's record.`
                });
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Surgery Date <span className="text-red-500">*</span></label>
                  <Input 
                    type="date" 
                    required
                    value={surgeryDetails.surgeryDate}
                    onChange={(e) => setSurgeryDetails({...surgeryDetails, surgeryDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Surgery Time <span className="text-red-500">*</span></label>
                  <Input 
                    type="time" 
                    required
                    value={surgeryDetails.surgeryTime}
                    onChange={(e) => setSurgeryDetails({...surgeryDetails, surgeryTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Surgeon <span className="text-red-500">*</span></label>
                <Select
                  onValueChange={(value) => setSurgeryDetails({...surgeryDetails, surgeonName: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select surgeon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. A. Kumar">Dr. A. Kumar</SelectItem>
                    <SelectItem value="Dr. S. Mehta">Dr. S. Mehta</SelectItem>
                    <SelectItem value="Dr. R. Singh">Dr. R. Singh</SelectItem>
                    <SelectItem value="Dr. P. Gupta">Dr. P. Gupta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Anesthetist</label>
                <Select
                  onValueChange={(value) => setSurgeryDetails({...surgeryDetails, anesthetistName: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select anesthetist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. M. Verma">Dr. M. Verma</SelectItem>
                    <SelectItem value="Dr. S. Agarwal">Dr. S. Agarwal</SelectItem>
                    <SelectItem value="Dr. K. Das">Dr. K. Das</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Anesthesia Type</label>
                <Select
                  onValueChange={(value) => setSurgeryDetails({...surgeryDetails, anesthesiaType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select anesthesia type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Anesthesia">General Anesthesia</SelectItem>
                    <SelectItem value="Spinal Anesthesia">Spinal Anesthesia</SelectItem>
                    <SelectItem value="Local Anesthesia">Local Anesthesia</SelectItem>
                    <SelectItem value="Regional Anesthesia">Regional Anesthesia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">OT Notes</label>
                <Textarea
                  placeholder="Enter operation theater notes..."
                  value={surgeryDetails.notes}
                  onChange={(e) => setSurgeryDetails({...surgeryDetails, notes: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => {
                  setShowSurgeryDetailForm(false);
                  setShowSurgerySelectionDialog(true);
                }}>
                  Back
                </Button>
                <Button type="submit">
                  Add Surgeries
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
            </div>
    </div>
  )
}
