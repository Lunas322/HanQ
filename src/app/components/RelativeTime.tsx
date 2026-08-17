"use client";

import { useSyncExternalStore } from "react";

import { formatAbsoluteDate, formatRelativeTime } from "@/lib/format";
import { useLanguage } from "@/lib/i18n/context";

const subscribe = () => () => {};

export function RelativeTime({ iso }: { iso: string }) {
  const language = useLanguage();

  const label = useSyncExternalStore(
    subscribe,
    () => formatRelativeTime(new Date(iso), language),
    () => formatAbsoluteDate(new Date(iso), language),
  );

  return <time dateTime={iso}>{label}</time>;
}
