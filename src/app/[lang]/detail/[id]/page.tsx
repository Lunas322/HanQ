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
import { getServerDictionary } from "@/lib/i18n/server";
import { hasLiked } from "@/lib/likes";
import { getQuestion } from "@/lib/questions";
import { SITE_URL } from "@/lib/site";
import { isLanguage, LANGUAGES } from "@/types/language";

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

  const question = await getQuestion(id);

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
  loginHref,
  url,
}: {
  question: Awaited<ReturnType<typeof getQuestion>> & object;
  viewerId: string;
  loginHref?: string;
  url: string;
}) {
  const questionId = question.id;
  const [answers, dictionary] = await Promise.all([
    listAnswers(questionId, viewerId),
    getServerDictionary(),
  ]);

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
          <AnswerItem key={answer.id} answer={answer} loginHref={loginHref} />
        ))
      )}
    </>
  );
}

export default async function DetailPage({ params }: DetailProps) {
  const { lang, id } = await params;

  const user = await getCurrentUser();
  const loginHref = user ? undefined : `/${lang}`;

  const [question, liked] = await Promise.all([
    getQuestion(id),
    user ? hasLiked(QUESTIONS_COLLECTION, id, user.uid) : false,
  ]);

  if (!question) notFound();

  const category = findCategory(question.categoryId);

  return (
    <div className="min-h-dvh flex flex-col bg-surface">
      <QuestionDetail
        question={question}
        category={category}
        liked={liked}
        loginHref={loginHref}
      />

      <div className="bg-muted w-full h-2 shrink-0" />

      <section className="flex-1 px-5 pb-6 pt-[18px] flex flex-col gap-[18px]">
        <Suspense fallback={<AnswerListSkeleton />}>
          <AnswerList
            question={question}
            viewerId={user?.uid ?? ""}
            loginHref={loginHref}
            url={`${SITE_URL}/${lang}/detail/${id}`}
          />
        </Suspense>
      </section>

      {user ? (
        <AnswerInput questionId={id} />
      ) : (
        <LoginToAnswer href={`/${lang}`} />
      )}
    </div>
  );
}
