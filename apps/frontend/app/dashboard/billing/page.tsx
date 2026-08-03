"use client";

import { useEffect, useState } from "react";

import { SellerService } from "@/services/seller.service";
import { BillingService } from "@/services/billing.service";
import { BillingPreviewResponse } from "@/types/billing";

interface Seller {
  id: string;
  sellerName: string;
}

export default function BillingPage() {
  const [sellerId, setSellerId] = useState("");
  const [billingMonth, setBillingMonth] = useState("");
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] =
    useState<BillingPreviewResponse | null>(null);

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

  async function handlePreview() {
    if (!sellerId) {
      alert("Please select seller.");
      return;
    }

    if (!billingMonth) {
      alert("Please select billing month.");
      return;
    }

    try {
      setLoading(true);

      const data = await BillingService.preview(
        sellerId,
        billingMonth
      );

      setPreview(data);
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ??
          "Preview failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    if (!sellerId) {
      alert("Please select seller.");
      return;
    }

    if (!billingMonth) {
      alert("Please select billing month.");
      return;
    }

    try {
      setLoading(true);

      const response =
        await BillingService.generate(
          sellerId,
          billingMonth
        );

      alert(
        response.message ??
          "Billing generated successfully."
      );

      handlePreview();
    } catch (error: any) {
      console.error(error);

      alert(
        error.response?.data?.message ??
          "Billing generation failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Billing
        </h1>

        <p className="text-gray-500">
          Preview and Generate Monthly Billing
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Seller */}
          <div>
            <label className="mb-2 block font-medium">
              Seller
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

          {/* Month */}
          <div>
            <label className="mb-2 block font-medium">
              Billing Month
            </label>

            <input
              type="month"
              value={billingMonth}
              onChange={(e) =>
                setBillingMonth(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-3">
            <button
              onClick={handlePreview}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Preview"}
            </button>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:bg-gray-400"
            >
              Generate Bill
            </button>
          </div>
        </div>
      </div>
{preview?.message && (
  <div className="rounded-lg bg-yellow-100 border border-yellow-300 p-4 text-yellow-800">
    {preview.message}
  </div>
)}
      {/* Summary */}
     {preview && !preview.message && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                Seller
              </p>

              <h2 className="mt-2 text-xl font-bold">
                {preview.seller}
              </h2>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                Billing Month
              </p>

              <h2 className="mt-2 text-xl font-bold">
                {preview.billingMonth}
              </h2>
            </div>

            <div className="rounded-xl bg-white p-5 shadow">
              <p className="text-sm text-gray-500">
                Shipments
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {preview.shipmentCount}
              </h2>
            </div>
          </div>

          {/* Preview Table */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              Billing Preview
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">
                      AWB
                    </th>
                    <th className="border p-2">
                      Carrier
                    </th>
                    <th className="border p-2">
                      Zone
                    </th>
                    <th className="border p-2">
                      Weight
                    </th>
                    <th className="border p-2">
                      Forward
                    </th>
                    <th className="border p-2">
                      COD
                    </th>
                    <th className="border p-2">
                      RTO
                    </th>
                    <th className="border p-2">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {preview.calculations?.map(
                    (item, index) => (
                      <tr key={index}>
                        <td className="border p-2">
                          {item.awbNumber}
                        </td>

                        <td className="border p-2">
                          {item.carrier}
                        </td>

                        <td className="border p-2">
                          {item.zone}
                        </td>

                        <td className="border p-2">
                          {item.applicableWeight}
                        </td>

                        <td className="border p-2">
                          ₹
                          {item.forwardTotalCharge}
                        </td>

                        <td className="border p-2">
                          ₹
                          {item.codCharge}
                        </td>

                        <td className="border p-2">
                          ₹
                          {item.rtoCharge}
                        </td>

                        <td className="border p-2 font-bold text-green-600">
                          ₹
                          {item.totalCharge}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}