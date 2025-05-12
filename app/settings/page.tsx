import React from "react";
import UserAddForm from "@/components/user-add-form";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10">
      <h1 className="text-2xl font-bold mb-6">Add User (Master List)</h1>
      <UserAddForm />
    </div>
  );
} 