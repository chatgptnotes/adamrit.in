"use client"

import { useState, useEffect } from "react"
import { PatientDashboard } from "@/components/patient-dashboard"
import { DiagnosisMaster } from "@/components/diagnosis-master"
import { SurgeryMaster } from "@/components/surgery-master"
import { Approvals } from "@/components/esic-approvals"
import { ReportsAnalytics } from "@/components/reports-analytics"
import { MedicalStaffMaster } from "@/components/medical-staff-master"
import { PatientRegistryList } from "@/components/patient-registry-list"
import { 
  Search, 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  BarChart3, 
  Building2, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Scissors,
  UserCog,
  UserPlus,
  Stethoscope,
  User,
  Monitor,
  TestTube,
  FileSearch,
  Pill,
  Calendar,
  LayoutDashboard,
  ActivitySquare,
  PlusCircle,
  Pencil,
  Trash2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import UserAddForm from "@/components/user-add-form"
import { useRouter, useSearchParams } from "next/navigation"
import UserList from "@/components/user-list"
import AddDiagnosisForm from "@/components/add-diagnosis-form"
import AddRadiologyForm from "@/components/add-radiology-form"
import AddLabForm from "@/components/add-lab-form"
import AddOtherInvestigationForm from "@/components/add-other-investigation-form"
import AddMedicationForm from "@/components/add-medication-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter, TableCaption } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Link from "next/link"

export default function Home() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as
    | "patient"
    | "patient-dashboard"
    | "diagnosis-master"
    | "cghs-surgery-master"
    | "yojna-surgery-master"
    | "private-surgery-master"
    | "complications-master"
    | "radiology-master"
    | "lab-master"
    | "other-investigations-master"
    | "medications-master"
    | "medical-staff-master"
    | "approvals"
    | "reports"
    | "settings"
    | "doctor-master"
    | "user-list"
    | "today-ipd-dashboard"
    | "today-opd-dashboard"
    | "patient-registration";
  const activeTab = tabFromUrl || "patient";
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showAddDiagnosis, setShowAddDiagnosis] = useState(false)
  const [showAddSurgery, setShowAddSurgery] = useState(false)
  const [surgeries, setSurgeries] = useState([
    { name: "Appendectomy", amount: "₹10,000", code: "S001", complication1: "Surgical Site Infection", complication2: "Bleeding", complication3: "Intestinal Obstruction", complication4: "none" },
    { name: "Cholecystectomy", amount: "₹12,000", code: "S002", complication1: "Bile Leak", complication2: "Bleeding", complication3: "Infection", complication4: "none" },
    { name: "Hernia Repair", amount: "₹8,000", code: "S003", complication1: "Infection", complication2: "Recurrence", complication3: "none", complication4: "none" },
    { name: "Cataract Surgery", amount: "₹7,500", code: "S004", complication1: "Infection", complication2: "Retinal Detachment", complication3: "none", complication4: "none" },
    { name: "Coronary Bypass", amount: "₹1,50,000", code: "S005", complication1: "Bleeding", complication2: "Infection", complication3: "Pulmonary Embolism", complication4: "Heart Arrhythmias" },
  ])
  const [diagnoses, setDiagnoses] = useState([
    { name: "Fever", complication1: "Dehydration", complication2: "Seizure", complication3: "Hypotension", complication4: "none" },
    { name: "Diabetes Mellitus", complication1: "Diabetic Ketoacidosis", complication2: "Diabetic Retinopathy", complication3: "Diabetic Neuropathy", complication4: "Diabetic Foot Ulcer" },
    { name: "Hypertension", complication1: "Hypertensive Crisis", complication2: "Hypertensive Heart Disease", complication3: "Hypertensive Retinopathy", complication4: "none" },
    { name: "Asthma", complication1: "Acute Respiratory Failure", complication2: "Pneumonia", complication3: "none", complication4: "none" },
    { name: "COVID-19", complication1: "Acute Respiratory Distress", complication2: "Pneumonia", complication3: "Myocarditis", complication4: "Blood Clot" },
  ])
  const [radiology, setRadiology] = useState([
    { name: "Chest X-ray", cost: "₹300", code: "R001" },
    { name: "CT Head", cost: "₹2,000", code: "R002" },
    { name: "MRI Brain", cost: "₹5,000", code: "R003" },
    { name: "Ultrasound Abdomen", cost: "₹1,200", code: "R004" },
    { name: "ECG", cost: "₹250", code: "R005" },
  ])
  const [showAddRadiology, setShowAddRadiology] = useState(false)
  const [lab, setLab] = useState([
    { name: "CBC", cost: "₹400", code: "L001" },
    { name: "Blood Glucose", cost: "₹150", code: "L002" },
    { name: "Liver Function Test", cost: "₹800", code: "L003" },
    { name: "Kidney Function Test", cost: "₹700", code: "L004" },
    { name: "Urine Routine", cost: "₹120", code: "L005" },
  ])
  const [showAddLab, setShowAddLab] = useState(false)
  const [otherInvestigations, setOtherInvestigations] = useState([
    { name: "Pulmonary Function Test", cost: "₹1,000", code: "OI001" },
    { name: "Holter Monitoring", cost: "₹2,500", code: "OI002" },
    { name: "EEG", cost: "₹1,200", code: "OI003" },
    { name: "EMG", cost: "₹1,800", code: "OI004" },
    { name: "Sleep Study", cost: "₹3,000", code: "OI005" },
  ])
  const [showAddOtherInvestigation, setShowAddOtherInvestigation] = useState(false)
  const [medications, setMedications] = useState([
    { name: "Paracetamol 500mg", type: "Tablet", cost: "₹20" },
    { name: "Amoxicillin 500mg", type: "Capsule", cost: "₹50" },
    { name: "Ibuprofen 400mg", type: "Tablet", cost: "₹30" },
    { name: "Metformin 500mg", type: "Tablet", cost: "₹40" },
    { name: "Atorvastatin 10mg", type: "Tablet", cost: "₹60" },
    { name: "Ceftriaxone 1g", type: "Injection", cost: "₹120" },
    { name: "Paracetamol Syrup 250mg/5ml", type: "Syrup", cost: "₹35" },
    { name: "Betadine Ointment", type: "Ointment", cost: "₹25" },
  ])
  const [showAddMedication, setShowAddMedication] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [users, setUsers] = useState([
    { name: "Rahul Sharma", email: "rahul@example.com", role: "Admin" },
    { name: "Priya Singh", email: "priya@example.com", role: "Doctor" },
    { name: "Amit Verma", email: "amit@example.com", role: "Nurse" },
    { name: "Neha Gupta", email: "neha@example.com", role: "Receptionist" },
    { name: "Suresh Kumar", email: "suresh@example.com", role: "Lab Technician" },
  ])
  const [doctors, setDoctors] = useState([
    { name: "Dr. A. Kumar", degree: "MBBS, MD", specialization: "Cardiology", isReferring: true, isAnaesthetist: false, isSurgeon: false, isRadiologist: false, isPathologist: false, isPhysician: true, otherSpeciality: "" },
    { name: "Dr. S. Mehta", degree: "MBBS, MS", specialization: "Orthopedics", isReferring: false, isAnaesthetist: false, isSurgeon: true, isRadiologist: false, isPathologist: false, isPhysician: false, otherSpeciality: "" },
    { name: "Dr. R. Singh", degree: "MBBS, DNB", specialization: "Radiology", isReferring: false, isAnaesthetist: false, isSurgeon: false, isRadiologist: true, isPathologist: false, isPhysician: false, otherSpeciality: "" },
    { name: "Dr. P. Gupta", degree: "MBBS, MS", specialization: "General Surgery", isReferring: true, isAnaesthetist: false, isSurgeon: true, isRadiologist: false, isPathologist: false, isPhysician: false, otherSpeciality: "" },
    { name: "Dr. S. Patel", degree: "MBBS, MD", specialization: "Anesthesiology", isReferring: false, isAnaesthetist: true, isSurgeon: false, isRadiologist: false, isPathologist: false, isPhysician: false, otherSpeciality: "" },
    { name: "Dr. V. Sharma", degree: "MBBS, MD", specialization: "Pathology", isReferring: false, isAnaesthetist: false, isSurgeon: false, isRadiologist: false, isPathologist: true, isPhysician: false, otherSpeciality: "" },
  ])
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")
  const [complications, setComplications] = useState([
    { name: "Infection", riskLevel: "High", description: "Post-operative infection", inv1: "", inv2: "", inv3: "", inv4: "", med1: "", med2: "", med3: "", med4: "" },
    { name: "Bleeding", riskLevel: "Medium", description: "Excessive bleeding", inv1: "", inv2: "", inv3: "", inv4: "", med1: "", med2: "", med3: "", med4: "" },
    { name: "Allergic Reaction", riskLevel: "Medium", description: "Medication-related", inv1: "", inv2: "", inv3: "", inv4: "", med1: "", med2: "", med3: "", med4: "" },
    { name: "Blood Clot", riskLevel: "High", description: "Deep vein thrombosis", inv1: "", inv2: "", inv3: "", inv4: "", med1: "", med2: "", med3: "", med4: "" },
    { name: "Pneumonia", riskLevel: "Medium", description: "Post-operative", inv1: "", inv2: "", inv3: "", inv4: "", med1: "", med2: "", med3: "", med4: "" }
  ])
  const [showAddComplication, setShowAddComplication] = useState(false)

  // Replace with separate state variables for each surgery type
  const [showAddCGHSSurgery, setShowAddCGHSSurgery] = useState(false)
  const [showAddYojnaSurgery, setShowAddYojnaSurgery] = useState(false)
  const [showAddPrivateSurgery, setShowAddPrivateSurgery] = useState(false)
  
  const [cghsSurgeries, setCGHSSurgeries] = useState([
    { type: "cghs", name: "Appendectomy", amount: "₹10,000", code: "CGHS-001", complication1: "Surgical Site Infection", complication2: "Bleeding", complication3: "Intestinal Obstruction", complication4: "none" },
    { type: "cghs", name: "Cholecystectomy", amount: "₹12,000", code: "CGHS-002", complication1: "Bile Leak", complication2: "Bleeding", complication3: "Infection", complication4: "none" },
    { type: "cghs", name: "Hernia Repair", amount: "₹8,000", code: "CGHS-003", complication1: "Infection", complication2: "Recurrence", complication3: "none", complication4: "none" },
  ])
  
  const [yojnaSurgeries, setYojnaSurgeries] = useState([
    { type: "yojna", name: "Cataract Surgery", amount: "₹5,000", code: "PMJAY-001", complication1: "Infection", complication2: "Retinal Detachment", complication3: "none", complication4: "none" },
    { type: "yojna", name: "Joint Replacement", amount: "₹80,000", code: "PMJAY-002", complication1: "Infection", complication2: "Blood Clot", complication3: "Joint Stiffness", complication4: "none" },
  ])
  
  const [privateSurgeries, setPrivateSurgeries] = useState([
    { type: "private", name: "Coronary Bypass", amount: "₹2,50,000", code: "PVT-001", complication1: "Bleeding", complication2: "Infection", complication3: "Pulmonary Embolism", complication4: "Heart Arrhythmias" },
    { type: "private", name: "Spinal Fusion", amount: "₹3,00,000", code: "PVT-002", complication1: "Nerve Damage", complication2: "Infection", complication3: "Blood Clot", complication4: "none" },
  ])

  // Add useEffect to handle initial state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }
  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = searchValue.trim().toLowerCase();
      const patients = [
        { id: "ESIC-2023-1001", name: "Rahul Sharma" },
        { id: "ESIC-2023-1002", name: "Amit Verma" },
        { id: "ESIC-2023-1003", name: "Suman Gupta" },
      ];
      const found = patients.find(p => p.name.toLowerCase() === value);
      if (found) {
        window.alert(`Redirecting to Register New Visit for ${found.name}`);
        router.push(`/visit/IPD-2023-5001`);
      } else {
        window.alert("Patient not found");
      }
    }
  }
  
  return (
    <div className="flex-1">
        <header className="h-14 border-b flex items-center px-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
            {activeTab === "today-ipd-dashboard" && "Today's IPD Dashboard"}
            {activeTab === "today-opd-dashboard" && "Today's OPD Dashboard"}
              {activeTab === "patient" && "Patient Management"}
              {activeTab === "patient-dashboard" && "Patient Dashboard"}
              {activeTab === "diagnosis-master" && "Diagnosis Master"}
            {activeTab === "cghs-surgery-master" && "CGHS Surgery Master"}
            {activeTab === "yojna-surgery-master" && "Yojna Surgery Master"}
            {activeTab === "private-surgery-master" && "Private Surgery Master"}
            {activeTab === "complications-master" && "Complication Master"}
              {activeTab === "radiology-master" && "Radiology Master"}
              {activeTab === "lab-master" && "Lab Master"}
              {activeTab === "other-investigations-master" && "Other Investigations Master"}
              {activeTab === "medications-master" && "Medications Master"}
              {activeTab === "medical-staff-master" && "Medical Staff Master"}
            {activeTab === "approvals" && "Approvals"}
              {activeTab === "reports" && "Reports & Analytics"}
              {activeTab === "settings" && "Settings"}
              {activeTab === "doctor-master" && "Doctor Master"}
            </h2>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search..." 
            />
          </div>
        </header>
      <main className="flex-1 overflow-auto">
        {activeTab === "today-ipd-dashboard" && (
          <div className="p-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Today's IPD Dashboard</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Total IPD Patients</h4>
                  <p className="text-3xl font-bold">24</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Admissions Today</h4>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Discharges Today</h4>
                  <p className="text-3xl font-bold">5</p>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IPD Visit ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room No.</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primary Diagnosis</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/IPD-2023-5001`} className="text-blue-600 underline">IPD-2023-5001</Link>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">ESIC-2023-1008</td>
                      <td className="px-4 py-2 whitespace-nowrap">Rajesh Kumar</td>
                      <td className="px-4 py-2 whitespace-nowrap">205-A</td>
                      <td className="px-4 py-2 whitespace-nowrap">15 May 2023</td>
                      <td className="px-4 py-2 whitespace-nowrap">Pneumonia</td>
                      <td className="px-4 py-2 whitespace-nowrap">Dr. S. Mehta</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/IPD-2023-5002`} className="text-blue-600 underline">IPD-2023-5002</Link>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">ESIC-2023-1015</td>
                      <td className="px-4 py-2 whitespace-nowrap">Priya Sharma</td>
                      <td className="px-4 py-2 whitespace-nowrap">103-B</td>
                      <td className="px-4 py-2 whitespace-nowrap">17 May 2023</td>
                      <td className="px-4 py-2 whitespace-nowrap">Appendicitis</td>
                      <td className="px-4 py-2 whitespace-nowrap">Dr. P. Gupta</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/IPD-2023-5003`} className="text-blue-600 underline">IPD-2023-5003</Link>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">ESIC-2023-1023</td>
                      <td className="px-4 py-2 whitespace-nowrap">Anil Verma</td>
                      <td className="px-4 py-2 whitespace-nowrap">307-C</td>
                      <td className="px-4 py-2 whitespace-nowrap">18 May 2023</td>
                      <td className="px-4 py-2 whitespace-nowrap">Myocardial Infarction</td>
                      <td className="px-4 py-2 whitespace-nowrap">Dr. A. Kumar</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/IPD-2023-5004`} className="text-blue-600 underline">IPD-2023-5004</Link>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">ESIC-2023-1027</td>
                      <td className="px-4 py-2 whitespace-nowrap">Sunita Singh</td>
                      <td className="px-4 py-2 whitespace-nowrap">202-A</td>
                      <td className="px-4 py-2 whitespace-nowrap">18 May 2023</td>
                      <td className="px-4 py-2 whitespace-nowrap">Cholecystitis</td>
                      <td className="px-4 py-2 whitespace-nowrap">Dr. P. Gupta</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "today-opd-dashboard" && (
          <div className="p-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Today's OPD Dashboard</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm text-blue-700 font-medium mb-2">Total OPD Patients</h4>
                  <p className="text-3xl font-bold">42</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm text-green-700 font-medium mb-2">Morning Slot</h4>
                  <p className="text-3xl font-bold">28</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="text-sm text-purple-700 font-medium mb-2">Evening Slot</h4>
                  <p className="text-3xl font-bold">14</p>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OPD Visit ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token No</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/OPD-2023-2001`} className="text-blue-600 underline">OPD-2023-2001</Link>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">T-001</td>
                      <td className="px-4 py-2 whitespace-nowrap">ESIC-2023-1001</td>
                      <td className="px-4 py-2 whitespace-nowrap">Rahul Sharma</td>
                      <td className="px-4 py-2 whitespace-nowrap">09:30 AM</td>
                      <td className="px-4 py-2 whitespace-nowrap">Cardiology</td>
                      <td className="px-4 py-2 whitespace-nowrap">Dr. A. Kumar</td>
                      <td className="px-4 py-2 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span></td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/IPD-registration?patientId=ESIC-2023-1001&name=Rahul%20Sharma`}>
                          <button 
                            className="flex items-center justify-center p-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full" 
                            title="Register New IPD Visit"
                          >
                            <span className="text-xs font-bold">OPD→IPD</span>
                          </button>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/OPD-2023-2002`} className="text-blue-600 underline">OPD-2023-2002</Link>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">T-002</td>
                      <td className="px-4 py-2 whitespace-nowrap">ESIC-2023-1012</td>
                      <td className="px-4 py-2 whitespace-nowrap">Mohan Patel</td>
                      <td className="px-4 py-2 whitespace-nowrap">10:00 AM</td>
                      <td className="px-4 py-2 whitespace-nowrap">Orthopedics</td>
                      <td className="px-4 py-2 whitespace-nowrap">Dr. S. Mehta</td>
                      <td className="px-4 py-2 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span></td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/IPD-registration?patientId=ESIC-2023-1012&name=Mohan%20Patel`}>
                          <button 
                            className="flex items-center justify-center p-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full" 
                            title="Register New IPD Visit"
                          >
                            <span className="text-xs font-bold">OPD→IPD</span>
                          </button>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/OPD-2023-2003`} className="text-blue-600 underline">OPD-2023-2003</Link>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">T-003</td>
                      <td className="px-4 py-2 whitespace-nowrap">ESIC-2023-1018</td>
                      <td className="px-4 py-2 whitespace-nowrap">Geeta Desai</td>
                      <td className="px-4 py-2 whitespace-nowrap">10:30 AM</td>
                      <td className="px-4 py-2 whitespace-nowrap">General Medicine</td>
                      <td className="px-4 py-2 whitespace-nowrap">Dr. R. Singh</td>
                      <td className="px-4 py-2 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Progress</span></td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/IPD-registration?patientId=ESIC-2023-1018&name=Geeta%20Desai`}>
                          <button 
                            className="flex items-center justify-center p-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full" 
                            title="Register New IPD Visit"
                          >
                            <span className="text-xs font-bold">OPD→IPD</span>
                          </button>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/OPD-2023-2004`} className="text-blue-600 underline">OPD-2023-2004</Link>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">T-004</td>
                      <td className="px-4 py-2 whitespace-nowrap">ESIC-2023-1025</td>
                      <td className="px-4 py-2 whitespace-nowrap">Vikram Malhotra</td>
                      <td className="px-4 py-2 whitespace-nowrap">11:00 AM</td>
                      <td className="px-4 py-2 whitespace-nowrap">ENT</td>
                      <td className="px-4 py-2 whitespace-nowrap">Dr. P. Gupta</td>
                      <td className="px-4 py-2 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Waiting</span></td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <Link href={`/visit/IPD-registration?patientId=ESIC-2023-1025&name=Vikram%20Malhotra`}>
                          <button 
                            className="flex items-center justify-center p-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full" 
                            title="Register New IPD Visit"
                          >
                            <span className="text-xs font-bold">OPD→IPD</span>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
          {activeTab === "patient" && <PatientDashboard />}
          {activeTab === "patient-dashboard" && <PatientRegistryList />}
          {activeTab === "diagnosis-master" && (
          <div className="p-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Diagnosis Master</h3>
              <div className="mb-4 flex items-center gap-2">
                <label htmlFor="diagnosis-upload" className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">Upload Excel/CSV</label>
                <input id="diagnosis-upload" type="file" accept=".csv,.xls,.xlsx" className="hidden" />
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded ml-2"
                  onClick={() => setShowAddDiagnosis(true)}
                >
                  + Add More
                </button>
              </div>
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Name</th>
                    <th className="border px-2 py-1 text-left">Complication 1</th>
                    <th className="border px-2 py-1 text-left">Complication 2</th>
                    <th className="border px-2 py-1 text-left">Complication 3</th>
                    <th className="border px-2 py-1 text-left">Complication 4</th>
                    <th className="border px-2 py-1 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnoses.map((diagnosis, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{diagnosis.name}</td>
                      <td className="border px-2 py-1">{diagnosis.complication1 === "none" ? "" : diagnosis.complication1}</td>
                      <td className="border px-2 py-1">{diagnosis.complication2 === "none" ? "" : diagnosis.complication2}</td>
                      <td className="border px-2 py-1">{diagnosis.complication3 === "none" ? "" : diagnosis.complication3}</td>
                      <td className="border px-2 py-1">{diagnosis.complication4 === "none" ? "" : diagnosis.complication4}</td>
                      <td className="border px-2 py-1 flex gap-2">
                        <button title="View">👁️</button>
                        <button title="Edit">✏️</button>
                        <button title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          )}
          {showAddDiagnosis && (
            <AddDiagnosisForm
              onCancel={() => setShowAddDiagnosis(false)}
            onSubmit={(name, formData) => {
              if (formData) {
                setDiagnoses([...diagnoses, formData]);
              } else {
                setDiagnoses([...diagnoses, { 
                  name, 
                  complication1: "none", 
                  complication2: "none", 
                  complication3: "none", 
                  complication4: "none" 
                }]);
              }
                setShowAddDiagnosis(false);
                window.alert("Diagnosis Added Successfully!");
              }}
            />
          )}
        {activeTab === "cghs-surgery-master" && (
          <>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">CGHS Surgery Master</h1>
                <Button 
                  onClick={() => setShowAddCGHSSurgery(true)}
                  className="ml-auto"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add CGHS Surgery
                </Button>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>CGHS Code</TableHead>
                      <TableHead>Package Amount</TableHead>
                      <TableHead>Complication 1</TableHead>
                      <TableHead>Complication 2</TableHead>
                      <TableHead>Complication 3</TableHead>
                      <TableHead>Complication 4</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cghsSurgeries.map((surgery, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{surgery.name}</TableCell>
                        <TableCell>{surgery.code}</TableCell>
                        <TableCell>{surgery.amount}</TableCell>
                        <TableCell>{surgery.complication1}</TableCell>
                        <TableCell>{surgery.complication2}</TableCell>
                        <TableCell>{surgery.complication3}</TableCell>
                        <TableCell>{surgery.complication4}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <Dialog open={showAddCGHSSurgery} onOpenChange={setShowAddCGHSSurgery}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New CGHS Surgery</DialogTitle>
                </DialogHeader>
                <div className="p-4 text-center text-muted-foreground">
                  <p>Surgery form functionality has been removed.</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddCGHSSurgery(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
        {activeTab === "yojna-surgery-master" && (
          <>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Yojna Surgery Master</h1>
                <Button 
                  onClick={() => setShowAddYojnaSurgery(true)}
                  className="ml-auto"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Yojna Surgery
                </Button>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Yojna Code</TableHead>
                      <TableHead>Package Amount</TableHead>
                      <TableHead>Complication 1</TableHead>
                      <TableHead>Complication 2</TableHead>
                      <TableHead>Complication 3</TableHead>
                      <TableHead>Complication 4</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yojnaSurgeries.map((surgery, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{surgery.name}</TableCell>
                        <TableCell>{surgery.code}</TableCell>
                        <TableCell>{surgery.amount}</TableCell>
                        <TableCell>{surgery.complication1}</TableCell>
                        <TableCell>{surgery.complication2}</TableCell>
                        <TableCell>{surgery.complication3}</TableCell>
                        <TableCell>{surgery.complication4}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <Dialog open={showAddYojnaSurgery} onOpenChange={setShowAddYojnaSurgery}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Yojna Surgery</DialogTitle>
                </DialogHeader>
                <div className="p-4 text-center text-muted-foreground">
                  <p>Surgery form functionality has been removed.</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddYojnaSurgery(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
        {activeTab === "private-surgery-master" && (
          <>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Private Surgery Master</h1>
                <Button 
                  onClick={() => setShowAddPrivateSurgery(true)}
                  className="ml-auto"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Private Surgery
                </Button>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Private Code</TableHead>
                      <TableHead>Package Amount</TableHead>
                      <TableHead>Complication 1</TableHead>
                      <TableHead>Complication 2</TableHead>
                      <TableHead>Complication 3</TableHead>
                      <TableHead>Complication 4</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {privateSurgeries.map((surgery, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{surgery.name}</TableCell>
                        <TableCell>{surgery.code}</TableCell>
                        <TableCell>{surgery.amount}</TableCell>
                        <TableCell>{surgery.complication1}</TableCell>
                        <TableCell>{surgery.complication2}</TableCell>
                        <TableCell>{surgery.complication3}</TableCell>
                        <TableCell>{surgery.complication4}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <Dialog open={showAddPrivateSurgery} onOpenChange={setShowAddPrivateSurgery}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Private Surgery</DialogTitle>
                </DialogHeader>
                <div className="p-4 text-center text-muted-foreground">
                  <p>Surgery form functionality has been removed.</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddPrivateSurgery(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
        {activeTab === "complications-master" && (
          <div className="p-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Complication Master</h3>
              <div className="mb-4 flex items-center gap-2">
                <label htmlFor="complications-upload" className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">Upload Excel/CSV</label>
                <input id="complications-upload" type="file" accept=".csv,.xls,.xlsx" className="hidden" />
                <button 
                  className="bg-green-500 text-white px-3 py-1 rounded ml-2" 
                  onClick={() => setShowAddComplication(true)}
                >
                  + Add More
                </button>
              </div>
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Name</th>
                  <th className="border px-2 py-1 text-left">Risk Level</th>
                  <th className="border px-2 py-1 text-left">Description</th>
                  <th className="border px-2 py-1 text-left">INV1</th>
                  <th className="border px-2 py-1 text-left">INV2</th>
                  <th className="border px-2 py-1 text-left">INV3</th>
                  <th className="border px-2 py-1 text-left">INV4</th>
                  <th className="border px-2 py-1 text-left">Med1</th>
                  <th className="border px-2 py-1 text-left">Med2</th>
                  <th className="border px-2 py-1 text-left">Med3</th>
                  <th className="border px-2 py-1 text-left">Med4</th>
                    <th className="border px-2 py-1 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complications.map((complication, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{complication.name}</td>
                      <td className="border px-2 py-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          complication.riskLevel === "High" ? "bg-red-100 text-red-800" :
                          complication.riskLevel === "Medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {complication.riskLevel}
                        </span>
                      </td>
                      <td className="border px-2 py-1">{complication.description}</td>
                      <td className="border px-2 py-1">{complication.inv1}</td>
                      <td className="border px-2 py-1">{complication.inv2}</td>
                      <td className="border px-2 py-1">{complication.inv3}</td>
                      <td className="border px-2 py-1">{complication.inv4}</td>
                      <td className="border px-2 py-1">{complication.med1}</td>
                      <td className="border px-2 py-1">{complication.med2}</td>
                      <td className="border px-2 py-1">{complication.med3}</td>
                      <td className="border px-2 py-1">{complication.med4}</td>
                      <td className="border px-2 py-1 flex gap-2">
                        <button title="View">👁️</button>
                        <button title="Edit">✏️</button>
                        <button title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showAddComplication && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                  <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full">
                    <h3 className="text-lg font-medium mb-4">Add Complication</h3>
                    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      e.preventDefault();
                      const formEl = e.currentTarget;
                      const nameEl = formEl.elements.namedItem('name') as HTMLInputElement;
                      const riskLevelEl = formEl.elements.namedItem('riskLevel') as HTMLSelectElement;
                      const descriptionEl = formEl.elements.namedItem('description') as HTMLTextAreaElement;
                      const inv1El = formEl.elements.namedItem('inv1') as HTMLInputElement;
                      const inv2El = formEl.elements.namedItem('inv2') as HTMLInputElement;
                      const inv3El = formEl.elements.namedItem('inv3') as HTMLInputElement;
                      const inv4El = formEl.elements.namedItem('inv4') as HTMLInputElement;
                      const med1El = formEl.elements.namedItem('med1') as HTMLInputElement;
                      const med2El = formEl.elements.namedItem('med2') as HTMLInputElement;
                      const med3El = formEl.elements.namedItem('med3') as HTMLInputElement;
                      const med4El = formEl.elements.namedItem('med4') as HTMLInputElement;
                      
                      setComplications([...complications, { 
                        name: nameEl.value, 
                        riskLevel: riskLevelEl.value, 
                        description: descriptionEl.value, 
                        inv1: inv1El.value, 
                        inv2: inv2El.value, 
                        inv3: inv3El.value, 
                        inv4: inv4El.value, 
                        med1: med1El.value, 
                        med2: med2El.value, 
                        med3: med3El.value, 
                        med4: med4El.value 
                      }]);
                      setShowAddComplication(false);
                      window.alert("Complication Added Successfully!");
                    }}>
                      <div className="mb-2">
                        <label className="block mb-1">Name</label>
                        <input name="name" className="border rounded px-2 py-1 w-full" required />
                      </div>
                      <div className="mb-2">
                        <label className="block mb-1">Risk Level</label>
                        <select name="riskLevel" className="border rounded px-2 py-1 w-full" required>
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1">Description</label>
                        <textarea name="description" className="border rounded px-2 py-1 w-full" rows={3} required></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block mb-1">INV1</label>
                          <input name="inv1" className="border rounded px-2 py-1 w-full" />
                        </div>
                        <div>
                          <label className="block mb-1">INV2</label>
                          <input name="inv2" className="border rounded px-2 py-1 w-full" />
                        </div>
                        <div>
                          <label className="block mb-1">INV3</label>
                          <input name="inv3" className="border rounded px-2 py-1 w-full" />
                        </div>
                        <div>
                          <label className="block mb-1">INV4</label>
                          <input name="inv4" className="border rounded px-2 py-1 w-full" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <label className="block mb-1">Med1</label>
                          <input name="med1" className="border rounded px-2 py-1 w-full" />
                        </div>
                        <div>
                          <label className="block mb-1">Med2</label>
                          <input name="med2" className="border rounded px-2 py-1 w-full" />
                        </div>
                        <div>
                          <label className="block mb-1">Med3</label>
                          <input name="med3" className="border rounded px-2 py-1 w-full" />
                        </div>
                        <div>
                          <label className="block mb-1">Med4</label>
                          <input name="med4" className="border rounded px-2 py-1 w-full" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" className="px-3 py-1 rounded border" onClick={() => setShowAddComplication(false)}>Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
            </div>
          )}
          {activeTab === "radiology-master" && (
          <div className="p-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Radiology Master</h3>
              <div className="mb-4 flex items-center gap-2">
                <label htmlFor="radiology-upload" className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">Upload Excel/CSV</label>
                <input id="radiology-upload" type="file" accept=".csv,.xls,.xlsx" className="hidden" />
                <button className="bg-green-500 text-white px-3 py-1 rounded ml-2" onClick={() => setShowAddRadiology(true)}>+ Add More</button>
              </div>
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Name</th>
                    <th className="border px-2 py-1 text-left">Cost</th>
                    <th className="border px-2 py-1 text-left">CGHS Code</th>
                    <th className="border px-2 py-1 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {radiology.map((test, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{test.name}</td>
                      <td className="border px-2 py-1">{test.cost}</td>
                      <td className="border px-2 py-1">{test.code}</td>
                      <td className="border px-2 py-1 flex gap-2">
                        <button title="View">👁️</button>
                        <button title="Edit">✏️</button>
                        <button title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showAddRadiology && (
                <AddRadiologyForm
                  onCancel={() => setShowAddRadiology(false)}
                  onSubmit={data => {
                    setRadiology([...radiology, data]);
                    setShowAddRadiology(false);
                    window.alert("Radiology Test Added Successfully!");
                  }}
                />
              )}
            </div>
            </div>
          )}
          {activeTab === "lab-master" && (
          <div className="p-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Lab Master</h3>
              <div className="mb-4 flex items-center gap-2">
                <label htmlFor="lab-upload" className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">Upload Excel/CSV</label>
                <input id="lab-upload" type="file" accept=".csv,.xls,.xlsx" className="hidden" />
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded ml-2"
                  onClick={() => setShowAddLab(true)}
                >
                  + Add More
                </button>
              </div>
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Name</th>
                    <th className="border px-2 py-1 text-left">Cost</th>
                    <th className="border px-2 py-1 text-left">CGHS Code</th>
                    <th className="border px-2 py-1 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lab.map((test, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{test.name}</td>
                      <td className="border px-2 py-1">{test.cost}</td>
                      <td className="border px-2 py-1">{test.code}</td>
                      <td className="border px-2 py-1 flex gap-2">
                        <button title="View">👁️</button>
                        <button title="Edit">✏️</button>
                        <button title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showAddLab && (
                <AddLabForm
                  onCancel={() => setShowAddLab(false)}
                  onSubmit={data => {
                    setLab([...lab, data]);
                    setShowAddLab(false);
                    window.alert("Lab Test Added Successfully!");
                  }}
                />
              )}
            </div>
            </div>
          )}
          {activeTab === "other-investigations-master" && (
          <div className="p-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Other Investigations Master</h3>
              <div className="mb-4 flex items-center gap-2">
                <label htmlFor="other-investigations-upload" className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">Upload Excel/CSV</label>
                <input id="other-investigations-upload" type="file" accept=".csv,.xls,.xlsx" className="hidden" />
                <button className="bg-green-500 text-white px-3 py-1 rounded ml-2" onClick={() => setShowAddOtherInvestigation(true)}>+ Add More</button>
              </div>
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Name</th>
                    <th className="border px-2 py-1 text-left">Cost</th>
                    <th className="border px-2 py-1 text-left">CGHS Code</th>
                    <th className="border px-2 py-1 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {otherInvestigations.map((test, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{test.name}</td>
                      <td className="border px-2 py-1">{test.cost}</td>
                      <td className="border px-2 py-1">{test.code}</td>
                      <td className="border px-2 py-1 flex gap-2">
                        <button title="View">👁️</button>
                        <button title="Edit">✏️</button>
                        <button title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showAddOtherInvestigation && (
                <AddOtherInvestigationForm
                  onCancel={() => setShowAddOtherInvestigation(false)}
                  onSubmit={data => {
                    setOtherInvestigations([...otherInvestigations, data]);
                    setShowAddOtherInvestigation(false);
                    window.alert("Other Investigation Added Successfully!");
                  }}
                />
              )}
            </div>
            </div>
          )}
          {activeTab === "medications-master" && (
          <div className="p-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Medications Master</h3>
              <div className="mb-4 flex items-center gap-2">
                <label htmlFor="medications-upload" className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">Upload Excel/CSV</label>
                <input id="medications-upload" type="file" accept=".csv,.xls,.xlsx" className="hidden" />
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded ml-2"
                  onClick={() => setShowAddMedication(true)}
                >
                  + Add More
                </button>
              </div>
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Name</th>
                    <th className="border px-2 py-1 text-left">Type</th>
                    <th className="border px-2 py-1 text-left">Cost</th>
                    <th className="border px-2 py-1 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{med.name}</td>
                      <td className="border px-2 py-1">{med.type}</td>
                      <td className="border px-2 py-1">{med.cost}</td>
                      <td className="border px-2 py-1 flex gap-2">
                        <button title="View">👁️</button>
                        <button title="Edit">✏️</button>
                        <button title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showAddMedication && (
                <AddMedicationForm
                  onCancel={() => setShowAddMedication(false)}
                  onSubmit={data => {
                    setMedications([...medications, data]);
                    setShowAddMedication(false);
                    window.alert("Medication Added Successfully!");
                  }}
                />
              )}
            </div>
            </div>
          )}
        {activeTab === "approvals" && <Approvals />}
          {activeTab === "reports" && <ReportsAnalytics />}
          {activeTab === "medical-staff-master" && (
          <div className="p-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Medical Staff Master</h3>
              <div className="mb-4 flex items-center gap-2">
                <label htmlFor="medical-staff-upload" className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">Upload Excel/CSV</label>
                <input id="medical-staff-upload" type="file" accept=".csv,.xls,.xlsx" className="hidden" />
              </div>
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Name</th>
                    <th className="border px-2 py-1 text-left">Cost</th>
                    <th className="border px-2 py-1 text-left">CGHS Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border px-2 py-1">Nurse Anjali</td><td className="border px-2 py-1">₹500</td><td className="border px-2 py-1">MS001</td></tr>
                  <tr><td className="border px-2 py-1">Technician Ravi</td><td className="border px-2 py-1">₹600</td><td className="border px-2 py-1">MS002</td></tr>
                  <tr><td className="border px-2 py-1">Ward Boy Suresh</td><td className="border px-2 py-1">₹400</td><td className="border px-2 py-1">MS003</td></tr>
                  <tr><td className="border px-2 py-1">Receptionist Meena</td><td className="border px-2 py-1">₹450</td><td className="border px-2 py-1">MS004</td></tr>
                  <tr><td className="border px-2 py-1">Pharmacist Ritu</td><td className="border px-2 py-1">₹550</td><td className="border px-2 py-1">MS005</td></tr>
                </tbody>
              </table>
            </div>
            </div>
          )}
          {activeTab === "user-list" && (
            <>
              <UserList users={users} onAddUser={() => setShowAddUser(true)} />
              {showAddUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                  <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full">
                    <h3 className="text-lg font-medium mb-4">Add User</h3>
                    <UserAddForm
                      onCancel={() => setShowAddUser(false)}
                      onSubmit={data => {
                        setUsers([...users, {
                          name: `${data.firstName} ${data.lastName}`.trim(),
                          email: data.email,
                          role: data.role.charAt(0).toUpperCase() + data.role.slice(1)
                        }]);
                        window.alert("User Added Successfully!");
                        setShowAddUser(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          {activeTab === "doctor-master" && (
          <div className="p-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Doctor Master</h3>
              <div className="mb-4 flex items-center gap-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => setShowAddDoctor(true)}>+ Add Doctor</button>
              </div>
              <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Name</th>
                    <th className="border px-2 py-1 text-left">Degree</th>
                    <th className="border px-2 py-1 text-left">Specialization</th>
                      <th className="border px-2 py-1 text-left">Referring Doctor</th>
                      <th className="border px-2 py-1 text-left">Anaesthetist</th>
                      <th className="border px-2 py-1 text-left">Surgeon</th>
                      <th className="border px-2 py-1 text-left">Radiologist</th>
                      <th className="border px-2 py-1 text-left">Pathologist</th>
                      <th className="border px-2 py-1 text-left">Physician</th>
                      <th className="border px-2 py-1 text-left">Other Speciality</th>
                    <th className="border px-2 py-1 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{doc.name}</td>
                      <td className="border px-2 py-1">{doc.degree}</td>
                      <td className="border px-2 py-1">{doc.specialization}</td>
                        <td className="border px-2 py-1">{doc.isReferring ? "Yes" : "No"}</td>
                        <td className="border px-2 py-1">{doc.isAnaesthetist ? "Yes" : "No"}</td>
                        <td className="border px-2 py-1">{doc.isSurgeon ? "Yes" : "No"}</td>
                        <td className="border px-2 py-1">{doc.isRadiologist ? "Yes" : "No"}</td>
                        <td className="border px-2 py-1">{doc.isPathologist ? "Yes" : "No"}</td>
                        <td className="border px-2 py-1">{doc.isPhysician ? "Yes" : "No"}</td>
                        <td className="border px-2 py-1">{doc.otherSpeciality}</td>
                      <td className="border px-2 py-1 flex gap-2">
                        <button title="View">👁️</button>
                        <button title="Edit">✏️</button>
                        <button title="Delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              {showAddDoctor && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                  <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full">
                    <h3 className="text-lg font-medium mb-4">Add Doctor</h3>
                    <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      e.preventDefault();
                      const formEl = e.currentTarget;
                      const nameEl = formEl.elements.namedItem('name') as HTMLInputElement;
                      const degreeEl = formEl.elements.namedItem('degree') as HTMLInputElement;
                      const specializationEl = formEl.elements.namedItem('specialization') as HTMLInputElement;
                      const isReferringEl = formEl.elements.namedItem('isReferring') as HTMLInputElement;
                      const isAnaesthetistEl = formEl.elements.namedItem('isAnaesthetist') as HTMLInputElement;
                      const isSurgeonEl = formEl.elements.namedItem('isSurgeon') as HTMLInputElement;
                      const isRadiologistEl = formEl.elements.namedItem('isRadiologist') as HTMLInputElement;
                      const isPathologistEl = formEl.elements.namedItem('isPathologist') as HTMLInputElement;
                      const isPhysicianEl = formEl.elements.namedItem('isPhysician') as HTMLInputElement;
                      const otherSpecialityEl = formEl.elements.namedItem('otherSpeciality') as HTMLInputElement;
                      
                      setDoctors([...doctors, { 
                        name: nameEl.value, 
                        degree: degreeEl.value, 
                        specialization: specializationEl.value,
                        isReferring: isReferringEl.checked,
                        isAnaesthetist: isAnaesthetistEl.checked,
                        isSurgeon: isSurgeonEl.checked,
                        isRadiologist: isRadiologistEl.checked,
                        isPathologist: isPathologistEl.checked,
                        isPhysician: isPhysicianEl.checked,
                        otherSpeciality: otherSpecialityEl.value
                      }]);
                      setShowAddDoctor(false);
                      window.alert("Doctor Added Successfully!");
                    }}>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                        <label className="block mb-1">Name</label>
                        <input name="name" className="border rounded px-2 py-1 w-full" required />
                      </div>
                        <div>
                        <label className="block mb-1">Degree</label>
                        <input name="degree" className="border rounded px-2 py-1 w-full" required />
                      </div>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1">Specialization</label>
                        <input name="specialization" className="border rounded px-2 py-1 w-full" required />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-2 font-medium">Doctor Type</label>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center">
                            <input type="checkbox" name="isReferring" id="isReferring" className="mr-2" />
                            <label htmlFor="isReferring">Referring Doctor</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" name="isAnaesthetist" id="isAnaesthetist" className="mr-2" />
                            <label htmlFor="isAnaesthetist">Anaesthetist</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" name="isSurgeon" id="isSurgeon" className="mr-2" />
                            <label htmlFor="isSurgeon">Surgeon</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" name="isRadiologist" id="isRadiologist" className="mr-2" />
                            <label htmlFor="isRadiologist">Radiologist</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" name="isPathologist" id="isPathologist" className="mr-2" />
                            <label htmlFor="isPathologist">Pathologist</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" name="isPhysician" id="isPhysician" className="mr-2" />
                            <label htmlFor="isPhysician">Physician</label>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1">Other Speciality (if any)</label>
                        <input name="otherSpeciality" className="border rounded px-2 py-1 w-full" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" className="px-3 py-1 rounded border" onClick={() => setShowAddDoctor(false)}>Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Add Doctor</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
            </div>
          )}
        </main>
    </div>
  )
}
