import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getCurrentUser } from "@/lib/auth";
import { getServerDictionary } from "@/lib/i18n/server";
import { AuthoredQuestionList } from "@/app/components/AuthoredQuestionList";
import { BottomNavigation } from "@/app/components/BottomNavigation";
import { QuestionListSkeleton } from "@/app/components/QuestionListSkeleton";
import { Tab, type TabItem } from "@/app/components/Tab";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  const { my } = await getServerDictionary();
  const { tab } = await searchParams;
  const isAnswerTab = tab === "answers";

  const tabs: TabItem[] = [
    { value: "questions", label: my.tabQuestions },
    { value: "answers", label: my.tabAnswers },
  ];

  return (
    <>
      <div className="px-5 pt-4">
        <Tab items={tabs} className="w-full" />
      </div>

      <div className="px-5 pb-19">
        <Suspense key={isAnswerTab ? "answers" : "questions"} fallback={<QuestionListSkeleton count={2} />}>
          <AuthoredQuestionList uid={user.uid} isAnswerTab={isAnswerTab} />
        </Suspense>
      </div>

      <BottomNavigation />
    </>
  );
}
