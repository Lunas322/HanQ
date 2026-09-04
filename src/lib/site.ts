import { LANGUAGES, type Language } from "@/types/language";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const OG_LOCALE: Record<Language, string> = {
  ko: "ko_KR",
  ja: "ja_JP",
  en: "en_US",
};

export function alternateOgLocales(language: Language): string[] {
  return LANGUAGES.filter((candidate) => candidate !== language).map(
    (candidate) => OG_LOCALE[candidate],
  );
}

export const PRIVATE_PATHS = [
  "/home",
  "/ask",
  "/my",
  "/notifications",
  "/profile",
] as const;
