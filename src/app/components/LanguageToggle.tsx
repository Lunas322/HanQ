"use client";

import { useState } from "react";

type Language = "ko" | "ja";
type Languages = {
  code: Language
  flag: string
  label:string

}

const LANGUAGES: Languages[] = [
  { code: "ko", flag: "🇰🇷", label: "한국어" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
];

const PILL_BASE =
  "flex cursor-pointer items-center justify-center gap-[3px] rounded-full px-[10px] py-[6px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand";

const PILL_SELECTED =
  "bg-surface text-brand shadow-[0px_4px_10px_-2px_rgba(0,0,0,0.06),0px_1px_2px_0px_rgba(0,0,0,0.04)]";

const PILL_IDLE = "text-tertiary";


type Props = {
  showLabel?: boolean;
};

export function LanguageToggle({ showLabel = false }: Props) {
  const [selected, setSelected] = useState<Language>("ko");

  return (
    <fieldset className="flex items-center gap-[2px] rounded-full bg-muted p-[3px] text-[12px] font-bold">
      {LANGUAGES.map(({ code, flag, label }) => {
        const isSelected = code === selected;

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
              onChange={() => setSelected(code)}
              className="sr-only"
            />
            <span>{flag}</span>
            {showLabel && <span>{label}</span>}
          </label>
        );
      })}
    </fieldset>
  );
}
