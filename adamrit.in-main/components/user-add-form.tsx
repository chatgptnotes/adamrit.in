import React, { useState } from "react";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export default function UserAddForm({ onCancel, onSubmit }: { onCancel?: () => void, onSubmit?: (data: any) => void }) {
  const [form, setForm] = useState({
    clinicLocation: "",
    role: "",
    username: "",
    newPassword: "",
    confirmPassword: "",
    email: "",
    initial: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    nameType: "",
    gender: "",
    dob: "",
    designation: "",
    payment: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded shadow max-w-4xl mx-auto">
      <div>
        <Label>Clinic Location <span className="text-red-500">*</span></Label>
        <select name="clinicLocation" value={form.clinicLocation} onChange={handleChange} required className="w-full border rounded px-2 py-1">
          <option value="">Please Select</option>
          <option value="location1">Location 1</option>
          <option value="location2">Location 2</option>
        </select>
      </div>
      <div>
        <Label>Role <span className="text-red-500">*</span></Label>
        <select name="role" value={form.role} onChange={handleChange} required className="w-full border rounded px-2 py-1">
          <option value="">Select Role</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <Label>Username <span className="text-red-500">*</span></Label>
        <Input name="username" value={form.username} onChange={handleChange} required placeholder="Enter username" />
      </div>
      <div>
        <Label>New Password</Label>
        <Input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} placeholder="Enter new password" />
      </div>
      <div>
        <Label>Confirm Password</Label>
        <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
      </div>
      <div>
        <Label>Email</Label>
        <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter email" />
      </div>
      <div>
        <Label>Initial</Label>
        <select name="initial" value={form.initial} onChange={handleChange} className="w-full border rounded px-2 py-1">
          <option value="">Select Prefix</option>
          <option value="mr">Mr.</option>
          <option value="ms">Ms.</option>
          <option value="dr">Dr.</option>
        </select>
      </div>
      <div>
        <Label>First Name <span className="text-red-500">*</span></Label>
        <Input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="First Name" />
      </div>
      <div>
        <Label>Middle Name</Label>
        <Input name="middleName" value={form.middleName} onChange={handleChange} placeholder="Middle Name" />
      </div>
      <div>
        <Label>Last Name <span className="text-red-500">*</span></Label>
        <Input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Last Name" />
      </div>
      <div>
        <Label>Suffix</Label>
        <Input name="suffix" value={form.suffix} onChange={handleChange} placeholder="Suffix" />
      </div>
      <div>
        <Label>Name Type</Label>
        <select name="nameType" value={form.nameType} onChange={handleChange} className="w-full border rounded px-2 py-1">
          <option value="">Please Select</option>
          <option value="individual">Individual</option>
          <option value="organization">Organization</option>
        </select>
      </div>
      <div>
        <Label>Gender</Label>
        <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded px-2 py-1">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <Label>Date Of Birth</Label>
        <Input name="dob" type="date" value={form.dob} onChange={handleChange} />
      </div>
      <div>
        <Label>Designation</Label>
        <select name="designation" value={form.designation} onChange={handleChange} className="w-full border rounded px-2 py-1">
          <option value="">Select Designation</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <Label>Payment</Label>
        <Input name="payment" value={form.payment} onChange={handleChange} placeholder="Payment" />
      </div>
      <div className="col-span-2 flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
} 