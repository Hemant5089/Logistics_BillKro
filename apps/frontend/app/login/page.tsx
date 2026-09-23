"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthForm from "@/components/auth/auth-form";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();

  const { login, setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({
        email,
        password,
      });

      login(response.accessToken);
      setUser(response.user);

      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Login"
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      onSubmit={handleLogin}
      buttonText="Login"
      loading={loading}
      error={error}
    />
  );
}
