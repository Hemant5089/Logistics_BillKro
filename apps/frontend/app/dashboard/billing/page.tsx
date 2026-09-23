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
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
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

    // ==========================================
    // STEP 1: Generate Billing Records
    // ==========================================

    const response = await BillingService.generate(
      sellerId,
      billingMonth
    );

    // If backend says there are no billable shipments
    if (!response.success) {
      alert(
        response.message ??
        "No billable shipments found."
      );
      return;
    }

    // ==========================================
    // STEP 2: Download Excel
    // ==========================================

    const excelResponse =
      await BillingService.downloadExcel(
        sellerId,
        billingMonth
      );

    const blob = new Blob(
      [excelResponse.data],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `Invoice_${response.seller}_${billingMonth}.xlsx`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    // ==========================================
    // STEP 3: Success
    // ==========================================

    alert(
      `Bill generated successfully.\n${response.generatedBills} shipments billed.\nExcel downloaded.`
    );

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

async function handleDownloadPdf() {
  if (!sellerId) {
    alert("Please select seller.");
    return;
  }

  if (!billingMonth) {
    alert("Please select billing month.");
    return;
  }

  if (!invoicePrefix.trim()) {
    alert("Please enter invoice prefix.");
    return;
  }

  if (!invoiceNumber.trim()) {
    alert("Please enter invoice number.");
    return;
  }

  try {
    setLoading(true);

    const pdfResponse =
      await BillingService.downloadPdf(
        sellerId,
        billingMonth,
        invoicePrefix.trim(),
        invoiceNumber.trim()
      );

    const blob = new Blob(
      [pdfResponse.data],
      {
        type: "application/pdf",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `Invoice_${invoicePrefix.trim()}${invoiceNumber.trim()}_${billingMonth}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error: any) {
    console.error(error);

    alert(
      error.response?.data?.message ??
      "PDF download failed."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
       <h1 className="text-3xl font-bold tracking-tight text-gray-900">
  Billing
</h1>

<p className="mt-1 text-sm text-gray-500">
  Preview, generate, and download monthly seller invoices.
</p>
      </div>
{/* Billing Controls */}
<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

  {/* Section Header */}
  <div className="mb-6">
    <h2 className="text-lg font-semibold text-gray-900">
      Billing Configuration
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Select the seller and billing period to preview or generate billing.
    </p>
  </div>

  {/* Seller + Billing Month */}
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

    {/* Seller */}
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Seller
      </label>

      <select
        value={sellerId}
        onChange={(e) => setSellerId(e.target.value)}
        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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

    {/* Billing Month */}
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Billing Month
      </label>

      <input
        type="month"
        value={billingMonth}
        onChange={(e) => setBillingMonth(e.target.value)}
        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

  </div>

  {/* Invoice Details */}
  <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-5">

    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-800">
        Invoice Details
      </h3>

      <p className="mt-1 text-xs text-gray-500">
        Enter the invoice reference for the generated PDF.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

      {/* Invoice Prefix */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Invoice Prefix
        </label>

        <input
          type="text"
          value={invoicePrefix}
          onChange={(e) => setInvoicePrefix(e.target.value)}
          placeholder="e.g. INV"
          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Invoice Number */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Invoice Number
        </label>

        <input
          type="text"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          placeholder="e.g. 1001"
          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

    </div>
  </div>

  {/* Action Buttons */}
  <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

    {/* Preview */}
    <button
      onClick={handlePreview}
      disabled={loading}
      className="h-11 rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Processing..." : "Preview Billing"}
    </button>

    {/* Generate */}
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="h-11 rounded-lg bg-blue-600 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      Generate Bill
    </button>

    {/* PDF */}
    <button
      onClick={handleDownloadPdf}
      disabled={loading || !sellerId || !billingMonth}
      className="h-11 rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Download PDF
    </button>
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