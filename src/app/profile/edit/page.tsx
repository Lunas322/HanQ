import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getUserProfile } from "@/lib/user";
import { ProfileEditForm } from "./ProfileEditForm";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  const profile = (await getUserProfile(user.uid)) ?? {
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
