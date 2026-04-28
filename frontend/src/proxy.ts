import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
