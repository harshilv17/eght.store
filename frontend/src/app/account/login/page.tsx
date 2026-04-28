import { Suspense } from "react";
import { LoginForm } from "@/components/account/LoginForm";

export const metadata = {
  title: "Sign In — EGHT",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-[var(--color-background)]">
      <div className="w-full max-w-md">
        <h1 className="text-headline-md font-bold uppercase tracking-tight text-[var(--color-primary)] mb-8">
          Sign In
        </h1>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
