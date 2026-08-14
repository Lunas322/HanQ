import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { BottomNavigation } from "../components/BottomNavigation";
import { QuestionCard } from "../components/QuestionCard";
import { Tab, type TabItem } from "../components/Tab";
import { ANSWERS } from "../mocks/answers";
import { findCategory } from "../mocks/categories";
import { ME } from "../mocks/profile";
import { QUESTIONS } from "../mocks/questions";

const TABS: TabItem[] = [
  { value: "questions", label: "내 질문" },
  { value: "answers", label: "내 답변" },
];

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  const { tab } = await searchParams;
  const isAnswerTab = tab === "answers";

  const answeredIds = new Set(
    ANSWERS.filter((answer) => answer.author.id === ME.id).map(
      (answer) => answer.questionId,
    ),
  );

  const questions = isAnswerTab
    ? QUESTIONS.filter((question) => answeredIds.has(question.id))
    : QUESTIONS.filter((question) => question.user.id === ME.id);

  return (
    <>
      <div className="px-5 pt-4">
        <Tab items={TABS} className="w-full" />
      </div>

      <div className="px-5 pb-19">
        {questions.length === 0 ? (
          <p className="py-16 text-center text-[14px] text-tertiary">
            {isAnswerTab
              ? "아직 답변한 질문이 없어요."
              : "아직 작성한 질문이 없어요."}
          </p>
        ) : (
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
        )}
      </div>

      <BottomNavigation />
    </>
  );
}
