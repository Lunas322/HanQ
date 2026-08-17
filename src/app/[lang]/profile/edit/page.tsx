import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/user";
import { isLanguage } from "@/types/language";
import { ProfileEditForm } from "./ProfileEditForm";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  const profile = (await getUserProfile(
    user.uid,
    isLanguage(lang) ? lang : "ko",
  )) ?? {
    id: user.uid,
    name: user.name,
    languages: "ko" as const,
    photoUrl: null,
    questionCount: 0,
    answerCount: 0,
    receivedLikeCount: 0,
  };

  return <ProfileEditForm profile={profile} />;
}
