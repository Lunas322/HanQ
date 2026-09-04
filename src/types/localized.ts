import { LANGUAGES, type Language } from "./language";

export type LocalizedText = Partial<Record<Language, string>>;

export const TRANSLATION_STATUSES = ["pending", "done", "failed"] as const;

export type TranslationStatus = (typeof TRANSLATION_STATUSES)[number];

export function isTranslationStatus(
  value: unknown,
): value is TranslationStatus {
  return TRANSLATION_STATUSES.includes(value as TranslationStatus);
}

export function translationTargets(language: Language): Language[] {
  return LANGUAGES.filter((candidate) => candidate !== language);
}
