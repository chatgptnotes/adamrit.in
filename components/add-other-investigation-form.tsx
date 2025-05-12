import React, { useState } from "react";

export default function AddOtherInvestigationForm({ onCancel, onSubmit }: { onCancel: () => void, onSubmit: (data: { name: string, cost: string, code: string }) => void }) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim() && cost.trim() && code.trim()) {
      onSubmit({ name: name.trim(), cost: cost.trim(), code: code.trim() });
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
        <h3 className="text-lg font-semibold mb-4">Add Other Investigation</h3>
        <input
          className="border rounded px-2 py-1 w-full mb-3"
          placeholder="Investigation Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="border rounded px-2 py-1 w-full mb-3"
          placeholder="Cost"
          value={cost}
          onChange={e => setCost(e.target.value)}
          required
        />
        <input
          className="border rounded px-2 py-1 w-full mb-4"
          placeholder="CGHS Code"
          value={code}
          onChange={e => setCode(e.target.value)}
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