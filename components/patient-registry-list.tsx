import React, { useState } from "react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { CalendarPlus, Plus, X, Search } from "lucide-react";
import { PatientRegistration } from "./patient-registration";

const mockPatients = [
  {
    id: "ESIC-2023-1001",
    name: "Rahul Sharma",
    age: 42,
    gender: "Male",
    diagnosis: "Type 2 Diabetes Mellitus",
    surgery: "Cataract Surgery",
    approvalStatus: "Approved",
    registrationDate: "15 Jan 2023",
    insuranceStatus: "Active",
    referee: "Dr. Neha Patel",
  },
  {
    id: "ESIC-2023-1002",
    name: "Amit Verma",
    age: 35,
    gender: "Male",
    diagnosis: "Hypertension",
    surgery: "Appendectomy",
    approvalStatus: "Pending",
    registrationDate: "20 Feb 2023",
    insuranceStatus: "Active",
    referee: "Dr. Vikram Singh",
  },
  {
    id: "ESIC-2023-1003",
    name: "Suman Gupta",
    age: 29,
    gender: "Female",
    diagnosis: "Coronary Artery Disease",
    surgery: "Coronary Angioplasty",
    approvalStatus: "Rejected",
    registrationDate: "10 Mar 2023",
    insuranceStatus: "Expired",
    referee: "Dr. Anjali Gupta",
  },
];

// Mock data for surgeries with CGHS codes and categories
const mockSurgeryList = [
  { name: "Arthroscopic Knee Surgery", code: "CGHS: 330025", category: "Orthopedic" },
  { name: "Hernia Repair", code: "CGHS: 180025", category: "General Surgery" },
  { name: "Appendectomy", code: "CGHS: 180010", category: "General Surgery" },
  { name: "Hemorrhoidectomy", code: "CGHS: 180040", category: "General Surgery" },
  { name: "Tonsillectomy", code: "CGHS: 210030", category: "ENT" },
  { name: "Cataract Surgery", code: "CGHS: 220010", category: "Ophthalmology" },
  { name: "Coronary Angioplasty", code: "CGHS: 310050", category: "Cardiology" },
  { name: "Hysterectomy", code: "CGHS: 250020", category: "Gynecology" },
  { name: "Cholecystectomy", code: "CGHS: 180030", category: "General Surgery" },
  { name: "Hip Replacement", code: "CGHS: 330040", category: "Orthopedic" },
];

// Mock data for diagnoses
const mockDiagnosesList = [
  { name: "Hypertension", code: "I10" },
  { name: "Type 2 Diabetes Mellitus", code: "E11" },
  { name: "Coronary Artery Disease", code: "I25.10" },
  { name: "Osteoarthritis", code: "M19" },
  { name: "Asthma", code: "J45" },
  { name: "COPD", code: "J44" },
  { name: "Gastritis", code: "K29" },
  { name: "Migraine", code: "G43" },
  { name: "Hypothyroidism", code: "E03" },
  { name: "Pneumonia", code: "J18" },
];

