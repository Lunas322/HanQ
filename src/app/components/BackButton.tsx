"use client";

import { useRouter } from "next/navigation";

import { useDictionary, useLocalePath } from "@/lib/i18n/context";
import { Icon } from "./Icon";

type Props = {
  fallback: string;
};

export function BackButton({ fallback }: Props) {
  const router = useRouter();
  const { nav } = useDictionary();
  const path = useLocalePath();

  const goBack = () => {
    const cameFromApp =
      window.history.length > 1 &&
      document.referrer.startsWith(window.location.origin);

    if (cameFromApp) {
      router.back();
      return;
    }

    router.replace(path(fallback));
  };

  return (
    <button
      type="button"
      aria-label={nav.back}
      onClick={goBack}
      className="flex items-center text-icon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <Icon icon="ChevronLeft" size="l" />
    </button>
  );
}
