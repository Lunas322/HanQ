import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

import { Header } from "@/app/components/Header";
import { Icon } from "@/app/components/Icon";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { getServerDictionary } from "@/lib/i18n/server";
import { getCurrentLanguage } from "@/lib/locale";
import { localePath } from "@/lib/routes";
import Link from "next/link";
import React from "react";

type Props = {
    children: React.ReactNode
}

export default async function askLayout ({children}:Props) {
    const { ask, nav } = await getServerDictionary();
    const language = await getCurrentLanguage();

    return (
  <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="ChevronLeft" title={ask.headerTitle}>
          <LanguageToggle />
          <Link href={localePath(language, "/home")} aria-label={nav.close} className="flex items-center text-icon">
            <Icon size="l" icon="Close" />
          </Link>
        </Header>
      </div>

      <main className="flex flex-1 flex-col bg-surface">{children}</main>
      </>
    )
}