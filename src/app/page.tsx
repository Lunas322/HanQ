import { Button } from "./components/Button";
import { HeroContent } from "./components/HeroContent";
import { LanguageToggle } from "./components/LanguageToggle";
import { Logo } from "./components/Logo";
import { QuestionCard } from "./components/QuestionCard";
import { findCategory } from "./mocks/categories";
import { QUESTIONS } from "./mocks/questions";

export default function Page() {
  return (
    <main className="min-h-dvh bg-surface px-6 py-5 pb-[114px]">
      <div className="w-full flex justify-end">
        <LanguageToggle showLabel={true} />
      </div>

      <Logo size="xl" />
      <HeroContent />

      <section>
        <h2 className="text-[13px] text-tertiary font-bold mt-8">
          지금 올라온 인기 질문
        </h2>
        <ul>
          {QUESTIONS.map((question) => (
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
        <Button
          content="Google로 3초 만에 시작하기"
          size="lg"
          className="w-full"
        />
        <p className="mt-[10px] flex justify-center text-[12px] font-medium text-tertiary">
          가입하면 이용약관과 개인정보 방침에 동의하게 돼요
        </p>
      </div>
    </main>
  );
}
