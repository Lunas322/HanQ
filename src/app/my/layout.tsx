import { redirect } from "next/navigation";
import React, { Suspense } from "react";

import { getCurrentUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/user";
import { Header } from "../components/Header";
import { LanguageToggle } from "../components/LanguageToggle";
import { ProfileMenu } from "../components/ProfileMenu";
import { ProfileSummary } from "../components/ProfileSummary";
import { ProfileSummarySkeleton } from "../components/ProfileSummarySkeleton";
import type { Profile } from "@/types/user";

type Props = {
  children: React.ReactNode;
};

async function MyProfile({ uid, name }: { uid: string; name: string }) {
  const profile: Profile = (await getUserProfile(uid)) ?? {
    id: uid,
    name,
    languages: "ko",
    questionCount: 0,
    answerCount: 0,
    receivedLikeCount: 0,
  };

  return <ProfileSummary profile={profile} />;
}

export default async function MyLayout({ children }: Props) {
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
          <MyProfile uid={user.uid} name={user.name} />
        </Suspense>
        {children}
      </main>
    </>
  );
}
