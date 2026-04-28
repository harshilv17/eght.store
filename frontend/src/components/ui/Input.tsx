import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full px-4 py-3 border text-body-md text-[var(--color-on-surface)] bg-[var(--color-surface-container-lowest)] outline-none transition-colors placeholder:text-[var(--color-on-surface-variant)] focus:border-[var(--color-primary)] ${
            error
              ? "border-[var(--color-error)]"
              : "border-[var(--color-outline-variant)]"
          } ${className}`}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-body-md text-[var(--color-error)]"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
