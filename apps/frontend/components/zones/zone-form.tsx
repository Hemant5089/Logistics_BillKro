"use client";

import { Zone } from "@/types/zone";

interface ZoneFormProps {
  zone: Zone;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export default function ZoneForm({
  zone,
  onChange,
}: ZoneFormProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        Zone Name *
      </label>

      <input
        name="name"
        value={zone.name}
        onChange={onChange}
        placeholder="Enter zone name"
        className="w-full rounded-lg border px-3 py-2"
      />
    </div>
  );
}