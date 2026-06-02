import { create } from "zustand";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;

  token: string | null;

  setUser: (user: User) => void;

  login: (token: string) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthStore>((set) => ({
    user: null,

    token:
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null,

    setUser: (user) =>
      set({
        user,
      }),

    login: (token) => {
      localStorage.setItem("token", token);

      set({
        token,
      });
    },

    logout: () => {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
      });
    },
  }));