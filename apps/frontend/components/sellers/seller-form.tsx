"use client";

import { Seller } from "@/types/Seller";

interface SellerFormProps {
  seller: Seller;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function SellerForm({
  seller,
  onChange,
}: SellerFormProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div>
        <label className="mb-1 block font-medium">
          Seller Name
        </label>

        <input
          name="sellerName"
          value={seller.sellerName}
          onChange={onChange}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Company Name
        </label>

        <input
          name="companyName"
          value={seller.companyName}
          onChange={onChange}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={seller.email}
          onChange={onChange}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Phone
        </label>

        <input
          name="phone"
          value={seller.phone}
          onChange={onChange}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block font-medium">
          GST Number
        </label>

        <input
          name="gstNumber"
          value={seller.gstNumber}
          onChange={onChange}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block font-medium">
          Address
        </label>

        <textarea
          name="address"
          rows={4}
          value={seller.address}
          onChange={onChange}
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>
    </div>
  );
}