"use client";

import { useEffect, useState } from "react";
import { DashboardService } from "@/services/dashboard.service";

interface DashboardStats {
  totalSellers: number;
  totalCarriers: number;
  totalShipments: number;
  totalBilling: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSellers: 0,
    totalCarriers: 0,
    totalShipments: 0,
    totalBilling: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await DashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center text-lg font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Logistics Billing Automation Overview
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Sellers
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {stats.totalSellers}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Carriers
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {stats.totalCarriers}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Shipments
          </p>

          <h2 className="mt-3 text-4xl font-bold text-orange-600">
            {stats.totalShipments}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Billing Records
          </p>

          <h2 className="mt-3 text-4xl font-bold text-purple-600">
            {stats.totalBilling}
          </h2>
        </div>

      </div>
    </div>
  );
}