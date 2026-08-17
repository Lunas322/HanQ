import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { getCurrentUser } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n/server";
import { getUserProfile } from "@/lib/user";
import { AuthoredQuestionList } from "../../components/AuthoredQuestionList";
import { ProfileSummary } from "../../components/ProfileSummary";
import { QuestionListSkeleton } from "../../components/QuestionListSkeleton";
import { Tab, type TabItem } from "../../components/Tab";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;

  const viewer = await getCurrentUser();
  if (!viewer) redirect("/logout");
  if (viewer.uid === id) redirect("/my");

  const [profile, { profile: copy }, { tab }] = await Promise.all([
    getUserProfile(id),
    getServerDictionary(),
    searchParams,
  ]);

  if (!profile) notFound();

  const isAnswerTab = tab === "answers";

  const tabs: TabItem[] = [
    { value: "questions", label: copy.tabQuestions },
    { value: "answers", label: copy.tabAnswers },
  ];

  return (
    <>
      <ProfileSummary profile={profile} />

      <div className="px-5 pt-4">
        <Tab items={tabs} className="w-full" />
      </div>

      <div className="px-5 pb-8">
        <Suspense
          key={isAnswerTab ? "answers" : "questions"}
          fallback={<QuestionListSkeleton count={2} />}
        >
          <AuthoredQuestionList uid={id} isAnswerTab={isAnswerTab} />
        </Suspense>
      </div>
    </>
  );
}
