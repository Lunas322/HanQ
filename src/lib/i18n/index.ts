import type { Language } from "@/types/language";
import { en } from "./en";
import { ja } from "./ja";
import { ko, type Dictionary } from "./ko";

export type { Dictionary };

export const LANGUAGE_COOKIE_NAME = "hanq-lang";
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const DICTIONARIES: Record<Language, Dictionary> = { ko, ja, en };

export function getDictionary(language: Language): Dictionary {
  return DICTIONARIES[language];
}
