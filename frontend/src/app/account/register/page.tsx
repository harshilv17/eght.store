import { RegisterForm } from "@/components/account/RegisterForm";

export const metadata = {
  title: "Create Account — EGHT",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-[var(--color-background)]">
      <div className="w-full max-w-md">
        <h1 className="text-headline-md font-bold uppercase tracking-tight text-[var(--color-primary)] mb-8">
          Create Account
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
}
