"use client";

import Button from "@/components/ui/button";

import Input from "@/components/ui/input";

interface AuthFormProps {
  title: string;

  name?: string;

  setName?: (
    value: string
  ) => void;

  email: string;

  password: string;

  setEmail: (
    value: string
  ) => void;

  setPassword: (
    value: string
  ) => void;

  onSubmit: (
    e: React.FormEvent<HTMLFormElement>
  ) => void;

  buttonText: string;
}

export default function AuthForm({
  title,
  name,
  setName,
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  buttonText,
}: AuthFormProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-[400px]"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          {title}
        </h1>

        {title === "Register" &&
          name !== undefined &&
          setName && (
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Button type="submit">
          {buttonText}
        </Button>
      </form>
    </div>
  );
}