"use client";

import { Search, Plus } from "lucide-react";

interface SellerSearchProps {
  onAdd: () => void;
}

export default function SellerSearch({
  onAdd,
}: SellerSearchProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search Box */}
      <div className="relative w-full md:w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search sellers..."
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
      >
        <Plus size={18} />
        Add Seller
      </button>
    </div>
  );
}