"use client";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

import { useCurrentUser } from "@/hooks/use-current-user";

import DashboardHeader from "@/components/dashboard/dashboard-header";

import UserInfo from "@/components/dashboard/user-info";

import Loader from "@/components/ui/loader";

export default function DashboardPage() {
  const router = useRouter();

  const { logout } = useAuthStore();

  const { user, loading } =
    useCurrentUser();

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

      {user && (
        <UserInfo
          email={user.email}
          role={user.role}
        />
      )}
    </div>
  );
}