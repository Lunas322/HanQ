import { Header } from "@/app/components/Header";
import { Icon } from "@/app/components/Icon";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { getServerDictionary } from "@/lib/i18n/server";
import React from "react";

type Props = {
    children: React.ReactNode
}

export default async function detailLayout ({children}:Props) {
    const { detail } = await getServerDictionary();

    return (
  <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="ChevronLeft" title={detail.headerTitle}>
          <LanguageToggle />
          <Icon size="l" icon="More" className="text-icon" />
        </Header>
      </div>

      <main className="flex-1 bg-muted ">{children}</main>
      </>
    )
}