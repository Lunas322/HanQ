import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

import { redirect } from "next/navigation";
import React, { Suspense } from "react";

import { getCurrentUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/user";
import { Header } from "@/app/components/Header";
import { LanguageToggle } from "@/app/components/LanguageToggle";
import { ProfileMenu } from "@/app/components/ProfileMenu";
import { ProfileSummary } from "@/app/components/ProfileSummary";
import { ProfileSummarySkeleton } from "@/app/components/ProfileSummarySkeleton";
import type { Profile } from "@/types/user";
import { isLanguage, type Language } from "@/types/language";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

async function MyProfile({
  uid,
  name,
  language,
}: {
  uid: string;
  name: string;
  language: Language;
}) {
  const profile: Profile = (await getUserProfile(uid, language)) ?? {
    id: uid,
    name,
    languages: "ko",
    photoUrl: null,
    questionCount: 0,
    answerCount: 0,
    receivedLikeCount: 0,
  };

  return <ProfileSummary profile={profile} language={language} />;
}

export default async function MyLayout({ children, params }: Props) {
  const { lang } = await params;
  const language = isLanguage(lang) ? lang : "ko";
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logout");
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        <Header mainIcon="My">
          <LanguageToggle />
          <ProfileMenu />
        </Header>
      </div>

      <main className="flex-1 bg-muted">
        <Suspense fallback={<ProfileSummarySkeleton />}>
          <MyProfile uid={user.uid} name={user.name} language={language} />
        </Suspense>
        {children}
      </main>
    </>
  );
}
