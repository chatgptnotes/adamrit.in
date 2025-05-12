"use client"

import { useEffect, useState, useRef } from "react"
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
  ClipboardList
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
import { useRouter } from "next/navigation"
import { DiagnosisList } from "@/components/diagnosis-list"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
// Sample surgery data
const surgeries = [
  { id: "s1", name: "Cataract Surgery", packageAmount: 25000 },
  { id: "s2", name: "Appendectomy", packageAmount: 35000 },
  { id: "s3", name: "Coronary Angioplasty", packageAmount: 120000 },
  { id: "s4", name: "Knee Replacement", packageAmount: 150000 },
]

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

// Move InvoicePage function here
function InvoicePage({ patientId, diagnoses, conservativeStart, conservativeEnd, surgicalStart, surgicalEnd }: {
  patientId: string,
  diagnoses: Diagnosis[],
  conservativeStart: string,
  conservativeEnd: string,
  surgicalStart: string,
  surgicalEnd: string
}) {
  // Mock data based on the attached invoice
  // Generate BILL NO dynamically with ESIC prefix and date
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = String(today.getFullYear()).slice(-2);
  const billNo = `ESIC-BL${day}${month}-${year}`;

  const invoice = {
    billNo: billNo,
    regNo: "IH24C04007",
    patientName: patientData.name,
    age: 43,
    sex: "FEMALE",
    beneficiary: "RAJKUMAR BASU",
    relation: "WIFE",
    rank: "Nb Sub / Ris ( RETD.)",
    echsRegNo: "00005886842",
    category: "SEMI-PRIVATE",
    date: "15/03/2024",
    admission: "04-03-2024",
    discharge: "15-03-2024",
    diagnosis: [
      "RIGHT SHOULDER ADHESIVE CAPSULITIS",
      "TENDINOPATHY",
      "DIABETES MELLITUS",
      "POST OPERATIVE STATUS FOLLOWING RIGHT SHOULDER ARTHROSCOPY WITH CAPSULOTOMY, THERAPEUTIC ARTHROSCOPY WITH IMPLANT, AND BICEPS TENODESIS."
    ],
    items: [
      { section: "Conservative Treatment" },
      { section: "Surgical Package (7 Days)" },
      { sr: "1)", item: "Consultation for Inpatients", code: "2", rate: "350.00", qty: 6, amount: "2100.00", sub: [
        { sr: "i)", item: "Dr. Dhiraj Gupta MS. (Ortho)", rate: "350.00", qty: 6, amount: "2100.00", details: "Dt.(04/03/2024 TO 09/03/2024)" },
        { sr: "ii)", item: "Dr. Ashwin Chinchkhede (MD. Med.)", rate: "350.00", qty: 6, amount: "2100.00", details: "Dt.(04/03/2024 TO 09/03/2024)" }
      ] },
      { sr: "2)", item: "Accomodation For Semi-Private Ward", rate: "3000.00", qty: 6, amount: "18000.00", details: "Dt.(04/03/2024 TO 09/03/2024)" },
      { sr: "3)", item: "Pathology Charges", rate: "1722.00", qty: 1, amount: "1722.00", details: "Dt.(04/03/2024 TO 15/03/2024) Note:Attached Pathology Break-up" },
      { sr: "4)", item: "Medicine Charges", rate: "21852.00", qty: 1, amount: "21852.00", details: "Dt.(04/03/2024 TO 15/03/2024) Note:Attached Pharmacy Statement with Bills" },
      { sr: "5)", item: "Others Charges", sub: [
        { sr: "i)", item: "ECG", code: "590", rate: "175.00", qty: 1, amount: "175.00" },
        { sr: "ii)", item: "MRI Shoulder", code: "1670", rate: "2300.00", qty: 1, amount: "2300.00" },
        { sr: "iii)", item: "Chest PA view", code: "1608", rate: "230.00", qty: 1, amount: "230.00" },
        { sr: "iv)", item: "RBS", code: "1444", rate: "24.00", qty: 38, amount: "912.00" }
      ] },
      { sr: "6)", item: "Surgical Treatment (10/03/2024)", sub: [
        { sr: "i)", item: "Other Major Surgery(Mumford Procedure)", code: "1238", rate: "40500", qty: 1, amount: "40500.00" },
        { sr: "ii)", item: "Capsulotomy of Shoulder", code: "1216", rate: "18170", qty: 1, amount: "9085.00", details: "Less : 50% as per CGHS Guidline" },
        { sr: "iii)", item: "Arthroscopy-therapeutic: with implant", code: "1190", rate: "17854", qty: 1, amount: "8927.00", details: "Less : 50% as per CGHS Guidline" },
        { sr: "iv)", item: "Biceps tenodesis", code: "1213", rate: "14490", qty: 1, amount: "7245.00", details: "Less : 50% as per CGHS Guidline" }
      ] },
      { sr: "7)", item: "Implant Charges", sub: [
        { sr: "i)", item: "Anchor Screw", code: "UNLISTED", rate: "21500.00", qty: 2, amount: "43000.00" }
      ] }
    ],
    total: "158,148.00"
  };

  // Print styles for A4
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

  // Type for invoice item and sub-item
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

  // Deep clone invoice items for state
  const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(deepClone(invoice.items));

  // Handler to update quantity
  const handleQtyChange = (idx: number, subIdx?: number, value?: number) => {
    setInvoiceItems((prevItems: InvoiceItem[]) => prevItems.map((item: InvoiceItem, i: number) => {
      if (i !== idx) return item;
      if (item.sub && typeof subIdx === 'number') {
        const newSub = item.sub.map((subItem: InvoiceSubItem, j: number) => {
          if (j !== subIdx) return subItem;
          const qty = value ?? 1;
          return { ...subItem, qty, amount: (parseFloat(subItem.rate) * qty).toFixed(2) };
        });
        return { ...item, sub: newSub };
      }
      if ('qty' in item && typeof item.qty === 'number') {
        const qty = value ?? 1;
        return { ...item, qty, amount: (parseFloat(item.rate!) * qty).toFixed(2) };
      }
      return item;
    }));
  };

  // Handler to update doctor name
  const handleDoctorNameChange = (idx: number, subIdx: number, newName: string) => {
    setInvoiceItems((prevItems: InvoiceItem[]) => prevItems.map((item: InvoiceItem, i: number) => {
      if (i !== idx) return item;
      if (item.sub && typeof subIdx === 'number') {
        const newSub = item.sub.map((subItem: InvoiceSubItem, j: number) => {
          if (j !== subIdx) return subItem;
          return { ...subItem, item: newName };
        });
        return { ...item, sub: newSub };
      }
      return item;
    }));
  };

  // Calculate total
  const total = invoiceItems.reduce((sum: number, item: InvoiceItem) => {
    if (item.sub) {
      return sum + item.sub.reduce((s: number, sub: InvoiceSubItem) => s + parseFloat(sub.amount), 0);
    } else if (item.amount) {
      return sum + parseFloat(item.amount);
    }
    return sum;
  }, 0);

  return (
    <div className="invoice-a4-page bg-white shadow border mt-6" style={{ maxWidth: '210mm', margin: '0 auto', padding: 16 }}>
      <style>{printStyles}</style>
      <div className="invoice-header">FINAL BILL</div>
      <div className="invoice-header">ESIC</div>
      <div className="invoice-header">CLAIM ID - ESIC-29430623</div>
      <div className="flex justify-between mt-2 mb-2" style={{ fontSize: '12px' }}>
        <div>
          <div><b>BILL NO</b>: {invoice.billNo}</div>
          <div><b>REGISTRATION NO</b>: {invoice.regNo}</div>
          <div><b>NAME OF PATIENT</b>: {invoice.patientName}</div>
          <div><b>AGE</b>: {patientData.age} YEARS</div>
          <div><b>SEX</b>: {patientData.gender.toUpperCase()}</div>
          <div><b>NAME OF ESIC BENEFICIARY</b>: {invoice.beneficiary}</div>
          <div><b>RELATION WITH ESIC EMPLOYEE</b>: {invoice.relation}</div>
          <div><b>RANK</b>: {invoice.rank}</div>
          <div><b>ESIC REGISTRATION NO</b>: {invoice.echsRegNo}</div>
          <div><b>CATEGORY</b>: <span className="invoice-green">{invoice.category}</span></div>
        </div>
        <div style={{ fontSize: '12px', marginLeft: 'auto', width: '50%', textAlign: 'left' }}>
          <div><b>DATE:-</b> {invoice.date}</div>
          <div style={{ marginTop: 24 }}><b>DIAGNOSIS</b>:</div>
          {diagnoses && diagnoses.length > 0
            ? diagnoses.map((d, i) => <div key={i}>*{d.name}</div>)
            : <div>*No diagnosis selected</div>}
          <div style={{ marginTop: 16 }}><b>DATE OF ADMISSION</b>: {patientData.dateOfAdmission}</div>
          <div><b>DATE OF DISCHARGE</b>: {patientData.dateOfDischarge}</div>
        </div>
      </div>
      <div className="mb-4 p-2 border rounded bg-blue-50">
        <div className="font-semibold mb-1">Doctor Master List</div>
        <ul className="list-disc pl-5">
          {doctorMasterList.map(doc => (
            <li key={doc.id} className="text-sm text-blue-900">{doc.name}</li>
          ))}
        </ul>
      </div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>SR.NO</th>
            <th>ITEM</th>
            <th>CGHS NABH CODE No.</th>
            <th>CGHS NABH RATE</th>
            <th>QTY</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {/* Render main items and sub-items */}
          {invoiceItems.map((row, idx) => {
            if (row.section === "Conservative Treatment") {
              return (
                <tr key={idx}>
                  <td colSpan={6}><b>{row.section}</b><br />Dt.({conservativeStart.split('-').reverse().join('/')} TO {conservativeEnd.split('-').reverse().join('/')})</td>
                </tr>
              );
            }
            if (row.section === "Surgical Package (7 Days)") {
              return (
                <tr key={idx}>
                  <td colSpan={6}><b>{row.section}</b><br />({surgicalStart.split('-').reverse().join('/')} TO {surgicalEnd.split('-').reverse().join('/')})</td>
                </tr>
              );
            }
            if (row.section && row.section !== "Conservative Treatment" && row.section !== "Surgical Package (7 Days)") {
              return (
                <tr key={idx}>
                  <td colSpan={6}><b>{row.section}</b></td>
                </tr>
              );
            }
            if (row.sr && row.sub === undefined && typeof row.qty === 'number') {
              return (
                <tr key={idx}>
                  <td>{row.sr}</td>
                  <td>{row.item}{row.details && <div style={{ fontSize: '11px', color: '#444' }}>{row.details}</div>}</td>
                  <td>{(row as any).code || ''}</td>
                  <td className="right-align">{row.rate}</td>
                  <td className="center-align">
                    <input type="number" min={1} value={row.qty} style={{ width: 50 }} onChange={e => handleQtyChange(idx, undefined, parseInt(e.target.value))} />
                  </td>
                  <td className="right-align">{row.amount}</td>
                </tr>
              );
            }
            if (row.sr && row.sub) {
              return (
                <React.Fragment key={idx}>
                  <tr className="invoice-section-title">
                    <td>{row.sr}</td>
                    <td colSpan={5} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b>{row.item}</b>
                      {row.item && row.item.toLowerCase().includes('consultation') && (
                        <button
                          type="button"
                          onClick={() => {
                            // Add a new doctor row to the consultation sub-rows
                            const newSub = [
                              ...row.sub!,
                              {
                                sr: String.fromCharCode(105 + row.sub!.length) + ')', // i), ii), iii), etc.
                                item: doctorMasterList[0]?.name || '',
                                rate: row.sub![0]?.rate || '350.00',
                                qty: 1,
                                amount: row.sub![0]?.rate || '350.00',
                                details: row.sub![0]?.details || ''
                              }
                            ];
                            setInvoiceItems(prevItems => prevItems.map((item, i) =>
                              i === idx ? { ...item, sub: newSub } : item
                            ));
                          }}
                          style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 4, padding: '2px 10px', fontSize: 12, cursor: 'pointer', marginLeft: 8 }}
                        >
                          + Add Row
                        </button>
                      )}
                      {row.item && row.item.toLowerCase().includes('others charges') && (
                        <button
                          type="button"
                          onClick={() => {
                            // Add a new other charge row to the sub-rows
                            const newSub = [
                              ...row.sub!,
                              {
                                sr: String.fromCharCode(105 + row.sub!.length) + ')',
                                item: '',
                                code: '',
                                rate: '0.00',
                                qty: 1,
                                amount: '0.00',
                              }
                            ];
                            setInvoiceItems(prevItems => prevItems.map((item, i) =>
                              i === idx ? { ...item, sub: newSub } : item
                            ));
                          }}
                          style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 4, padding: '2px 10px', fontSize: 12, cursor: 'pointer', marginLeft: 8 }}
                        >
                          + Add Row
                        </button>
                      )}
                      {row.item && row.item.toLowerCase().includes('implant charges') && (
                        <button
                          type="button"
                          onClick={() => {
                            // Add a new implant charge row to the sub-rows
                            const subArray = Array.isArray(row.sub) ? row.sub : [];
                            const newSub = [
                              ...subArray,
                              {
                                sr: String.fromCharCode(105 + subArray.length) + ')',
                                item: '',
                                code: '',
                                rate: '0.00',
                                qty: 1,
                                amount: '0.00',
                              }
                            ];
                            setInvoiceItems(prevItems => prevItems.map((item, i) =>
                              i === idx ? { ...item, sub: newSub } : item
                            ));
                          }}
                          style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 4, padding: '2px 10px', fontSize: 12, cursor: 'pointer', marginLeft: 8 }}
                        >
                          + Add Row
                        </button>
                      )}
                    </td>
                  </tr>
                  {row.sub.map((sub: InvoiceSubItem, subIdx: number) => (
                    <tr key={subIdx}>
                      <td>{sub.sr}</td>
                      <td>
                        {/* Only show dropdown for doctor rows (you can refine this check as needed) */}
                        {row.item && row.item.toLowerCase().includes('consultation') ? (
                          <select value={sub.item} onChange={e => {
                            const newName = e.target.value;
                            handleDoctorNameChange(idx, subIdx, newName);
                          }} className="border rounded px-1 py-0.5 bg-white">
                            {doctorMasterList.map(doc => (
                              <option key={doc.id} value={doc.name}>{doc.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span>{sub.item}</span>
                        )}
                        {sub.details && <div style={{ fontSize: '11px', color: '#444' }}>{sub.details}</div>}
                      </td>
                      <td>{sub.code || ''}</td>
                      <td className="right-align">{sub.rate}</td>
                      <td className="center-align">
                        {typeof sub.qty === 'number' ? (
                          <input type="number" min={1} value={sub.qty} style={{ width: 50 }} onChange={e => handleQtyChange(idx, subIdx, parseInt(e.target.value))} />
                        ) : null}
                      </td>
                      <td className="right-align">{sub.amount}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            }
            return null;
          })}
          {/* Total row */}
          <tr className="invoice-total-row">
            <td colSpan={5} style={{ textAlign: 'center' }}>TOTAL BILL AMOUNT</td>
            <td className="right-align">{total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-between mt-8" style={{ fontSize: 13 }}>
        <div>Bill Manager</div>
        <div>Cashier</div>
        <div>Patient/Attender Sign</div>
        <div>Med.Supdt</div>
        <div>Authorised Signatory</div>
      </div>
    </div>
  );
}

export function PatientDashboard() {
  // User-input states for dates
  const [conservativeStart, setConservativeStart] = useState('2024-03-04');
  const [conservativeEnd, setConservativeEnd] = useState('2024-03-09');
  const [surgicalStart, setSurgicalStart] = useState('2024-03-10');
  const [surgicalEnd, setSurgicalEnd] = useState('2024-03-15');

  const [visits, setVisits] = useState(visitHistoryData)
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
  
  // Mock data for surgeries
  const surgeryDatabase = [
    { id: "s1", name: "Appendectomy", cghs: "180010", category: "General Surgery", packageAmount: 22000 },
    { id: "s2", name: "Hernia Repair", cghs: "180025", category: "General Surgery", packageAmount: 25000 },
    { id: "s3", name: "Cholecystectomy", cghs: "180020", category: "General Surgery", packageAmount: 30000 },
    { id: "s4", name: "Arthroscopic Knee Surgery", cghs: "330025", category: "Orthopedic", packageAmount: 35000 },
    { id: "s5", name: "Cataract Surgery", cghs: "280015", category: "Ophthalmic", packageAmount: 18000 },
    { id: "s6", name: "Hemorrhoidectomy", cghs: "180040", category: "General Surgery", packageAmount: 15000 },
    { id: "s7", name: "Tonsillectomy", cghs: "155010", category: "ENT", packageAmount: 20000 }
  ];
  
  // Filter surgeries based on search term
  const filteredSurgeries = surgeryDatabase.filter(
    (surgery) => 
      surgery.name.toLowerCase().includes(surgerySearchTerm.toLowerCase()) ||
      surgery.cghs.toLowerCase().includes(surgerySearchTerm.toLowerCase()) ||
      surgery.category.toLowerCase().includes(surgerySearchTerm.toLowerCase())
  );

  const router = useRouter();

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
              <strong>Patient ID:</strong> ${patientData.id}
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

  return (
    <div className="flex">
      {/* Resizable Secondary Sidebar */}
      <div
        className={`transition-all relative bg-white border-r shadow-md flex flex-col h-full sticky top-0 z-20 ${isSidebarExpanded ? '' : 'w-12'} min-h-screen`}
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
            <div className="h-16 w-[3px] bg-blue-200 rounded-full opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        )}
        
        {/* Expand button, only show when collapsed */}
        {!isSidebarExpanded && (
          <button
            className="w-full py-2 border-b text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center"
            onClick={() => setIsSidebarExpanded(true)}
            title="Expand sidebar"
          >
            <span className="sr-only">Expand sidebar</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}
        
        {/* Collapse button, only show when expanded */}
        {isSidebarExpanded && (
          <button
            className="w-full py-2 border-b text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center"
            onClick={() => setIsSidebarExpanded(false)}
            title="Collapse sidebar"
          >
            <span className="sr-only">Collapse sidebar</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
        
        <div className="flex-1 flex flex-col gap-0 p-0 m-0">
          {/* Merged Surgeries/Complications Card with Tabs */}
          <div className={isSidebarExpanded ? '' : 'hidden'}>
            <Card className="shadow-none border-none m-0 p-0 bg-white">
              <CardHeader className="pb-3 m-0 p-0 px-4 pt-4">
                <CardTitle className="text-base">Patient Details</CardTitle>
                <CardDescription>Diagnoses and Complications</CardDescription>
              </CardHeader>
              <CardContent className="m-0 p-0 px-4 pb-4">
                <Tabs defaultValue="diagnoses" className="w-full">
                  <TabsList className="flex gap-1 mb-0 bg-transparent p-0 rounded-none w-full border-none shadow-none">
                    <TabsTrigger 
                      value="diagnoses" 
                      className="flex-1 text-center rounded-none px-1 py-2 data-[state=active]:bg-white data-[state=active]:font-bold border-none shadow-none m-0 text-xs"
                    >
                      Diagnoses
                    </TabsTrigger>
                    <TabsTrigger 
                      value="surgeries"
                      className="flex-1 text-center rounded-none px-1 py-2 data-[state=active]:bg-white data-[state=active]:font-bold border-none shadow-none m-0 text-xs"
                    >
                      Surgeries
                    </TabsTrigger>
                    <TabsTrigger 
                      value="complications"
                      className="flex-1 text-center rounded-none px-1 py-2 data-[state=active]:bg-white data-[state=active]:font-bold border-none shadow-none m-0 text-xs"
                    >
                      Compl.
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="diagnoses">
                    <div className="mb-4" ref={searchContainerRef}>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                          placeholder="Search by diagnosis name or ICD code..."
                          value={diagnosisSearchTerm}
                          onChange={(e) => {
                            setDiagnosisSearchTerm(e.target.value)
                            setIsSearchResultsVisible(true)
                          }}
                          onFocus={() => setIsSearchResultsVisible(true)}
                          className="pl-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      
                      {/* Search Results */}
                      {isSearchResultsVisible && diagnosisSearchTerm && (
                        <div className="mt-2 border rounded-md max-h-[200px] overflow-y-auto">
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
                                    onClick={() => handleAddDiagnosis(diagnosis)}
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
                      )}
                      
                      {/* Selected Diagnoses Tags */}
                      {diagnoses.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {diagnoses.map((diagnosis) => (
                            <div key={diagnosis.id} className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                              {diagnosis.name}
                              <button 
                                onClick={() => handleRemoveDiagnosis(diagnosis.id)}
                                className="ml-1 text-blue-500 hover:text-blue-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <DiagnosisList 
                      onSelect={setSelectedDiagnosis} 
                      selected={selectedDiagnosis}
                      diagnoses={diagnoses}
                      onDelete={handleRemoveDiagnosis}
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
                          className="pl-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      
                      {/* Surgery Search Results */}
                      {isSurgerySearchResultsVisible && surgerySearchTerm && (
                        <div className="mt-2 border rounded-md max-h-[300px] overflow-y-auto">
                          {filteredSurgeries.length > 0 ? (
                            <div className="divide-y">
                              {filteredSurgeries.map((surgery) => (
                                <div 
                                  key={surgery.id}
                                  className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer"
                                >
                                  <div className="flex-grow">
                                    <p className="font-medium">{surgery.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                        CGHS: {surgery.cghs}
                                      </Badge>
                                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                                        {surgery.category}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-semibold text-blue-700">₹{surgery.packageAmount.toLocaleString()}</p>
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
                            <div className="p-4 text-center text-muted-foreground">
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
                                const surgery = surgeryDatabase.find(s => s.id === surgeryId);
                                if (!surgery) return null;
                                
                                return (
                                  <tr key={surgeryId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                      <div className="text-sm font-medium text-gray-900">{surgery.name}</div>
                                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 px-1.5 py-0.5 text-[10px]">
                                          CGHS: {surgery.cghs}
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
                          className="w-full"
                          onClick={() => {
                            setTemporarySelectedSurgeries([]);
                            setShowSurgerySelectionDialog(true);
                          }}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
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
        <div className="p-4" style={{ minWidth: 0 }}>
          <Card className="border-blue-100 transition-all duration-300 shadow-md bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  {/* Avatar with upload */}
                  <div className="relative group">
                    <Avatar
                      className={`transition-all duration-300 border-2 border-blue-100 h-16 w-16 cursor-pointer`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {patientImage ? (
                        <AvatarImage src={patientImage} alt={patientData.name} />
                      ) : (
                        <AvatarFallback className="bg-blue-50 text-blue-700 text-xl font-semibold">
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
                    <span className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs rounded-full px-1 opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-2xl">{patientData.name}</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="outline" className="px-2 py-1 bg-blue-50 text-blue-700 border-blue-200">
                        ID: {patientData.id}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {patientData.age} years, {patientData.gender}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={patientData.insuranceStatus === "Active" ? "bg-green-500" : "bg-amber-500"}>
                  {patientData.insuranceStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{patientData.phone}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Last Visit: {patientData.lastVisit}</span>
                </div>
                <div className="flex items-center">
                  <UserRound className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Registered: {patientData.registrationDate}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-green-600" />
                  <span className="text-sm">Admission: {patientData.dateOfAdmission}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-red-600" />
                  <span className="text-sm">Discharge: {patientData.dateOfDischarge}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="px-4 grid gap-6 md:grid-cols-12">
          {/* Investigations, Medications, and Action Buttons */}
          <div className="md:col-span-4 space-y-6">
            {/* Investigations Section with Tabs */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Investigations</CardTitle>
                    <CardDescription>All investigations and reports</CardDescription>
                  </div>
                  {/* Investigation Tabs */}
                  <div className="flex gap-2">
                    {['all', 'radiology', 'lab', 'other'].map(tab => (
                      <button
                        key={tab}
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors border ${selectedInvTab === tab ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                        onClick={() => setSelectedInvTab(tab)}
                      >
                        {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day Tabs (D1-D4) for all except 'all' tab */}
                {selectedInvTab !== 'all' && (
                  <div className="flex gap-2 mb-4">
                    {['D1', 'D2', 'D3', 'D4'].map(day => (
                      <button
                        key={day}
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors border ${selectedInvDay === day ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
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
            <Card>
              <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                <CardTitle className="text-base">Medications</CardTitle>
                <CardDescription>To be given</CardDescription>
                      </div>
                      {/* Day Tabs */}
                      <div className="flex gap-2">
                        {['D1', 'D2', 'D3', 'D4'].map(day => (
                          <button
                            key={day}
                            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors border ${selectedMedDay === day ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                            onClick={() => setSelectedMedDay(day)}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
              </CardHeader>
              <CardContent>
                      <MedicationsList 
                  complicationIds={[basicComplicationId]}
                        day={selectedMedDay}
                      />
              </CardContent>
            </Card>
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleGenerateInvoice}>
                  <Receipt className="mr-2 h-4 w-4" />
                  Generate Invoice
                </Button>
                <Button variant="outline" onClick={handleGenerateCaseSheet}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Case Sheet
              </Button>
                <Button onClick={handleSaveChanges} disabled={!hasUnsavedChanges}>
                  Save Changes
                </Button>
            </div>
          </div>
          {/* Invoice Page to the right */}
          <div className="md:col-span-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Conservative Treatment Start</label>
                <input type="date" value={conservativeStart} onChange={e => setConservativeStart(e.target.value)} className="border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Conservative Treatment End</label>
                <input type="date" value={conservativeEnd} onChange={e => setConservativeEnd(e.target.value)} className="border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Surgical Package Start</label>
                <input type="date" value={surgicalStart} onChange={e => setSurgicalStart(e.target.value)} className="border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Surgical Package End</label>
                <input type="date" value={surgicalEnd} onChange={e => setSurgicalEnd(e.target.value)} className="border rounded px-2 py-1" />
              </div>
            </div>
            <InvoicePage patientId={patientData.id} diagnoses={diagnoses} 
              conservativeStart={conservativeStart} conservativeEnd={conservativeEnd}
              surgicalStart={surgicalStart} surgicalEnd={surgicalEnd}
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
                          key={visit.visitId}
                            className={index % 2 === 0 
                              ? "bg-white hover:bg-blue-50/50 transition-colors" 
                              : "bg-blue-50/20 hover:bg-blue-50/50 transition-colors"}
                        >
                          <td className="p-4 align-middle font-medium">{visit.visitId}</td>
                          <td className="p-4 align-middle">{visit.date}</td>
                          <td className="p-4 align-middle">{visit.reason}</td>
                          <td className="p-4 align-middle">{visit.doctor}</td>
                          <td className="p-4 align-middle">{visit.department}</td>
                          <td className="p-4 align-middle text-muted-foreground">{visit.notes}</td>
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
                onChange={(e) => setSurgerySearchTerm(e.target.value)}
                className="pl-10 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="mt-2 border rounded-md overflow-y-auto" style={{ maxHeight: "400px" }}>
              {filteredSurgeries.length > 0 ? (
                <div className="divide-y">
                  {filteredSurgeries.map((surgery) => (
                    <div 
                      key={surgery.id}
                      className="flex items-center p-3 hover:bg-muted cursor-pointer"
                      onClick={() => toggleSurgerySelection(surgery.id)}
                    >
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          checked={temporarySelectedSurgeries.includes(surgery.id)}
                          onChange={() => toggleSurgerySelection(surgery.id)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex-grow ml-3">
                        <p className="font-medium">{surgery.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                            CGHS: {surgery.cghs}
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                            {surgery.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-700">₹{surgery.packageAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
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
                  const surgery = surgeryDatabase.find(s => s.id === surgeryId);
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
