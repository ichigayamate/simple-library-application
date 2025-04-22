"use client";

import Input from "@/lib/components/input";
import { UserContext } from "@/lib/components/user-context";
import { backend, IResponse } from "@/lib/scripts/backend";
import { AxiosError, AxiosResponse } from "axios";
import Link from "next/link";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { control, handleSubmit } = useForm<LoginForm>();
  const { login } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    await backend
      .post("/login", data)
      .then((res: AxiosResponse<IResponse<{ token: string }>>) => {
        login(res.data.data.token)
      }).catch((err: AxiosError<IResponse<never>>) => {
        toast.error(err.response?.data.message ?? "An error occurred during login");
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-4">Please login</h1>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
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
          />
          <button className="btn btn-neutral w-full" disabled={loading}>
            {loading && <span className="loading loading-spinner"></span>}
            Login
          </button>
        </form>
      </div>
      <hr className="mt-4 mb-8" />
      <div className="flex flex-col items-center">
        <p className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="link link-neutral">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
