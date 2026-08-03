"use client";

import { useEffect, useState } from "react";
import CarrierForm from "./carrier-form";
import { Carrier } from "@/types/carrier";

interface CarrierModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (carrier: Carrier) => void;
}

const initialCarrier: Carrier = {
  id: "",
  name: "",
  isActive: true,
};

export default function CarrierModal({
  open,
  onClose,
  onSave,
}: CarrierModalProps) {
  const [formData, setFormData] =
    useState<Carrier>(initialCarrier);

  useEffect(() => {
    if (open) {
      setFormData(initialCarrier);
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
      alert("Carrier name is required.");
      return;
    }

    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Add Carrier
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the carrier details below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-3xl text-gray-400 hover:text-red-500"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <CarrierForm
            carrier={formData}
            onChange={handleChange}
          />
        </div>

        {/* Footer */}
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
            Save Carrier
          </button>
        </div>
      </div>
    </div>
  );
}