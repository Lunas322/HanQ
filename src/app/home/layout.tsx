import React from "react";
import { Header } from "../components/Header";
import { LanguageToggle } from "../components/LanguageToggle";
import { NotificationBell } from "../components/NotificationBell";
import { getCurrentUser } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

export default async function HomeLayout({ children }: Props) {
  const user = await getCurrentUser();

  return (
    <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="Logo">
          <LanguageToggle />
          {user && <NotificationBell uid={user.uid} />}
        </Header>
      </div>

      <main className="flex-1 bg-muted px-[10px] py-[8px]">{children}</main>
    </>
  );
}
