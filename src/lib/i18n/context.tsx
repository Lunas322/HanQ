"use client";

import { createContext, use, type ReactNode } from "react";

import type { Language } from "@/types/language";
import { getDictionary, type Dictionary } from "./index";

const LanguageContext = createContext<Language | null>(null);

type Props = {
  language: Language;
  children: ReactNode;
};

export function LanguageProvider({ language, children }: Props) {
  return <LanguageContext value={language}>{children}</LanguageContext>;
}

export function useLanguage(): Language {
  const language = use(LanguageContext);

  if (language === null) {
    throw new Error("useLanguage는 LanguageProvider 안에서만 쓸 수 있어요.");
  }

  return language;
}

export function useDictionary(): Dictionary {
  return getDictionary(useLanguage());
}
