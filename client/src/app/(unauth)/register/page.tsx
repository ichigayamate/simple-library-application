"use client";

import Input from "@/lib/components/input";
import { backend, IResponse } from "@/lib/scripts/backend";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const { control, handleSubmit } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (data: FormValues) => {
    setLoading(true);
    await backend.post("/register", data).then(() => {
      router.push("/login");
      toast.success("Registration successful! Please login.");
    }).catch((err: AxiosError<IResponse<never>>) => {
      toast.error(err.response?.data.message ?? "An error occurred during registration");
    });
  };

  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-4">Register</h1>
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          <Input control={control} name="name" placeholder="Name" required />
          <Input
            control={control}
            name="email"
            placeholder="Email"
            type="email"
            required
          />
          <Input
            control={control}
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={8}
          />
          <button className="btn btn-neutral w-full" disabled={loading}>
            {loading && <span className="loading loading-spinner"></span>}
            Register
          </button>
        </form>
      </div>
      <hr className="mt-4 mb-8" />
      <div className="flex flex-col items-center">
        <p className="text-sm">
          Already have account?{" "}
          <Link href="/login" className="link link-neutral">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