export function PatientRegistryList() {
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patients, setPatients] = useState(mockPatients);
  
  // States for surgery selection
  const [showSurgerySelector, setShowSurgerySelector] = useState(false);
  const [surgerySearchTerm, setSurgerySearchTerm] = useState("");
  const [selectedSurgeries, setSelectedSurgeries] = useState<any[]>([]);
  const [selectedSurgery, setSelectedSurgery] = useState<any>(null);
  const [surgeryDetails, setSurgeryDetails] = useState({
    packageAmount: "",
    category: "",
    authorized: false,
    surgeon: "",
    anaesthetist: "",
    anaesthesiaType: "",
    otNotes: ""
  });
  
  // States for diagnosis selection
  const [showDiagnosisSelector, setShowDiagnosisSelector] = useState(false);
  const [diagnosisSearchTerm, setDiagnosisSearchTerm] = useState("");
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<any[]>([]);
  
  const [visitForm, setVisitForm] = useState({
    patientId: "",
    patientName: "",
    visitDate: new Date().toISOString().split('T')[0],
    visitType: "",
    visitReason: "",
    referringDoctor: "",
    appointmentWith: ""
  });
  
  // Filter surgeries based on search term
  const filteredSurgeries = mockSurgeryList.filter(surgery => 
    surgery.name.toLowerCase().includes(surgerySearchTerm.toLowerCase()) ||
    surgery.code.toLowerCase().includes(surgerySearchTerm.toLowerCase()) ||
    surgery.category.toLowerCase().includes(surgerySearchTerm.toLowerCase())
  );
  
  // Filter diagnoses based on search term
  const filteredDiagnoses = mockDiagnosesList.filter(diagnosis => 
    diagnosis.name.toLowerCase().includes(diagnosisSearchTerm.toLowerCase()) ||
    diagnosis.code.toLowerCase().includes(diagnosisSearchTerm.toLowerCase())
  );

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactMobile: "",
    secondEmergencyContactName: "",
    secondEmergencyContactMobile: "",
    dob: "",
    photo: null as any,
    passport: "",
    ward: "",
    panchayat: "",
    relationshipManager: "",
    quarter: "",
    pin: "",
    state: "",
    city: "",
    nationality: "Indian",
    mobile: "",
    homePhone: "",
    tempReg: false,
    consultantOwn: false,
    bloodGroup: "",
    spouse: "",
    allergies: "",
    relativePhone: "",
    instructions: "",
    identityType: "",
    email: "",
    fax: "",
    privilegeCard: "",
    billingLink: "",
    referralLetter: null as any,
    diagnosis: "",
    surgery: "",
    approvalStatus: "Pending",
    registrationDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    insuranceStatus: "Active",
    referee: "",
    type: ""
  });

  // Function to add a surgery to the selection
  const addSurgery = (surgery: any) => {
    if (!selectedSurgeries.some(s => s.name === surgery.name)) {
      setSelectedSurgeries([...selectedSurgeries, surgery]);
    }
  };
  
  // Function to remove a surgery from the selection
  const removeSurgery = (surgeryName: string) => {
    setSelectedSurgeries(selectedSurgeries.filter(s => s.name !== surgeryName));
  };
  
  // Function to add a diagnosis to the selection
  const addDiagnosis = (diagnosis: any) => {
    if (!selectedDiagnoses.some(d => d.name === diagnosis.name)) {
      setSelectedDiagnoses([...selectedDiagnoses, diagnosis]);
    }
  };
  
  // Function to remove a diagnosis from the selection
  const removeDiagnosis = (diagnosisName: string) => {
    setSelectedDiagnoses(selectedDiagnoses.filter(d => d.name !== diagnosisName));
  };
  
  // Function to handle opening the visit form for a specific patient
  const handleOpenVisitForm = (patient: any) => {
    setSelectedPatient(patient);
    setVisitForm({
      ...visitForm,
      patientId: patient.id,
      patientName: patient.name,
    });
    setSelectedSurgeries([]);
    setSelectedDiagnoses([]);
    setShowVisitForm(true);
  };
  
  // Function to handle opening the surgery edit form
  const handleSurgerySelect = (surgery: any) => {
    setSelectedSurgery(surgery);
    setSurgeryDetails({
      packageAmount: "",
      category: surgery.category,
      authorized: false,
      surgeon: "",
      anaesthetist: "",
      anaesthesiaType: "",
      otNotes: ""
    });
  };
  
  // Function to save the surgery with details to the selected surgeries
  const saveSurgeryWithDetails = () => {
    if (!selectedSurgery) return;
    
    const completeSurgery = {
      ...selectedSurgery,
      packageAmount: surgeryDetails.packageAmount,
      category: surgeryDetails.category,
      authorized: surgeryDetails.authorized,
      surgeon: surgeryDetails.surgeon,
      anaesthetist: surgeryDetails.anaesthetist,
      anaesthesiaType: surgeryDetails.anaesthesiaType,
      otNotes: surgeryDetails.otNotes
    };
    
    addSurgery(completeSurgery);
    setSelectedSurgery(null);
    setShowSurgerySelector(false);
  };
  
  return (
    <div className="overflow-x-auto max-h-[600px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Patient Dashboard</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => setShowAddPatient(true)}>
          + New Patient Registration
        </button>
      </div>
      <table className="min-w-full text-xs border">
        <thead className="bg-blue-50">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Age/Gender</th>
            <th className="p-2 border">Primary Diagnosis</th>
            <th className="p-2 border">Surgery</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Registration</th>
            <th className="p-2 border">Insurance</th>
            <th className="p-2 border">Referee</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="p-2 border">{patient.id}</td>
              <td className="p-2 border">
                <Link href={`/patient-management/${patient.id}`} className="text-blue-600 underline hover:text-blue-800">
                  {patient.name}
                </Link>
              </td>
              <td className="p-2 border">{patient.age} / {patient.gender}</td>
              <td className="p-2 border">{patient.diagnosis}</td>
              <td className="p-2 border">{patient.surgery}</td>
              <td className="p-2 border">{patient.approvalStatus}</td>
              <td className="p-2 border">{patient.registrationDate}</td>
              <td className="p-2 border">{patient.insuranceStatus}</td>
              <td className="p-2 border">{patient.referee}</td>
              <td className="p-2 border text-center">
                <button 
                  className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
                  onClick={() => handleOpenVisitForm(patient)}
                  title="Register New Visit"
                >
                  <CalendarPlus size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Patient Registration Form */}
      {showAddPatient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 overflow-auto">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-full min-w-[1200px] w-auto border border-blue-100" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <PatientRegistration onClose={() => setShowAddPatient(false)} />
          </div>
        </div>
      )}

      {/* Visit Registration Form Popup */}
      {showVisitForm && selectedPatient && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 overflow-auto">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-full w-[800px] border border-blue-100" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="text-2xl font-bold mb-1 text-blue-900">Register New Visit</h3>
            <p className="mb-4 text-gray-500">Patient: {selectedPatient.name} ({selectedPatient.id})</p>
            
            <form onSubmit={e => {
              e.preventDefault();
              // Logic to save the visit data
              setShowVisitForm(false);
              toast({
                title: "Visit Registered Successfully!",
                description: `A new visit has been registered for ${selectedPatient.name}`
              });
            }}>
              <div className="border rounded-xl p-6 mb-4 bg-blue-50/40">
                <h3 className="font-semibold mb-4 text-blue-800 text-lg bg-blue-100/60 rounded px-2 py-2 shadow-sm">Visit Details</h3>
                
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <label className="block mb-1">Visit Date *</label>
                    <input 
                      type="date" 
                      className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition" 
                      required 
                      value={visitForm.visitDate}
                      onChange={e => setVisitForm({ ...visitForm, visitDate: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Visit Type *</label>
                    <select 
                      className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition"
                      required
                      value={visitForm.visitType}
                      onChange={e => setVisitForm({ ...visitForm, visitType: e.target.value })}
                    >
                      <option value="">Select Visit Type</option>
                      <option value="Regular Checkup">Regular Checkup</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Specialist Consultation">Specialist Consultation</option>
                      <option value="Procedure">Procedure</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1">Appointment With *</label>
                    <select 
                      className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition"
                      required
                      value={visitForm.appointmentWith}
                      onChange={e => setVisitForm({ ...visitForm, appointmentWith: e.target.value })}
                    >
                      <option value="">Select Doctor</option>
                      <option value="Dr. Neha Patel">Dr. Neha Patel</option>
                      <option value="Dr. Vikram Singh">Dr. Vikram Singh</option>
                      <option value="Dr. Anjali Gupta">Dr. Anjali Gupta</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1">Reason for Visit *</label>
                    <input 
                      className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition" 
                      required 
                      placeholder="Reason for visit"
                      value={visitForm.visitReason}
                      onChange={e => setVisitForm({ ...visitForm, visitReason: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-xl p-6 mb-4 bg-blue-50/40">
                <h3 className="font-semibold mb-4 text-blue-800 text-lg bg-blue-100/60 rounded px-2 py-2 shadow-sm">Medical Information</h3>
                
                <div className="grid md:grid-cols-1 gap-x-6 gap-y-6">
                  {/* Diagnosis Selection */}
                  <div>
                    <label className="block mb-1 font-medium">Diagnosis *</label>
                    {/* Display selected diagnoses */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedDiagnoses.map((diagnosis) => (
                        <div 
                          key={diagnosis.name} 
                          className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md"
                        >
                          <span>{diagnosis.name}</span>
                          <button 
                            type="button"
                            onClick={() => removeDiagnosis(diagnosis.name)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X size={16} />
                          </button>
                  </div>
                      ))}
                  </div>
                    
                    <div className="relative">
                      <button
                        type="button"
                        className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition flex items-center justify-between"
                        onClick={() => setShowDiagnosisSelector(true)}
                      >
                        <span className="text-gray-500">Search for a diagnosis...</span>
                        <Search size={18} className="text-gray-400" />
                      </button>
                  </div>
                  </div>
                  
                  {/* Surgery Selection */}
                  <div>
                    <label className="block mb-1 font-medium">Surgery (if applicable)</label>
                    {/* Display selected surgeries */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedSurgeries.map((surgery) => (
                        <div 
                          key={surgery.name} 
                          className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md"
                        >
                          <span>{surgery.name}</span>
                          <button 
                            type="button"
                            onClick={() => removeSurgery(surgery.name)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <X size={16} />
                          </button>
                  </div>
                      ))}
                  </div>
                    
                    <div className="relative">
                      <button
                        type="button"
                        className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition flex items-center justify-between"
                        onClick={() => setShowSurgerySelector(true)}
                      >
                        <span className="text-gray-500">Search for a surgery...</span>
                        <Search size={18} className="text-gray-400" />
                      </button>
                  </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1">Referring Doctor</label>
                    <select 
                      className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition"
                      value={visitForm.referringDoctor}
                      onChange={e => setVisitForm({ ...visitForm, referringDoctor: e.target.value })}
                    >
                      <option value="">Select Referring Doctor</option>
                      <option value="Dr. Neha Patel">Dr. Neha Patel</option>
                      <option value="Dr. Vikram Singh">Dr. Vikram Singh</option>
                      <option value="Dr. Anjali Gupta">Dr. Anjali Gupta</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-4">
                <button 
                  type="button" 
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-semibold transition" 
                  onClick={() => setShowVisitForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-bold shadow transition"
                >
                  Register Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Surgery Selection Modal */}
      {showSurgerySelector && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
          <div className="bg-white p-6 rounded-lg w-[800px] max-h-[90vh] relative">
            {/* Close button */}
            <button 
              onClick={() => setShowSurgerySelector(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-2">Add Surgery</h2>
            <p className="text-gray-600 mb-6">Search for a surgery to add to this patient's record.</p>
            
            {/* Search input */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                className="w-full py-3 px-10 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by surgery name, CGHS code, or category..."
                value={surgerySearchTerm}
                onChange={(e) => setSurgerySearchTerm(e.target.value)}
              />
            </div>
            
            {/* Results list */}
            <div className="border rounded-lg overflow-hidden">
              {filteredSurgeries.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredSurgeries.map((surgery) => (
                    <div
                      key={surgery.code}
                      className="p-4 flex justify-between items-center"
                    >
                      <div>
                        <div className="text-lg font-semibold">{surgery.name}</div>
                        <div className="flex items-center mt-1 gap-2">
                          <span className="text-blue-600">{surgery.code}</span>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">{surgery.category}</span>
                        </div>
                      </div>
                      <button 
                        className="flex items-center gap-1 px-4 py-1 text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={() => {
                          addSurgery(surgery);
                          setShowSurgerySelector(false);
                        }}
                      >
                        <Plus size={16} />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No surgeries found matching your search.
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setShowSurgerySelector(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Diagnosis Selection Modal */}
      {showDiagnosisSelector && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Diagnosis</h2>
              <button onClick={() => setShowDiagnosisSelector(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Search for a diagnosis to add to this patient's record.</p>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                placeholder="Search by diagnosis name or code..."
                value={diagnosisSearchTerm}
                onChange={(e) => setDiagnosisSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="overflow-y-auto flex-1 border rounded-lg">
              {filteredDiagnoses.length > 0 ? (
                <div>
                  {filteredDiagnoses.map((diagnosis) => (
                    <div
                      key={diagnosis.code}
                      className="p-3 border-b hover:bg-gray-50 flex justify-between items-center cursor-pointer"
                      onClick={() => {
                        addDiagnosis(diagnosis);
                        setShowDiagnosisSelector(false);
                      }}
                    >
                      <div>
                        <div className="font-medium">{diagnosis.name}</div>
                        <div className="text-sm text-blue-600 mt-1">{diagnosis.code}</div>
                      </div>
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          addDiagnosis(diagnosis);
                          setShowDiagnosisSelector(false);
                        }}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No diagnoses found matching your search.</div>
              )}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDiagnosisSelector(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 