"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

import AuthForm from "@/components/auth/auth-form";

import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuthStore();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const data =
        await authService.login({
          email,
          password,
        });

      login(data.accessToken);

      alert("Login successful!");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      alert("Invalid credentials");
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
    />
  );
}