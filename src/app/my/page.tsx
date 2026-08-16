import { redirect } from "next/navigation";
import { Suspense } from "react";

import { listAnsweredQuestionIds } from "@/lib/answers";
import { getCurrentUser } from "@/lib/auth";
import { findCategory } from "@/lib/categories";
import { getServerDictionary } from "@/lib/i18n/server";
import { getQuestionsByIds, listQuestions } from "@/lib/questions";
import { BottomNavigation } from "../components/BottomNavigation";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionListSkeleton } from "../components/QuestionListSkeleton";
import { Tab, type TabItem } from "../components/Tab";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

async function MyQuestionList({
  uid,
  isAnswerTab,
}: {
  uid: string;
  isAnswerTab: boolean;
}) {
  const dictionary = await getServerDictionary();

  const questions = isAnswerTab
    ? await getQuestionsByIds(await listAnsweredQuestionIds(uid))
    : await listQuestions({ authorId: uid });

  if (questions.length === 0) {
    return (
      <p className="py-16 text-center text-[14px] text-tertiary">
        {isAnswerTab
          ? dictionary.my.emptyAnswers
          : dictionary.my.emptyQuestions}
      </p>
    );
  }

  return (
    <ul>
      {questions.map((question) => (
        <li key={question.id}>
          <QuestionCard
            question={question}
            category={findCategory(question.categoryId)}
          />
        </li>
      ))}
    </ul>
  );
}

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
          <MyQuestionList uid={user.uid} isAnswerTab={isAnswerTab} />
        </Suspense>
      </div>

      <BottomNavigation />
    </>
  );
}
