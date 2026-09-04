import { NextResponse, type NextRequest } from "next/server";

import {
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_COOKIE_NAME,
} from "@/lib/i18n";
import { COUNTRY_TO_LANGUAGE } from "@/lib/country-language";
import { localePath } from "@/lib/routes";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { DEFAULT_LANGUAGE, isLanguage, type Language } from "@/types/language";

export const LANGUAGE_HEADER = "x-hanq-lang";

const COUNTRY_HEADER = "x-vercel-ip-country";

const LOCALE_SEGMENT = /^[a-z]{2}(-[a-z]{2})?$/i;

const PROTECTED_PATHS = [
  "/home",
  "/ask",
  "/my",
  "/notifications",
  "/profile",
] as const;

function detectLanguage(request: NextRequest): Language {
  const saved = request.cookies.get(LANGUAGE_COOKIE_NAME)?.value;

  if (isLanguage(saved)) {
    return saved;
  }

  const country = request.headers.get(COUNTRY_HEADER)?.toUpperCase();

  return COUNTRY_TO_LANGUAGE[country ?? ""] ?? DEFAULT_LANGUAGE;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const [, first, ...rest] = pathname.split("/");

  if (!isLanguage(first)) {
    if (LOCALE_SEGMENT.test(first)) {
      return NextResponse.next();
    }

    const language = detectLanguage(request);
    const target = localePath(language, pathname === "/" ? "/" : pathname);

    return NextResponse.redirect(new URL(`${target}${search}`, request.url));
  }

  const language = first;
  const path = rest.length === 0 ? "/" : `/${rest.join("/")}`;
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  const isProtected = PROTECTED_PATHS.some(
    (protectedPath) =>
      path === protectedPath || path.startsWith(`${protectedPath}/`),
  );

  if (isProtected && !hasSession) {
    return NextResponse.redirect(
      new URL(localePath(language, "/"), request.url),
    );
  }

  if (path === "/" && hasSession) {
    return NextResponse.redirect(
      new URL(localePath(language, "/home"), request.url),
    );
  }

  const headers = new Headers(request.headers);
  headers.set(LANGUAGE_HEADER, language);

  const response = NextResponse.next({ request: { headers } });

  if (request.cookies.get(LANGUAGE_COOKIE_NAME)?.value !== language) {
    response.cookies.set(LANGUAGE_COOKIE_NAME, language, {
      path: "/",
      maxAge: LANGUAGE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!__/|_next/static|_next/image|api/|logout|favicon.ico|robots.txt|ads.txt|sitemap.xml|llms.txt|icon|apple-icon|manifest|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|html)$).*)",
  ],
};
