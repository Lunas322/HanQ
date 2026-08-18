import { Timestamp } from "firebase-admin/firestore";

import { isTranslationStatus, type TranslationStatus } from "@/types/localized";
import type { Language } from "@/types/language";

export function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function readDate(value: unknown): Date {
  return value instanceof Timestamp ? value.toDate() : new Date();
}

export function readLocalizedText(
  value: unknown,
  language: Language,
  fallbackLanguage: Language,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value !== "object" || value === null) {
    return "";
  }

  const texts = new Map(Object.entries(value));

  return readString(texts.get(language)) || readString(texts.get(fallbackLanguage));
}

export function readTranslationStatus(value: unknown): TranslationStatus {
  return isTranslationStatus(value) ? value : "done";
}

export function readPath(data: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }

    return new Map(Object.entries(current)).get(key);
  }, data);
}
