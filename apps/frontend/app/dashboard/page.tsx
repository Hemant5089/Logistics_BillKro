"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

import { useCurrentUser } from "@/hooks/use-current-user";

import { dashboardService } from "@/services/dashboard.service";

import DashboardHeader from "@/components/dashboard/dashboard-header";

import UserInfo from "@/components/dashboard/user-info";

import StatsCard from "@/components/dashboard/stats-card";

import Loader from "@/components/ui/loader";

interface DashboardStats {
  totalSellers: number;
  totalCarriers: number;
  totalZones: number;
}

export default function DashboardPage() {
  const router = useRouter();

  const { logout } = useAuthStore();

  const { user, loading } =
    useCurrentUser();

  const [stats, setStats] =
    useState<DashboardStats>({
      totalSellers: 0,
      totalCarriers: 0,
      totalZones: 0,
    });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data =
          await dashboardService.getStats();

        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadStats();
  }, []);

  const handleLogout = () => {
    logout();

    router.push("/login");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <DashboardHeader
        onLogout={handleLogout}
      />

      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Sellers"
          value={stats.totalSellers}
        />

        <StatsCard
          title="Total Carriers"
          value={stats.totalCarriers}
        />

        <StatsCard
          title="Total Zones"
          value={stats.totalZones}
        />
      </div>

      {user && (
        <UserInfo
          email={user.email}
          role={user.role}
        />
      )}
    </div>
  );
}