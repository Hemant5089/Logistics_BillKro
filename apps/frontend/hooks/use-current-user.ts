"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

import { authService } from "@/services/auth.service";

export const useCurrentUser = () => {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const {
    user,
    setUser,
    logout,
  } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data =
          await authService.getMe();

        setUser(data);
      } catch (error) {
        console.error(error);

        logout();

        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, setUser, logout]);

  return {
    user,
    loading,
  };
};