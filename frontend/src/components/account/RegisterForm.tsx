"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
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
      const { user: rawUser, accessToken } = await authApi.register(data);
      setAuth(mapUser(rawUser), accessToken);

      const cart = await cartApi.get();
      const { items, subtotal } = mapCartResponse(cart);
      setItems(items, subtotal);
      clearSessionId();

      router.replace("/account/orders");
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

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label="Last name"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

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
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" loading={isSubmitting} fullWidth>
        Create Account
      </Button>

      <p className="text-body-md text-center text-[var(--color-on-surface-variant)]">
        Already have an account?{" "}
        <Link
          href="/account/login"
          className="text-[var(--color-on-surface)] underline underline-offset-2 hover:text-[var(--color-on-tertiary-container)] transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
