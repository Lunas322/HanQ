import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/session";

export function GET(request: NextRequest): NextResponse {
  const response = NextResponse.redirect(new URL("/", request.url));

  response.cookies.delete(SESSION_COOKIE_NAME);

  return response;
}
