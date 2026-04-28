"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi, cartApi } from "@/lib/api";
import { mapUser } from "@/lib/auth-utils";
import { mapCartResponse } from "@/lib/cart-utils";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { clearSessionId } from "@/lib/session";
import { ApiError } from "@/types/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/account/orders";
  const { setAuth } = useAuthStore();
  const { setItems } = useCartStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setServerError(null);
    try {
      const { user: rawUser, accessToken } = await authApi.login(data);
      setAuth(mapUser(rawUser), accessToken);

      // Cart-merge: apiFetch sends both Bearer + session_id; backend merges on first authed GET
      const cart = await cartApi.get();
      const { items, subtotal } = mapCartResponse(cart);
      setItems(items, subtotal);
      clearSessionId();

      router.replace(redirectTo);
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {serverError && (
        <p role="alert" className="text-body-md text-[var(--color-error)] bg-[var(--color-surface-container)] px-4 py-3">
          {serverError}
        </p>
      )}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" loading={isSubmitting} fullWidth>
        Sign In
      </Button>

      <p className="text-body-md text-center text-[var(--color-on-surface-variant)]">
        No account?{" "}
        <Link
          href="/account/register"
          className="text-[var(--color-on-surface)] underline underline-offset-2 hover:text-[var(--color-on-tertiary-container)] transition-colors"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
