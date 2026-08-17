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

export default async function EditLayout({ children }: Props) {
  const { profile } = await getServerDictionary();

  return (
    <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="ChevronLeft" title={profile.editTitle} />
      </div>

      <main className="flex flex-1 flex-col bg-surface">{children}</main>
    </>
  );
}
