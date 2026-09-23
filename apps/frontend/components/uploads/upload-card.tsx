"use client";

import { UploadCloud } from "lucide-react";

interface UploadCardProps {
  file: File | null;
  loading?: boolean;
  onFileSelect: (file: File | null) => void;
  onUpload: () => void;
}

export default function UploadCard({
  file,
  loading = false,
  onFileSelect,
  onUpload,
}: UploadCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <UploadCloud size={22} aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Upload Shipment File</h2>
          <p className="text-sm text-gray-500">
            Choose an Excel file to import shipments.
          </p>
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block font-medium">Excel File</span>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          disabled={loading}
          onChange={(event) =>
            onFileSelect(event.target.files?.[0] ?? null)
          }
          className="w-full rounded-lg border border-gray-300 p-3 file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-white disabled:cursor-not-allowed disabled:opacity-60"
        />
      </label>

      {file && (
        <p className="mt-3 text-sm text-gray-600">
          Selected: <span className="font-medium">{file.name}</span>
        </p>
      )}

      <button
        type="button"
        onClick={onUpload}
        disabled={loading || !file}
        className="mt-5 rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Shipments"}
      </button>
    </div>
  );
}
