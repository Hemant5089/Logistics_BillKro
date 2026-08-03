"use client";

import { useEffect, useState } from "react";

import UploadCard from "@/components/uploads/upload-card";
import { ShipmentService } from "@/services/shipment.service";
import { SellerService } from "@/services/seller.service";
import { ShipmentImportResponse } from "@/types/shipment";

interface Seller {
  id: string;
  sellerName: string;
}

export default function ShipmentsPage() {
  const [sellerId, setSellerId] = useState("");
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [result, setResult] =
    useState<ShipmentImportResponse | null>(null);

  useEffect(() => {
    loadSellers();
  }, []);

  async function loadSellers() {
    try {
      const data = await SellerService.getAll();
      setSellers(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load sellers.");
    }
  }

  async function handleUpload() {
    if (!sellerId) {
      alert("Please select a seller.");
      return;
    }

    if (!file) {
      alert("Please choose an Excel file.");
      return;
    }

    try {
      setLoading(true);

      const response =
        await ShipmentService.importShipment(
          sellerId,
          file
        );

      setResult(response);

      alert("Shipment imported successfully.");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ??
          "Shipment import failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold">
          Shipments
        </h1>

        <p className="text-gray-500">
          Import shipment Excel.
        </p>
      </div>

      {/* Seller Selection */}
      <div className="rounded-xl bg-white p-6 shadow">
        <label className="mb-2 block font-medium">
          Select Seller
        </label>

        <select
          value={sellerId}
          onChange={(e) =>
            setSellerId(e.target.value)
          }
          className="w-full rounded-lg border border-gray-300 p-3"
        >
          <option value="">
            Select Seller
          </option>

          {sellers.map((seller) => (
            <option
              key={seller.id}
              value={seller.id}
            >
              {seller.sellerName}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Card */}
      <UploadCard
        file={file}
        onFileSelect={setFile}
        onUpload={handleUpload}
        loading={loading}
      />

      {/* Import Summary */}
      {result && (
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-2xl font-semibold">
            Import Summary
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg border bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Total Rows
              </p>

              <p className="mt-2 text-3xl font-bold">
                {result.totalRows}
              </p>
            </div>

            <div className="rounded-lg border bg-green-50 p-4">
              <p className="text-sm text-gray-500">
                Created
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {result.creates}
              </p>
            </div>

            <div className="rounded-lg border bg-blue-50 p-4">
              <p className="text-sm text-gray-500">
                Updated
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {result.updates}
              </p>
            </div>

            <div className="rounded-lg border bg-red-50 p-4">
              <p className="text-sm text-gray-500">
                Errors
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {result.errors.length}
              </p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold">
                Error Details
              </h3>

              <div className="overflow-auto rounded-lg border">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">
                        #
                      </th>

                      <th className="border p-2 text-left">
                        Error
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.errors.map(
                      (error: any, index: number) => (
                        <tr key={index}>
                          <td className="border p-2">
                            {index + 1}
                          </td>

                          <td className="border p-2">
                            {JSON.stringify(error)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}