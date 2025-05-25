"use client"

import React, { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { X } from "lucide-react"

interface PatientRegistrationProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function PatientRegistration({ onClose, onSubmit }: PatientRegistrationProps) {
  const [form, setForm] = useState({
    // Required fields with defaults
    name: "",
    age: "",
    gender: "",
    registration_date: new Date().toISOString().split('T')[0],
    patient_id: "",
    unique_id: "",
    patient_unique_id: "",
    // Optional fields
    phone: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_mobile: "",
    second_emergency_contact_name: "",
    second_emergency_contact_mobile: "",
    dob: "",
    photo_url: null as any,
    passport: "",
    ward: "",
    panchayat: "",
    relationship_manager: "",
    quarter: "",
    pin: "",
    state: "",
    city: "",
    nationality: "Indian",
    mobile: "",
    home_phone: "",
    temp_reg: false,
    consultant_own: false,
    blood_group: "",
    spouse: "",
    allergies: "",
    relative_phone: "",
    instructions: "",
    identity_type: "",
    email: "",
    fax: "",
    privilege_card: "",
    billing_link: "",
    referral_letter_url: null as any,
    diagnosis: "",
    surgery: "",
    corporate: "",
    insurance_status: "Active",
    referee: "",
    type: "",
    insurance_person_no: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!form.name || !form.age || !form.gender || !form.registration_date) {
        toast({
          title: "Error",
          description: "Please fill in all required fields (name, age, gender)",
          variant: "destructive"
        });
        return;
      }

      // Generate unique IDs if not provided
      const year = new Date().getFullYear();
      const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
      const generatedId = `PAT-${year}-${randomNum}`;

      const formData = {
        ...form,
        patient_id: form.patient_id || generatedId,
        unique_id: form.unique_id || generatedId,
        patient_unique_id: form.patient_unique_id || generatedId,
        age: parseInt(form.age) || 0
      };

      console.log("Form submission started with data:", formData);
      await onSubmit(formData);
      console.log("Form submission completed successfully");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-full min-w-[1200px] w-auto">
      <h3 className="text-3xl font-bold mb-1 text-blue-900">Insurance Person No.</h3>
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
                onChange={e => {
                  const value = e.target.value;
                  setForm({
                    ...form,
                    corporate: value,
                    insurance_person_no: value === "ESIC" ? form.insurance_person_no : ""
                  });
                }}
              >
                <option value="">Select Corporate</option>
                <option value="WCL">WCL</option>
                <option value="ESIC">ESIC</option>
                <option value="CGHS">CGHS</option>
                <option value="MPKAY">MPKAY</option>
                <option value="Central Railway">Central Railway</option>
                <option value="ECHS">ECHS</option>
                <option value="SECR">SECR</option>
                <option value="OTHER">OTHER</option>
              </select>

              {form.corporate === 'ESIC' && (
                <div className="mt-2">
                  <label>Insurance Person No.</label>
                  <input
                    type="text"
                    placeholder="Enter ESIC Number"
                    className="border rounded px-2 py-1 w-full"
                    value={form.insurance_person_no}
                    onChange={e => setForm({ ...form, insurance_person_no: e.target.value })}
                    required
                  />
                </div>
              )}
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
                value={form.emergency_contact_name} 
                onChange={e => setForm({ ...form, emergency_contact_name: e.target.value })} 
              />
                  </div>

                  <div>
              <label>Emergency Contact Mobile *</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                required 
                placeholder="Mobile Number" 
                value={form.emergency_contact_mobile} 
                onChange={e => setForm({ ...form, emergency_contact_mobile: e.target.value })} 
              />
                  </div>

                  <div>
              <label>Second Emergency Contact Name</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Second Emergency Contact Name" 
                value={form.second_emergency_contact_name} 
                onChange={e => setForm({ ...form, second_emergency_contact_name: e.target.value })} 
              />
                  </div>

                  <div>
              <label>Second Emergency Contact Mobile</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Mobile Number" 
                value={form.second_emergency_contact_mobile} 
                onChange={e => setForm({ ...form, second_emergency_contact_mobile: e.target.value })} 
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
                onChange={e => setForm({ ...form, photo_url: e.target.files?.[0] || null })} 
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
                value={form.relationship_manager} 
                onChange={e => setForm({ ...form, relationship_manager: e.target.value })} 
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
                value={form.blood_group} 
                onChange={e => setForm({ ...form, blood_group: e.target.value })}
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
                value={form.relative_phone} 
                onChange={e => setForm({ ...form, relative_phone: e.target.value })} 
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
                value={form.identity_type} 
                onChange={e => setForm({ ...form, identity_type: e.target.value })} 
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
                value={form.privilege_card} 
                onChange={e => setForm({ ...form, privilege_card: e.target.value })} 
              />
                  </div>

                  <div>
              <label>Billing Link</label>
              <input 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 placeholder-gray-400 transition" 
                placeholder="Billing Link" 
                value={form.billing_link} 
                onChange={e => setForm({ ...form, billing_link: e.target.value })} 
              />
                  </div>

                  <div>
              <label>Referral Letter</label>
              <input 
                type="file" 
                className="border rounded-lg px-3 py-2 w-full bg-white focus:ring-2 focus:ring-blue-300 transition" 
                onChange={e => setForm({ ...form, referral_letter_url: e.target.files?.[0] || null })} 
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