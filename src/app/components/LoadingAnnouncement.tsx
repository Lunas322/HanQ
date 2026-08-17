"use client";

import { useDictionary } from "@/lib/i18n/context";

export function LoadingAnnouncement() {
  const { common } = useDictionary();

  return (
    <span role="status" className="sr-only">
      {common.loadingQuestions}
    </span>
  );
}
