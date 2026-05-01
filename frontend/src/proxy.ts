import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const SUPPORTED = new Set(["IN", "US", "GB", "AE"]);

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.cookies.get("session_id")) {
    const id = uuidv4();
    response.cookies.set("session_id", id, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
      httpOnly: false, // must be readable by JS for x-session-id header
    });
  }

  if (!request.cookies.get("country")) {
    const geo =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      "";
    const code = SUPPORTED.has(geo.toUpperCase()) ? geo.toUpperCase() : "IN";
    response.cookies.set("country", code, {
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
      httpOnly: false,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
