import React from "react";
import { notFound } from "next/navigation";

import { getUserProfile } from "@/lib/user";
import { Header } from "@/app/components/Header";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string; id: string }>;
};

export default async function UserLayout({ children, params }: Props) {
  const { id } = await params;
  const profile = await getUserProfile(id);

  if (!profile) {
    notFound();
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="ChevronLeft" title={profile.name} />
      </div>

      <main className="flex-1 bg-muted">{children}</main>
    </>
  );
}
