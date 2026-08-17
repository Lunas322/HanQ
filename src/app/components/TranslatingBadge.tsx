import { getDictionary } from "@/lib/i18n";
import type { Language } from "@/types/language";

export function TranslatingBadge({ language }: { language: Language }) {
  const { common } = getDictionary(language);

  return (
    <span className="shrink-0 whitespace-nowrap rounded-full bg-muted px-2 py-[2px] text-[11px] font-medium text-tertiary">
      {common.translating}
    </span>
  );
}
