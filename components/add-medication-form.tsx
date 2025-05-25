import React, { useState } from "react";

export default function AddMedicationForm({ onCancel, onSubmit }: { onCancel: () => void, onSubmit: (data: { name: string, type: string, cost: string }) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [cost, setCost] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim() && type.trim() && cost.trim()) {
      onSubmit({ name: name.trim(), type: type.trim(), cost: cost.trim() });
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
        <h3 className="text-lg font-semibold mb-4">Add Medication</h3>
        <input
          className="border rounded px-2 py-1 w-full mb-3"
          placeholder="Medication Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="border rounded px-2 py-1 w-full mb-3"
          placeholder="Type (e.g. Tablet, Syrup)"
          value={type}
          onChange={e => setType(e.target.value)}
          required
        />
        <input
          className="border rounded px-2 py-1 w-full mb-4"
          placeholder="Cost"
          value={cost}
          onChange={e => setCost(e.target.value)}
          required
        />
        <div className="flex justify-end gap-2">
          <button type="button" className="px-3 py-1 rounded border" onClick={onCancel}>Cancel</button>
          <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">Submit</button>
        </div>
      </form>
    </div>
  );
} 