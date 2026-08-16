import "server-only";

import { headers } from "next/headers";

import type { Language } from "@/types/language";

const COUNTRY_HEADER = "x-vercel-ip-country";

const DEFAULT_LANGUAGE: Language = "ko";

const COUNTRY_TO_LANGUAGE: Record<string, Language> = {
  KR: "ko",
  JP: "ja",
};

export async function getCurrentLanguage(): Promise<Language> {
  const headerList = await headers();
  const country = headerList.get(COUNTRY_HEADER)?.toUpperCase();

  if (!country) {
    return DEFAULT_LANGUAGE;
  }

  return COUNTRY_TO_LANGUAGE[country] ?? DEFAULT_LANGUAGE;
}
