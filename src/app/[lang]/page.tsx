import { GoogleLoginButton } from "@/app/components/GoogleLoginButton";
import { HeroContent } from "@/app/components/HeroContent";
import { Logo } from "@/app/components/Logo";
import { QuestionCard } from "@/app/components/QuestionCard";
import { findCategory } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";
import { getDictionary } from "@/lib/i18n";
import { listQuestions } from "@/lib/questions";
import { isLanguage, LANGUAGES } from "@/types/language";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { NoticeBanner } from "@/app/components/NoticeBanner";

const PREVIEW_COUNT = 3;

type Props = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export default async function Page({ params }: Props) {
  const { lang } = await params;

  if (!isLanguage(lang)) notFound();

  const { landing } = getDictionary(lang);

  const questions = (await listQuestions(lang))
    .toSorted((a, b) => b.likeCount - a.likeCount)
    .slice(0, PREVIEW_COUNT);

  return (
    <main className="min-h-dvh bg-surface px-6 py-5 pb-[114px]">
      <Suspense fallback={null}>
        <NoticeBanner language={lang} />
      </Suspense>

      <Logo size="xl" />
      <HeroContent language={lang} />

      <section>
        <h2 className="text-[13px] text-tertiary font-bold mt-8">
          {landing.popularHeading}
        </h2>
        <ul>
          {questions.map((question) => (
            <li key={question.id}>
              <QuestionCard
                question={question}
                category={findCategory(question.categoryId)}
                language={lang}
              />
            </li>
          ))}
        </ul>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-surface px-4 pt-3 pb-5.5">
        <GoogleLoginButton url={`${SITE_URL}/${lang}`} />
        <p className="mt-[10px] flex justify-center text-[12px] font-medium text-tertiary">
          {landing.terms}
        </p>
      </div>
    </main>
  );
}
