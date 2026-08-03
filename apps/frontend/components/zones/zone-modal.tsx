"use client";

import { useEffect, useState } from "react";
import ZoneForm from "./zone-form";
import { Zone } from "@/types/zone";

interface ZoneModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (zone: Zone) => void;
}

const initialZone: Zone = {
  id: "",
  name: "",
  isActive: true,
};

export default function ZoneModal({
  open,
  onClose,
  onSave,
}: ZoneModalProps) {
  const [formData, setFormData] =
    useState<Zone>(initialZone);

  useEffect(() => {
    if (open) {
      setFormData(initialZone);
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Zone name is required.");
      return;
    }

    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Add Zone
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the zone details below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-red-500"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <ZoneForm
            zone={formData}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Save Zone
          </button>
        </div>
      </div>
    </div>
  );
}