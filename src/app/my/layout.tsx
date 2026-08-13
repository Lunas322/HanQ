import React from "react";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { LanguageToggle } from "../components/LanguageToggle";
import { ProfileSummary } from "../components/ProfileSummary";
import { ME } from "../mocks/profile";

type Props = {
  children: React.ReactNode;
};

export default function MyLayout({ children }: Props) {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="My">
          <LanguageToggle />
          <Icon size="l" icon="More" className="text-icon" />
        </Header>
      </div>

      <main className="flex-1 bg-muted">
        <ProfileSummary profile={ME} />
        {children}
      </main>
    </>
  );
}
