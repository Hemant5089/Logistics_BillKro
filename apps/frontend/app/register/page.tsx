"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import AuthForm from "@/components/auth/auth-form";

import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  const [success, setSuccess] =
    useState("");

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await authService.register({
        name,
        email,
        password,
      });

      setSuccess("Registration successful. Redirecting to login...");

      router.push("/login");
    } catch (error) {
      console.error(error);

      setError("Registration failed. Please check the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Register"
      name={name}
      setName={setName}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      onSubmit={handleRegister}
      buttonText="Register"
      loading={loading}
      error={error}
      success={success}
    />
  );
}
