import { getServerDictionary } from "@/lib/i18n/server";

export async function TranslatingBadge() {
  const { common } = await getServerDictionary();

  return (
    <span className="shrink-0 whitespace-nowrap rounded-full bg-muted px-2 py-[2px] text-[11px] font-medium text-tertiary">
      {common.translating}
    </span>
  );
}
