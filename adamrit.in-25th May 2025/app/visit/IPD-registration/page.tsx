"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"

export default function RegisterNewIPDVisit() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get patient details from URL parameters
  const patientId = searchParams.get("patientId") || ""
  const patientName = searchParams.get("name") || ""
  
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split("T")[0],
    visitType: "IPD", // Default to IPD
    appointmentWith: "",
    reasonForVisit: "",
    diagnosis: "",
    surgery: "",
    referringDoctor: ""
  })
  
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real application, you would save this data to your database
    console.log("Submitting IPD visit form:", formData)
    
    // Redirect to patient dashboard
    router.push("/?tab=today-ipd-dashboard")
  }
  
  return (
    <div className="container max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">Register New IPD Visit</h1>
      <p className="text-gray-600 mb-6">Patient: {patientName} ({patientId})</p>
      
      <form onSubmit={handleSubmit}>
        {/* Visit Details Section */}
        <div className="mb-8">
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <h2 className="text-xl text-blue-700 font-bold">Visit Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">
                Visit Date <span className="text-red-500">*</span>
              </label>
              <Input 
                type="date"
                value={formData.visitDate}
                onChange={(e) => handleChange("visitDate", e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Visit Type <span className="text-red-500">*</span>
              </label>
              <Input 
                value="IPD"
                disabled
                className="w-full bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Appointment With <span className="text-red-500">*</span>
              </label>
              <Select 
                onValueChange={(value) => handleChange("appointmentWith", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Doctor" />
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
              <label className="block mb-2 font-medium">
                Reason for Visit <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="Reason for visit"
                value={formData.reasonForVisit}
                onChange={(e) => handleChange("reasonForVisit", e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
        {/* Medical Information Section */}
        <div className="mb-8">
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <h2 className="text-xl text-blue-700 font-bold">Medical Information</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">
                Diagnosis <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input 
                  placeholder="Search for a diagnosis..."
                  className="pr-10"
                  value={formData.diagnosis}
                  onChange={(e) => handleChange("diagnosis", e.target.value)}
                  required
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Surgery (if applicable)
              </label>
              <div className="relative">
                <Input 
                  placeholder="Search for a surgery..."
                  className="pr-10"
                  value={formData.surgery}
                  onChange={(e) => handleChange("surgery", e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">
                Referring Doctor
              </label>
              <Select onValueChange={(value) => handleChange("referringDoctor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Referring Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. A. Kumar">Dr. A. Kumar</SelectItem>
                  <SelectItem value="Dr. P. Gupta">Dr. P. Gupta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Form Controls */}
        <div className="flex justify-end space-x-4 mt-8">
          <Link href="/?tab=today-opd-dashboard">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Register IPD Visit</Button>
        </div>
      </form>
    </div>
  )
} 