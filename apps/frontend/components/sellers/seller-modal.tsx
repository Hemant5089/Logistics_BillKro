"use client";

import { useEffect, useState } from "react";
import SellerForm from "./seller-form";
import { Seller } from "@/types/seller";

interface SellerModalProps {
  open: boolean;
  seller: Seller | null;
  onClose: () => void;
  onSave: (seller: Seller) => void;
}

const initialSeller: Seller = {
  id: "",
  sellerName: "",
  companyName: "",
  email: "",
  phone: "",
  gstNumber: "",
  address: "",
};

export default function SellerModal({
  open,
  seller,
  onClose,
  onSave,
}: SellerModalProps) {
  const [formData, setFormData] = useState<Seller>(initialSeller);

  useEffect(() => {
    if (seller) {
      setFormData(seller);
    } else {
      setFormData(initialSeller);
    }
  }, [seller, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (
      !formData.sellerName.trim() ||
      !formData.companyName.trim() ||
      !formData.email.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {seller ? "Edit Seller" : "Add Seller"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Fill in the seller details below.
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
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <SellerForm
            seller={formData}
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
            {seller ? "Update Seller" : "Save Seller"}
          </button>
        </div>
      </div>
    </div>
  );
}