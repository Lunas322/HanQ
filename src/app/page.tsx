import { GoogleLoginButton } from "./components/GoogleLoginButton";
import { HeroContent } from "./components/HeroContent";
import { LanguageToggle } from "./components/LanguageToggle";
import { Logo } from "./components/Logo";
import { QuestionCard } from "./components/QuestionCard";
import { findCategory } from "@/lib/categories";
import { getServerDictionary } from "@/lib/i18n/server";
import { listQuestions } from "@/lib/questions";

const PREVIEW_COUNT = 3;

export default async function Page() {
  const { landing } = await getServerDictionary();

  const questions = (await listQuestions())
    .toSorted((a, b) => b.likeCount - a.likeCount)
    .slice(0, PREVIEW_COUNT);

  return (
    <main className="min-h-dvh bg-surface px-6 py-5 pb-[114px]">
      <div className="w-full flex justify-end">
        <LanguageToggle showLabel={true} />
      </div>

      <Logo size="xl" />
      <HeroContent />

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
              />
            </li>
          ))}
        </ul>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-surface px-4 pt-3 pb-5.5">
        <GoogleLoginButton />
        <p className="mt-[10px] flex justify-center text-[12px] font-medium text-tertiary">
          {landing.terms}
        </p>
      </div>
    </main>
  );
}
