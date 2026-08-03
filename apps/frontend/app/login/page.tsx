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

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      const response = await authService.login({
        email,
        password,
      });

      login(response.accessToken);
      setUser(response.user);

      alert("Login Successful");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login Failed");
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