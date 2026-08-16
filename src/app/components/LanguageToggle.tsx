"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import {
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_COOKIE_NAME,
} from "@/lib/i18n";
import { useDictionary, useLanguage } from "@/lib/i18n/context";
import { LANGUAGES, type Language } from "@/types/language";

const FLAG: Record<Language, string> = { ko: "🇰🇷", ja: "🇯🇵" };

const PILL_BASE =
  "flex cursor-pointer items-center justify-center gap-[3px] rounded-full px-[10px] py-[6px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand";

const PILL_SELECTED =
  "bg-surface text-brand shadow-[0px_4px_10px_-2px_rgba(0,0,0,0.06),0px_1px_2px_0px_rgba(0,0,0,0.04)]";

const PILL_IDLE = "text-tertiary";

const IS_ENABLED = process.env.NODE_ENV !== "production";

type Props = {
  showLabel?: boolean;
};

export function LanguageToggle({ showLabel = false }: Props) {
  const router = useRouter();
  const dictionary = useDictionary();
  const language = useLanguage();

  const [, startTransition] = useTransition();
  const [optimisticLanguage, setOptimisticLanguage] = useOptimistic(language);

  if (!IS_ENABLED) {
    return null;
  }

  const select = (next: Language) => {
    startTransition(() => {
      setOptimisticLanguage(next);
      document.cookie = `${LANGUAGE_COOKIE_NAME}=${next};path=/;max-age=${LANGUAGE_COOKIE_MAX_AGE};samesite=lax`;
      router.refresh();
    });
  };

  return (
    <fieldset className="flex items-center gap-[2px] rounded-full bg-muted p-[3px] text-[12px] font-bold">
      <legend className="sr-only">{dictionary.language.switcherLegend}</legend>

      {LANGUAGES.map((code) => {
        const isSelected = code === optimisticLanguage;

        return (
          <label
            key={code}
            className={`${PILL_BASE} ${isSelected ? PILL_SELECTED : PILL_IDLE}`}
          >
            <input
              type="radio"
              name="language"
              value={code}
              checked={isSelected}
              onChange={() => select(code)}
              className="sr-only"
            />
            <span aria-hidden="true">{FLAG[code]}</span>
            <span className={showLabel ? undefined : "sr-only"}>
              {dictionary.language[code]}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
