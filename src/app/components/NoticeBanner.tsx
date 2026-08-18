import { getVisibleNotice } from "@/lib/notices";
import type { Language } from "@/types/language";
import { DismissibleNotice } from "./DismissibleNotice";

export async function NoticeBanner({ language }: { language: Language }) {
  const notice = await getVisibleNotice(language);

  if (!notice) {
    return null;
  }

  return <DismissibleNotice id={notice.id} message={notice.message} />;
}
