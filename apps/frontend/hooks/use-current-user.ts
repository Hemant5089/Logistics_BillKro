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
    token,
    setUser,
    logout,
  } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        logout();
        router.replace("/login");
        setLoading(false);
        return;
      }

      try {
        const data =
          await authService.getMe();

        setUser(data);
      } catch (error) {
        console.error(error);

        logout();

        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, token, setUser, logout]);

  return {
    user,
    loading,
  };
};
