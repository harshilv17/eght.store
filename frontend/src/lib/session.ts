"use client";

import { v4 as uuidv4 } from "uuid";

const SESSION_COOKIE = "session_id";

export function getSessionId(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function ensureSessionId(): string {
  let id = getSessionId();
  if (!id) {
    id = uuidv4();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${SESSION_COOKIE}=${id}; expires=${expires}; path=/; SameSite=Lax`;
  }
  return id;
}

export function regenerateSessionId(): string {
  const id = uuidv4();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${SESSION_COOKIE}=${id}; expires=${expires}; path=/; SameSite=Lax`;
  return id;
}

export function clearSessionId(): void {
  document.cookie = `${SESSION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}
