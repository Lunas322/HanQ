import "server-only";

import { cookies, headers } from "next/headers";

import { LANGUAGE_COOKIE_NAME } from "@/lib/i18n";
import { isLanguage, type Language } from "@/types/language";

const COUNTRY_HEADER = "x-vercel-ip-country";

const DEFAULT_LANGUAGE: Language = "ko";

const COUNTRY_TO_LANGUAGE: Record<string, Language> = {
  KR: "ko",
  JP: "ja",
};

export function languageFromCountry(country: string | null): Language {
  if (!country) {
    return DEFAULT_LANGUAGE;
  }

  return COUNTRY_TO_LANGUAGE[country.toUpperCase()] ?? DEFAULT_LANGUAGE;
}

export async function getCurrentLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;

  if (isLanguage(saved)) {
    return saved;
  }

  const headerList = await headers();

  return languageFromCountry(headerList.get(COUNTRY_HEADER));
}
