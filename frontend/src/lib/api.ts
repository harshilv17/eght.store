import { ApiError } from "@/types/api";
import { CartApiResponse, RawCartItem } from "@/types/cart";
import { BackendUser, Address } from "@/types/user";
import { Order, OrderSummary } from "@/types/order";
import { env } from "./env";

let _getAccessToken: (() => string | null) | null = null;
let _onRefreshFail: (() => void) | null = null;

export function initApiClient(
  getAccessToken: () => string | null,
  onRefreshFail: () => void
) {
  _getAccessToken = getAccessToken;
  _onRefreshFail = onRefreshFail;
}

function getSessionIdFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )session_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function attemptRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${env.apiUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.accessToken ?? null;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { skipAuth?: boolean; _isRetry?: boolean } = {}
): Promise<T> {
  const { skipAuth = false, _isRetry = false, ...fetchInit } = init;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchInit.headers as Record<string, string>),
  };

  if (!skipAuth && _getAccessToken) {
    const token = _getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const sessionId = getSessionIdFromCookie();
  if (sessionId) headers["x-session-id"] = sessionId;

  const res = await fetch(`${env.apiUrl}${path}`, {
    ...fetchInit,
    credentials: "include",
    headers,
  });

  if (res.status === 401 && !_isRetry && !skipAuth) {
    const newToken = await attemptRefresh();
    if (newToken) {
      // Token store update handled by the caller via initApiClient
      return apiFetch<T>(path, { ...init, _isRetry: true });
    } else {
      _onRefreshFail?.();
      throw new ApiError(401, "Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    let message = "An error occurred";
    try {
      const err = await res.json();
      message = err.error ?? message;
    } catch {}
    throw new ApiError(res.status, message);
  }

  const json = await res.json();
  return json.data as T;
}

// ── Typed module wrappers ──

export const authApi = {
  register: (body: unknown) =>
    apiFetch<{ user: BackendUser; accessToken: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
      skipAuth: true,
    }),
  login: (body: unknown) =>
    apiFetch<{ user: BackendUser; accessToken: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      skipAuth: true,
    }),
  refresh: () =>
    apiFetch<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
      skipAuth: true,
    }),
  logout: () => apiFetch<void>("/auth/logout", { method: "POST" }),
  me: () => apiFetch<{ user: BackendUser }>("/auth/me"),
};

export const productApi = {
  list: (params?: Record<string, string | number | undefined>) => {
    const qs = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) qs.set(k, String(v));
      });
    }
    return apiFetch<unknown[]>(`/products?${qs}`, { skipAuth: true });
  },
  get: (slug: string) =>
    apiFetch<unknown>(`/products/${slug}`, { skipAuth: true }),
  categories: () =>
    apiFetch<unknown[]>("/products/categories", { skipAuth: true }),
};

export const cartApi = {
  get: () => apiFetch<CartApiResponse>("/cart"),
  add: (variantId: string, quantity: number) =>
    apiFetch<RawCartItem[]>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ variantId, quantity }),
    }),
  update: (variantId: string, quantity: number) =>
    apiFetch<RawCartItem[]>("/cart/items", {
      method: "PUT",
      body: JSON.stringify({ variantId, quantity }),
    }),
  remove: (variantId: string) =>
    apiFetch<RawCartItem[]>(`/cart/items/${variantId}`, { method: "DELETE" }),
};

export const paymentApi = {
  createOrder: (body: unknown) =>
    apiFetch<unknown>("/payment/create-order", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  verify: (body: unknown) =>
    apiFetch<unknown>("/payment/verify", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

export const userApi = {
  getAddresses: () => apiFetch<Address[]>("/user/addresses"),
  addAddress: (body: unknown) =>
    apiFetch<Address>("/user/addresses", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  deleteAddress: (id: string) =>
    apiFetch<void>(`/user/addresses/${id}`, { method: "DELETE" }),
};

export const orderApi = {
  list: () => apiFetch<OrderSummary[]>("/orders"),
  get: (id: string) => apiFetch<Order>(`/orders/${id}`),
};
