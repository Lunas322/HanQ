import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { getCurrentUser } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { isLanguage } from "@/types/language";
import { getUserProfile } from "@/lib/user";
import { AuthoredQuestionList } from "@/app/components/AuthoredQuestionList";
import { ProfileSummary } from "@/app/components/ProfileSummary";
import { QuestionListSkeleton } from "@/app/components/QuestionListSkeleton";
import { Tab, type TabItem } from "@/app/components/Tab";

type Props = {
  params: Promise<{ lang: string; id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { lang, id } = await params;

  const viewer = await getCurrentUser();
  if (!viewer) redirect("/logout");
  if (viewer.uid === id) redirect(`/${lang}/my`);

  const language = isLanguage(lang) ? lang : "ko";
  const copy = getDictionary(language).profile;

  const [profile, { tab }] = await Promise.all([
    getUserProfile(id, language),
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
      <ProfileSummary profile={profile} language={language} />

      <div className="px-5 pt-4">
        <Tab items={tabs} className="w-full" />
      </div>

      <div className="px-5 pb-8">
        <Suspense
          key={isAnswerTab ? "answers" : "questions"}
          fallback={<QuestionListSkeleton count={2} />}
        >
          <AuthoredQuestionList
            uid={id}
            isAnswerTab={isAnswerTab}
            language={language}
          />
        </Suspense>
      </div>
    </>
  );
}
