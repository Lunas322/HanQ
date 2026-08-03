import React from "react";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { LanguageToggle } from "../components/LanguageToggle";

type Props = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: Props) {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Header>
          <LanguageToggle />
          <Icon size="l" icon="Bell" />
        </Header>
      </div>

      <main className="flex-1 bg-muted px-[10px] py-[8px]">{children}</main>
    </>
  );
}
