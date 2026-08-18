import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AnswerInput } from "@/app/components/AnswerInput";
import { LoginToAnswer } from "@/app/components/LoginToAnswer";
import { AnswerItem } from "@/app/components/AnswerItem";
import { AnswerListSkeleton } from "@/app/components/AnswerListSkeleton";
import { QuestionJsonLd } from "@/app/components/QuestionJsonLd";
import { QuestionDetail } from "@/app/components/QuestionDetail";
import { findCategory } from "@/lib/categories";
import { listAnswers } from "@/lib/answers";
import { getCurrentUser } from "@/lib/auth";
import { QUESTIONS_COLLECTION } from "@/lib/collections";
import { getDictionary } from "@/lib/i18n";
import { hasLiked } from "@/lib/likes";
import { getVote } from "@/lib/polls";
import { getQuestion } from "@/lib/questions";
import { SITE_URL } from "@/lib/site";
import { isLanguage, LANGUAGES, type Language } from "@/types/language";
import type { Question } from "@/types/question";

interface DetailProps {
  params: Promise<{ lang: string; id: string }>;
}

const DESCRIPTION_MAX = 160;

export async function generateMetadata({
  params,
}: DetailProps): Promise<Metadata> {
  const { lang, id } = await params;

  if (!isLanguage(lang)) {
    return {};
  }

  const question = await getQuestion(id, lang);

  if (!question) {
    return {};
  }

  const description =
    question.content.length > DESCRIPTION_MAX
      ? `${question.content.slice(0, DESCRIPTION_MAX)}…`
      : question.content;

  const path = `/detail/${id}`;

  return {
    title: question.title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: Object.fromEntries(
        LANGUAGES.map((code) => [code, `/${code}${path}`]),
      ),
    },
    openGraph: {
      type: "article",
      title: question.title,
      description,
      url: `${SITE_URL}/${lang}${path}`,
      publishedTime: question.createdAt,
      locale: lang === "ko" ? "ko_KR" : "ja_JP",
    },
    twitter: {
      card: "summary",
      title: question.title,
      description,
    },
  };
}

async function AnswerList({
  question,
  viewerId,
  language,
  loginHref,
  url,
}: {
  question: Question;
  viewerId: string;
  language: Language;
  loginHref?: string;
  url: string;
}) {
  const answers = await listAnswers(question.id, viewerId, language);
  const dictionary = getDictionary(language);

  const optionIndex = new Map(
    (question.poll?.options ?? []).map((option, index) => [
      option.id,
      { label: option.label, index },
    ]),
  );

  return (
    <>
      <QuestionJsonLd question={question} answers={answers} url={url} />

      <h2 className="font-black text-[16px] text-primary">
        {dictionary.detail.answersHeading}{" "}
        <span className="text-brand">{answers.length}</span>
      </h2>

      {answers.length === 0 ? (
        <p className="py-10 text-center text-[14px] text-tertiary">
          {dictionary.detail.emptyAnswers}
        </p>
      ) : (
        answers.map((answer) => (
          <AnswerItem
            key={answer.id}
            answer={answer}
            vote={
              answer.votedOptionId
                ? optionIndex.get(answer.votedOptionId)
                : undefined
            }
            language={language}
            loginHref={loginHref}
          />
        ))
      )}
    </>
  );
}

export default async function DetailPage({ params }: DetailProps) {
  const { lang, id } = await params;

  if (!isLanguage(lang)) notFound();

  const language = lang;
  const user = await getCurrentUser();
  const loginHref = user ? undefined : `/${lang}`;

  const [question, liked, votedOptionId] = await Promise.all([
    getQuestion(id, language),
    user ? hasLiked(QUESTIONS_COLLECTION, id, user.uid) : false,
    user ? getVote(id, user.uid) : null,
  ]);

  if (!question) notFound();

  const category = findCategory(question.categoryId);

  return (
    <div className="min-h-dvh flex flex-col bg-surface">
      <QuestionDetail
        question={question}
        category={category}
        liked={liked}
        votedOptionId={votedOptionId}
        language={language}
        loginHref={loginHref}
      />

      <div className="bg-muted w-full h-2 shrink-0" />

      <section className="flex-1 px-5 pb-6 pt-[18px] flex flex-col gap-[18px]">
        <Suspense fallback={<AnswerListSkeleton />}>
          <AnswerList
            question={question}
            viewerId={user?.uid ?? ""}
            language={language}
            loginHref={loginHref}
            url={`${SITE_URL}/${language}/detail/${id}`}
          />
        </Suspense>
      </section>

      {user ? (
        <AnswerInput questionId={id} />
      ) : (
        <LoginToAnswer href={`/${language}`} language={language} />
      )}
    </div>
  );
}
