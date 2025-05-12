"use client";
import React, { use, useState } from "react";
import { notFound } from "next/navigation";
import { 
  Search, 
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Dummy data for IPD visits
const ipdVisits = {
  "IPD-2023-5001": {
    patientName: "John Smith",
    patientId: "P-10021",
    age: 45,
    gender: "Male",
    admissionDate: "2023-05-15",
    ward: "General Ward",
    bed: "B-12",
    doctor: "Dr. Sarah Johnson",
    diagnosis: "Pneumonia",
    status: "Active"
  },
  "IPD-2023-5002": {
    patientName: "Emily Brown",
    patientId: "P-10022",
    age: 32,
    gender: "Female",
    admissionDate: "2023-05-16",
    ward: "Surgical Ward",
    bed: "S-05",
    doctor: "Dr. Michael Lee",
    diagnosis: "Appendicitis",
    status: "Post-Op"
  }
};

export default function VisitPage({ params }: { params: Promise<{ visitId: string }> }) {
  const { visitId } = use(params);
  const visit = ipdVisits[visitId as keyof typeof ipdVisits];
  const [activeTab, setActiveTab] = useState("all");
  const [activeMedTab, setActiveMedTab] = useState("d1");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  if (!visit) return notFound();
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Left Sidebar - Collapsible */}
        <aside className={`border-r p-4 flex flex-col transition-all duration-300 ease-in-out relative ${sidebarCollapsed ? "w-12" : "w-64"}`}>
          {/* Toggle button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-4 h-6 w-6 rounded-full border bg-white shadow-md flex items-center justify-center z-10"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>

          {sidebarCollapsed ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="transform rotate-90 whitespace-nowrap text-xs font-bold text-gray-700 mt-20">
                Patient Details
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">Patient Details</h3>
              <p className="text-sm text-gray-600 mb-2">Diagnoses and Complications</p>
              
              <div className="flex gap-2 mb-3">
                <button 
                  className={`px-2 py-1 rounded text-xs ${activeTab === "diagnoses" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("diagnoses")}
                >
                  Diagnoses
                </button>
                <button 
                  className={`px-2 py-1 rounded text-xs ${activeTab === "surgeries" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("surgeries")}
                >
                  Surgeries
                </button>
                <button 
                  className={`px-2 py-1 rounded text-xs ${activeTab === "compl" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
                  onClick={() => setActiveTab("compl")}
                >
                  Compl.
                </button>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by diagnosis name..." 
                  className="w-full text-xs border rounded-md py-1 pl-7 pr-2"
                />
              </div>
              
              <p className="text-xs text-gray-400">No diagnoses found.</p>
            </div>
          )}
        </aside>
        
        {/* Main content with two columns */}
        <div className="flex-1 flex">
          {/* Left column - Patient info */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {/* Patient Card */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-xl font-bold mb-2">{visit.patientName}</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Patient ID</p>
                  <p>{visit.patientId}</p>
                </div>
                <div>
                  <p className="text-gray-500">Age/Gender</p>
                  <p>{visit.age} / {visit.gender}</p>
                </div>
                <div>
                  <p className="text-gray-500">Admission Date</p>
                  <p>{visit.admissionDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ward/Bed</p>
                  <p>{visit.ward} / {visit.bed}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}