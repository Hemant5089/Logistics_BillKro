"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, Pencil } from "lucide-react";

import SellerModal from "@/components/sellers/seller-modal";
import { SellerService } from "@/services/seller.service";
import {
  SellerRateCard,
  SellerRateCardService,
} from "@/services/seller-rate-card.service";
import { Seller } from "@/types/seller";

export default function SellerDetailsPage() {
  const params = useParams<{ id: string }>();

  const [seller, setSeller] = useState<Seller | null>(null);
  const [rates, setRates] = useState<SellerRateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [showRates, setShowRates] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSeller() {
      try {
        const data = await SellerService.getById(params.id);
        setSeller(data);
      } catch (loadError) {
        console.error(loadError);
        setError("Failed to load seller details.");
      } finally {
        setLoading(false);
      }
    }

    loadSeller();
  }, [params.id]);

  async function loadRates() {
    try {
      setRatesLoading(true);
      const data =
        await SellerRateCardService.getBySellerId(params.id);
      setRates(data);
      setShowRates(true);
    } catch (loadError) {
      console.error(loadError);
      setError("Failed to load seller rates.");
    } finally {
      setRatesLoading(false);
    }
  }

  async function handleSave(updatedSeller: Seller) {
    try {
      const { id, ...payload } = updatedSeller;
      const saved = await SellerService.update(id, payload);
      setSeller(saved);
      setModalOpen(false);
    } catch (saveError) {
      console.error(saveError);
      alert("Failed to update seller.");
    }
  }

  if (loading) {
    return (
      <div className="text-lg font-semibold text-slate-700">
        Loading seller...
      </div>
    );
  }

  if (error && !seller) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!seller) {
    return null;
  }

  const detailRows = [
    ["Seller Name", seller.sellerName],
    ["Company", seller.companyName],
    ["Email", seller.email],
    ["Phone", seller.phone],
    ["GST Number", seller.gstNumber],
    ["Address", seller.address],
    ["City", seller.city],
    ["State", seller.state],
    ["Pincode", seller.pincode],
    ["Status", seller.isActive === false ? "Inactive" : "Active"],
  ];

  return (
    <div className="space-y-6 text-slate-950">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/dashboard/sellers"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            Sellers
          </Link>

          <h1 className="text-3xl font-bold">
            {seller.sellerName}
          </h1>
          <p className="text-slate-600">
            Seller details and assigned rate cards.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            <Pencil size={18} />
            Edit Details
          </button>

          <button
            type="button"
            onClick={loadRates}
            disabled={ratesLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Eye size={18} />
            {ratesLoading ? "Loading..." : "See Rates"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-5 text-xl font-semibold">
          Seller Details
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {detailRows.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm text-slate-500">
                {label}
              </p>
              <p className="mt-1 font-semibold text-slate-950">
                {value || "-"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {showRates && (
        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">
            Seller Rate Cards
          </h2>

          <div className="overflow-auto rounded-lg border border-slate-200">
            <table className="min-w-[1200px]">
              <thead className="bg-slate-100">
                <tr>
                  {[
                    "Carrier",
                    "Service",
                    "Weight",
                    "Local",
                    "State",
                    "ROI",
                    "Metro",
                    "Special",
                    "COD Charge",
                    "COD %",
                    "RTO",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-sm font-semibold text-slate-800"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No rate cards found for this seller.
                    </td>
                  </tr>
                ) : (
                  rates.map((rate) => (
                    <tr
                      key={rate.id}
                      className="border-t border-slate-200"
                    >
                      <td className="px-4 py-3">
                        {rate.carrier?.name ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        {rate.service}
                      </td>
                      <td className="px-4 py-3">
                        {rate.startWeight} - {rate.maxWeight} kg
                      </td>
                      <td className="px-4 py-3">
                        {rate.localAmount}
                      </td>
                      <td className="px-4 py-3">
                        {rate.stateAmount}
                      </td>
                      <td className="px-4 py-3">
                        {rate.roiAmount}
                      </td>
                      <td className="px-4 py-3">
                        {rate.metroAmount}
                      </td>
                      <td className="px-4 py-3">
                        {rate.specialAmount}
                      </td>
                      <td className="px-4 py-3">
                        {rate.codFixedCharge}
                      </td>
                      <td className="px-4 py-3">
                        {rate.codPercentage}
                      </td>
                      <td className="px-4 py-3">
                        {rate.rtoCharge}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <SellerModal
        open={modalOpen}
        seller={seller}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
