"use client";

import { useEffect, useState } from "react";

import { ReportsService } from "@/services/report.service";
import { SellerService } from "@/services/seller.service";

import { BillingReport } from "@/types/report";
import { Seller } from "@/types/seller";

export default function ReportsPage() {
  const [reports, setReports] = useState<BillingReport[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

  const [selectedSeller, setSelectedSeller] = useState("");
  const [billingMonth, setBillingMonth] = useState("");

  const [totalBills, setTotalBills] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellers();
  }, []);

  useEffect(() => {
    loadReports();
  }, [selectedSeller, billingMonth]);

  async function loadSellers() {
    try {
      const data = await SellerService.getAll();
      setSellers(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadReports() {
    try {
      setLoading(true);

      const response =
        await ReportsService.getBillingReport(
          selectedSeller || undefined,
          billingMonth || undefined,
        );

      setReports(response.reports);
      setTotalBills(response.totalBills);
      setTotalRevenue(response.totalRevenue);
    } catch (error) {
      console.error(error);
      alert("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading Reports...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Billing Reports
        </h1>

        <p className="text-gray-500">
          View generated billing reports.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <select
            value={selectedSeller}
            onChange={(e) =>
              setSelectedSeller(e.target.value)
            }
            className="rounded-lg border p-3"
          >
            <option value="">
              All Sellers
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

          <input
            type="month"
            value={billingMonth}
            onChange={(e) =>
              setBillingMonth(e.target.value)
            }
            className="rounded-lg border p-3"
          />

          <button
            onClick={loadReports}
            className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
          >
            Refresh
          </button>

        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Bills
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalBills}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Revenue
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            ₹ {totalRevenue}
          </h2>
        </div>

      </div>

      {/* Table */}
      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-semibold">
          Billing Records
        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full border">

            <thead className="bg-gray-100">

              <tr>

                <th className="border p-2">
                  AWB
                </th>

                <th className="border p-2">
                  Seller
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
                  Charge
                </th>

                <th className="border p-2">
                  Month
                </th>

              </tr>

            </thead>

            <tbody>

              {reports.map((report) => (

                <tr
                  key={report.id}
                >

                  <td className="border p-2">
                    {report.shipment.awbNumber}
                  </td>

                  <td className="border p-2">
                    {report.seller.sellerName}
                  </td>

                  <td className="border p-2">
                    {report.carrier.name}
                  </td>

                  <td className="border p-2">
                    {report.zone.name}
                  </td>

                  <td className="border p-2">
                    {report.applicableWeight}
                  </td>

                  <td className="border p-2 font-bold text-green-600">
                    ₹ {report.totalCharge}
                  </td>

                  <td className="border p-2">
                    {report.billingMonth}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}