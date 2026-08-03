"use client";

import { useEffect, useState } from "react";

import { SellerService } from "@/services/seller.service";
import { CarrierService } from "@/services/carrier.service";
import { SellerRateCardService } from "@/services/seller-rate-card.service";
import { RateCardTemplateService } from "@/services/rate-card-template.service";

interface Seller {
  id: string;
  sellerName: string;
}

interface Carrier {
  id: string;
  name: string;
}

export default function RateCardsPage() {
  const [sellerId, setSellerId] = useState("");
  const [carrierId, setCarrierId] = useState("");

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const sellerData = await SellerService.getAll();
      const carrierData = await CarrierService.getAll();

      setSellers(sellerData);
      setCarriers(carrierData);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  }

  async function handleUpload() {
    if (!file) {
      alert("Please select an Excel file");
      return;
    }

    try {
      setUploading(true);

      const response =
        await RateCardTemplateService.importExcel(file);

      alert(
        `Upload Successful!

Imported: ${response.imported}

Skipped: ${response.skipped}`
      );

      setFile(null);
    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ??
          "Upload Failed"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleCopy() {
    if (!sellerId) {
      alert("Select Seller");
      return;
    }

    if (!carrierId) {
      alert("Select Carrier");
      return;
    }

    try {
      setLoading(true);

      const response =
        await SellerRateCardService.copyRateCard(
          sellerId,
          carrierId,
        );

      alert(
        response.message ??
          "Rate Card Copied Successfully"
      );
    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ??
          "Copy Failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Rate Cards
        </h1>

        <p className="text-gray-500">
          Upload Master Rate Card & Copy To Seller
        </p>
      </div>

      {/* Upload Master Rate Card */}

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="text-xl font-semibold mb-4">
          Upload Master Rate Card
        </h2>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] ?? null
            )
          }
          className="mb-4 block"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          {uploading
            ? "Uploading..."
            : "Upload Excel"}
        </button>

      </div>

      {/* Copy Master Rate Card */}

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="text-xl font-semibold mb-4">
          Copy Master Rate Card To Seller
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div>

            <label className="block mb-2 font-medium">
              Seller
            </label>

            <select
              className="w-full rounded border p-3"
              value={sellerId}
              onChange={(e) =>
                setSellerId(e.target.value)
              }
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

          <div>

            <label className="block mb-2 font-medium">
              Carrier
            </label>

            <select
              className="w-full rounded border p-3"
              value={carrierId}
              onChange={(e) =>
                setCarrierId(e.target.value)
              }
            >
              <option value="">
                Select Carrier
              </option>

              {carriers.map((carrier) => (
                <option
                  key={carrier.id}
                  value={carrier.id}
                >
                  {carrier.name}
                </option>
              ))}

            </select>

          </div>

        </div>

        <button
          onClick={handleCopy}
          disabled={loading}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          {loading
            ? "Copying..."
            : "Copy Master Rate Card"}
        </button>

      </div>

    </div>
  );
}