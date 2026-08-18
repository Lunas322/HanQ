"use client";

import { useState } from "react";

import { useDictionary } from "@/lib/i18n/context";
import { NOTICE_COOKIE_MAX_AGE, NOTICE_COOKIE_NAME } from "@/lib/notice";
import type { Notice } from "@/lib/notice";
import { Icon } from "./Icon";

export function DismissibleNotice({ id, message }: Notice) {
  const { common } = useDictionary();
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  const dismiss = () => {
    document.cookie = `${NOTICE_COOKIE_NAME}=${encodeURIComponent(id)}; path=/; max-age=${NOTICE_COOKIE_MAX_AGE}; samesite=lax`;
    setVisible(false);
  };

  return (
    <div
      role="status"
      className="mb-3 flex items-start gap-2 rounded-2xl bg-brand-subtle px-4 py-3"
    >
      <span aria-hidden="true" className="text-[15px] leading-[1.5]">
        📢
      </span>

      <p className="min-w-0 flex-1 text-[13px] font-medium leading-[1.5] text-brand">
        {message}
      </p>

      <button
        type="button"
        onClick={dismiss}
        aria-label={common.dismissNotice}
        className="-mr-1 -mt-1 shrink-0 rounded-full p-1 text-brand"
      >
        <Icon icon="Close" size="s" />
      </button>
    </div>
  );
}
