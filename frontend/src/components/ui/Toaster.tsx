"use client";

import { useUiStore } from "@/store/ui.store";

export function Toaster() {
  const { toasts, removeToast } = useUiStore();

  return (
    <>
      {/* Polite region for success/info */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none"
      >
        {toasts
          .filter((t) => t.tone !== "error")
          .map((toast) => (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-4 min-w-[280px] max-w-[360px] px-5 py-4 border ${
                toast.tone === "success"
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-transparent"
                  : "bg-[var(--color-surface-container-lowest)] text-[var(--color-on-surface)] border-[var(--color-outline-variant)]"
              }`}
            >
              <ToastContent toast={toast} onDismiss={removeToast} />
            </div>
          ))}
      </div>

      {/* Assertive region for errors */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none"
        style={{ bottom: toasts.filter((t) => t.tone !== "error").length > 0 ? "auto" : undefined }}
      >
        {toasts
          .filter((t) => t.tone === "error")
          .map((toast) => (
            <div
              key={toast.id}
              role="alert"
              className="pointer-events-auto flex items-start gap-4 min-w-[280px] max-w-[360px] px-5 py-4 border bg-[var(--color-error)] text-[var(--color-on-error)] border-transparent"
            >
              <ToastContent toast={toast} onDismiss={removeToast} />
            </div>
          ))}
      </div>
    </>
  );
}

function ToastContent({
  toast,
  onDismiss,
}: {
  toast: { id: string; title: string; description?: string };
  onDismiss: (id: string) => void;
}) {
  return (
    <>
      <div className="flex-1 min-w-0">
        <p className="text-label-caps font-bold uppercase tracking-widest truncate">
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-body-md mt-0.5 opacity-80 line-clamp-2">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </>
  );
}
