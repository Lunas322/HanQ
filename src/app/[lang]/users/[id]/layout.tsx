import React from "react";
import { notFound } from "next/navigation";

import { getUserProfile } from "@/lib/user";
import { isLanguage } from "@/types/language";
import { Header } from "@/app/components/Header";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string; id: string }>;
};

export default async function UserLayout({ children, params }: Props) {
  const { lang, id } = await params;
  const profile = await getUserProfile(id, isLanguage(lang) ? lang : "ko");

  if (!profile) {
    notFound();
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="ChevronLeft" title={profile.name} />
      </div>

      <main id="main" tabIndex={-1} className="flex-1 bg-muted">{children}</main>
    </>
  );
}
