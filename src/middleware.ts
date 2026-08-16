import { NextResponse, type NextRequest } from "next/server";

import {
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_COOKIE_NAME,
} from "@/lib/i18n";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { isLanguage } from "@/types/language";

const PROTECTED_PATHS = ["/home", "/ask", "/my", "/detail"] as const;

const COUNTRY_HEADER = "x-vercel-ip-country";

const COUNTRY_TO_LANGUAGE: Record<string, "ko" | "ja"> = {
  KR: "ko",
  JP: "ja",
};

function ensureLanguageCookie(request: NextRequest, response: NextResponse) {
  if (isLanguage(request.cookies.get(LANGUAGE_COOKIE_NAME)?.value)) {
    return;
  }

  const country = request.headers.get(COUNTRY_HEADER)?.toUpperCase();

  response.cookies.set(LANGUAGE_COOKIE_NAME, COUNTRY_TO_LANGUAGE[country ?? ""] ?? "ko", {
    path: "/",
    maxAge: LANGUAGE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const response =
    isProtected && !hasSession
      ? NextResponse.redirect(new URL("/", request.url))
      : pathname === "/" && hasSession
        ? NextResponse.redirect(new URL("/home", request.url))
        : NextResponse.next();

  ensureLanguageCookie(request, response);

  return response;
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/ask/:path*",
    "/my/:path*",
    "/detail/:path*",
  ],
};
