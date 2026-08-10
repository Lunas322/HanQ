import type { Language } from "../mocks/questions";

const FLAG: Record<Language, { emoji: string; label: string }> = {
  ko: { emoji: "🇰🇷", label: "한국" },
  ja: { emoji: "🇯🇵", label: "일본" },
};

export function Flag({ language }: { language: Language }) {
  const { emoji, label } = FLAG[language];

  // role/aria-label이 없으면 스크린리더가 "대한민국 국기"처럼 읽는다.
  return (
    <span className="shrink-0" role="img" aria-label={label}>
      {emoji}
    </span>
  );
}
