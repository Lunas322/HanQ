"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useDictionary } from "@/lib/i18n/context";
import { Icon } from "./Icon";

export function ProfileMenu() {
  const { my } = useDictionary();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [isOpen]);

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        aria-label={my.menuAria}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center text-icon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <Icon size="l" icon="More" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-1 w-32 overflow-hidden rounded-xl bg-surface py-1 shadow-[0_4px_16px_0_rgba(25,31,40,0.14)]"
          >
            <Link
              href="/profile/edit"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-[14px] font-medium text-secondary"
            >
              {my.editProfile}
            </Link>
            <a
              href="/logout"
              role="menuitem"
              className="block px-4 py-2.5 text-[14px] font-medium text-secondary"
            >
              {my.logout}
            </a>
          </div>
        </>
      )}
    </div>
  );
}
