"use client";

import { Carrier } from "@/types/carrier";

interface CarrierFormProps {
  carrier: Carrier;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function CarrierForm({
  carrier,
  onChange,
}: CarrierFormProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        Carrier Name *
      </label>

      <input
        name="name"
        value={carrier.name}
        onChange={onChange}
        placeholder="Enter carrier name"
        className="w-full rounded-lg border px-3 py-2"
      />
    </div>
  );
}