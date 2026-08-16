import type { Language } from "@/types/language";

const FLAG: Record<Language, { emoji: string; label: string }> = {
  ko: { emoji: "🇰🇷", label: "한국" },
  ja: { emoji: "🇯🇵", label: "일본" },
};

export function Flag({ language }: { language: Language }) {
  const { emoji, label } = FLAG[language];

  return (
    <span className="shrink-0" role="img" aria-label={label}>
      {emoji}
    </span>
  );
}
