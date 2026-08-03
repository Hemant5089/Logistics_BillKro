"use client";

import { useEffect, useState } from "react";
import { ReportService } from "@/services/report.service";
import { ReportSummary } from "@/types/report";

export default function ReportsPage() {
  const [summary, setSummary] =
    useState<ReportSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    try {
      const response =
        await ReportService.getSummary();

      setSummary(response.summary);
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
      <div>
        <h1 className="text-3xl font-bold">
          Reports
        </h1>

        <p className="text-gray-500">
          Billing Reports Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-500">
            Total Bills
          </h2>

          <p className="mt-4 text-4xl font-bold text-blue-600">
            {summary?.totalBills ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-gray-500">
            Total Revenue
          </h2>

          <p className="mt-4 text-4xl font-bold text-green-600">
            ₹
            {summary?.totalRevenue ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}