export const LANGUAGES = ["ko", "ja"] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "ko";

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language);
}
