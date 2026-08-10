import { notFound } from "next/navigation";

import { AnswerInput } from "@/app/components/AnswerInput";
import { AnswerItem } from "@/app/components/AnswerItem";
import { QuestionDetail } from "@/app/components/QuestionDetail";
import { findAnswers } from "@/app/mocks/answers";
import { findCategory } from "@/app/mocks/categories";
import { QUESTIONS } from "@/app/mocks/questions";

interface DetailProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: DetailProps) {
  const { id } = await params;

  const question = QUESTIONS.find((question) => question.id === id);
  if (!question) notFound();

  const category = findCategory(question.categoryId);
  const answers = findAnswers(id);

  return (
    <div className="min-h-dvh flex flex-col bg-surface">
      <QuestionDetail question={question} category={category} />

      <div className="bg-muted w-full h-2 shrink-0" />

      <section className="flex-1 px-5 pb-6 pt-[18px] flex flex-col gap-[18px]">
        <h2 className="font-black text-[16px] text-primary">
          답변 <span className="text-brand">{answers.length}</span>
        </h2>

        {answers.map((answer) => (
          <AnswerItem key={answer.id} answer={answer} />
        ))}
      </section>

      <AnswerInput />
    </div>
  );
}
