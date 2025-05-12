"use client"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function PatientRegistration({ onClose }: { onClose: () => void }) {
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
    corporate: "",
    registrationDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    insuranceStatus: "Active",
    referee: "",
    type: ""
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In a real application, this would save to a database
    console.log(form);
    
    toast({
      title: "Patient registered successfully",
      description: `Patient information saved`,
    });
    
    // Close the form
    onClose();
  }

  return (
    <div className="max-w-full min-w-[1200px] w-auto">
      <h3 className="text-3xl font-bold mb-1 text-blue-900">New Patient Registration</h3>
      <p className="mb-4 text-gray-500">Register a new patient in the ESIC system</p>
            
      <form onSubmit={handleSubmit}>
              {/* UID Patient Information Section */}
        <div className="border rounded-xl p-6 mb-4 bg-blue-50/40">
          <h3 className="font-semibold mb-4 text-blue-800 text-lg bg-blue-100/60 rounded px-2 py-2 shadow-sm">UID Patient Information</h3>
          <div className="grid md:grid-cols-4 gap-x-6 gap-y-3">
            <div>
              <label>Patient Name *</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                required 
                placeholder="Patient Name" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
              />
            </div>
            
                  <div>
              <label>Corporate *</label>
              <select 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition" 
                required
                value={form.corporate}
                onChange={e => setForm({ ...form, corporate: e.target.value })}
              >
                <option value="">Select Corporate</option>
                <option value="WCL">WCL</option>
                <option value="ESIC">ESIC</option>
                <option value="CGHS">CGHS</option>
                <option value="MPKAY">MPKAY</option>
                <option value="OTHER">OTHER</option>
              </select>
                  </div>
            
                  <div>
              <label>Age *</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                required 
                placeholder="Age" 
                value={form.age} 
                onChange={e => setForm({ ...form, age: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Gender *</label>
              <select 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition" 
                required 
                value={form.gender} 
                onChange={e => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
                  </div>
                  <div>
              <label>Phone *</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                required 
                placeholder="Phone Number" 
                value={form.phone} 
                onChange={e => setForm({ ...form, phone: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Address *</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                required 
                placeholder="Address" 
                value={form.address} 
                onChange={e => setForm({ ...form, address: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Emergency Contact Name *</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                required 
                placeholder="Emergency Contact Name" 
                value={form.emergencyContactName} 
                onChange={e => setForm({ ...form, emergencyContactName: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Emergency Contact Mobile *</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                required 
                placeholder="Mobile Number" 
                value={form.emergencyContactMobile} 
                onChange={e => setForm({ ...form, emergencyContactMobile: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Second Emergency Contact Name</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Second Emergency Contact Name" 
                value={form.secondEmergencyContactName} 
                onChange={e => setForm({ ...form, secondEmergencyContactName: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Second Emergency Contact Mobile</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Mobile Number" 
                value={form.secondEmergencyContactMobile} 
                onChange={e => setForm({ ...form, secondEmergencyContactMobile: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Date of Birth</label>
              <input 
                type="date" 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition" 
                value={form.dob} 
                onChange={e => setForm({ ...form, dob: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Patient's Photo</label>
              <input 
                type="file" 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition" 
                onChange={e => setForm({ ...form, photo: e.target.files?.[0] || null })} 
              />
                  </div>
                  <div>
              <label>Aadhar/Passport</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Aadhar/Passport" 
                value={form.passport} 
                onChange={e => setForm({ ...form, passport: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Quarter/Plot No.</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Quarter/Plot No." 
                value={form.quarter} 
                onChange={e => setForm({ ...form, quarter: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Ward</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Ward" 
                value={form.ward} 
                onChange={e => setForm({ ...form, ward: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Panchayat</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Panchayat" 
                value={form.panchayat} 
                onChange={e => setForm({ ...form, panchayat: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Relationship Manager</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Relationship Manager" 
                value={form.relationshipManager} 
                onChange={e => setForm({ ...form, relationshipManager: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Pin Code</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Pin Code" 
                value={form.pin} 
                onChange={e => setForm({ ...form, pin: e.target.value })} 
              />
                  </div>
                  <div>
              <label>State</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="State" 
                value={form.state} 
                onChange={e => setForm({ ...form, state: e.target.value })} 
              />
                  </div>
                  <div>
              <label>City/Town</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="City/Town" 
                value={form.city} 
                onChange={e => setForm({ ...form, city: e.target.value })} 
              />
                  </div>
                </div>
              </div>

              {/* Other Information Section */}
        <div className="border rounded-xl p-6 mb-4 bg-blue-50/40">
          <h3 className="font-semibold mb-4 text-blue-800 text-lg bg-blue-100/60 rounded px-2 py-2 shadow-sm">Other Information</h3>
          <div className="grid md:grid-cols-4 gap-x-6 gap-y-3">
                  <div>
              <label>Blood Group</label>
              <select 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition" 
                value={form.bloodGroup} 
                onChange={e => setForm({ ...form, bloodGroup: e.target.value })}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
                  </div>
                  <div>
              <label>Spouse Name</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Spouse Name" 
                value={form.spouse} 
                onChange={e => setForm({ ...form, spouse: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Allergies</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Allergies" 
                value={form.allergies} 
                onChange={e => setForm({ ...form, allergies: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Relative Phone No.</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Relative Phone No." 
                value={form.relativePhone} 
                onChange={e => setForm({ ...form, relativePhone: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Instructions</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Instructions" 
                value={form.instructions} 
                onChange={e => setForm({ ...form, instructions: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Identity Type</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Identity Type" 
                value={form.identityType} 
                onChange={e => setForm({ ...form, identityType: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Email</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Email" 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Privilege Card Number</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Privilege Card Number" 
                value={form.privilegeCard} 
                onChange={e => setForm({ ...form, privilegeCard: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Billing Link</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Billing Link" 
                value={form.billingLink} 
                onChange={e => setForm({ ...form, billingLink: e.target.value })} 
              />
                  </div>
                  <div>
              <label>Referral Letter</label>
              <input 
                type="file" 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition" 
                onChange={e => setForm({ ...form, referralLetter: e.target.files?.[0] || null })} 
              />
                  </div>
                </div>
              </div>

        <div className="mt-4">
          <label className="font-semibold mb-1 block">Type</label>
          <select 
            className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition" 
            value={form.type || ""} 
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Please Select</option>
            <option value="OPD">OPD</option>
            <option value="IPD">IPD</option>
            <option value="RADIOLOGY">RADIOLOGY</option>
            <option value="EMERGENCY">EMERGENCY</option>
            <option value="LABORATORY">LABORATORY</option>
            <option value="PROSPECT">PROSPECT</option>
          </select>
        </div>
        
        <div className="flex justify-end gap-4 mt-4">
          <button 
            type="button" 
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-semibold transition" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-bold shadow transition"
          >
            Save And Next
          </button>
              </div>
            </form>
    </div>
  );
} 