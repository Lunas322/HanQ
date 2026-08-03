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
  "flex cursor-pointer items-center justify-center gap-[3px] rounded-full px-[10px] py-[6px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const PILL_SELECTED =
  "bg-surface text-brand shadow-[0px_4px_10px_-2px_rgba(0,0,0,0.06),0px_1px_2px_0px_rgba(0,0,0,0.04)]";

const PILL_IDLE = "text-tertiary";


export function LanguageToggle() {
  const [selected, setSelected] = useState<Language>("ko");

  return (
    <div
      className="flex items-center gap-[2px] rounded-full bg-muted p-[3px] text-[12px] font-bold"
    >
      {LANGUAGES.map(({ code, flag}) => {
        const isSelected = code === selected;

        return (
          <button
            key={code}
            onClick={() => setSelected(code)}
            className={`${PILL_BASE} ${isSelected ? PILL_SELECTED : PILL_IDLE}`}
          >
            <span>{flag}</span>
          </button>
        );
      })}
    </div>
  );
}
