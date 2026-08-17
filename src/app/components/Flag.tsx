"use client";

import { useDictionary } from "@/lib/i18n/context";
import type { Language } from "@/types/language";

const EMOJI: Record<Language, string> = { ko: "🇰🇷", ja: "🇯🇵" };

export function Flag({ language }: { language: Language }) {
  const dictionary = useDictionary();

  return (
    <span className="shrink-0" role="img" aria-label={dictionary.country[language]}>
      {EMOJI[language]}
    </span>
  );
}
