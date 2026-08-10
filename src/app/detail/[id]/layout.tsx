import { Header } from "@/app/components/Header";
import { Icon } from "@/app/components/Icon";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import React from "react";

type Props = {
    children: React.ReactNode
}

export default function detailLayouy ({children}:Props) {
    return (
  <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="ChevronLeft" title="질문">
          <LanguageToggle />
          <Icon size="l" icon="More" className="text-icon" />
        </Header>
      </div>

      <main className="flex-1 bg-muted ">{children}</main>
      </>
    )
}