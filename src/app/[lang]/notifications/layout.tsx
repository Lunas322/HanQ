import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

import React from "react";

import { Header } from "@/app/components/Header";
import { getServerDictionary } from "@/lib/i18n/server";

type Props = {
  children: React.ReactNode;
};

export default async function NotificationsLayout({ children }: Props) {
  const { notification } = await getServerDictionary();

  return (
    <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="ChevronLeft" title={notification.title} />
      </div>

      <main className="flex-1 bg-surface">{children}</main>
    </>
  );
}
