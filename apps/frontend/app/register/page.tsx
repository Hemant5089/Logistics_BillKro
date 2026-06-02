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

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await authService.register({
        name,
        email,
        password,
      });

      alert("Registration successful!");

      router.push("/login");
    } catch (error) {
      console.error(error);

      alert("Registration failed!");
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
    />
  );
}