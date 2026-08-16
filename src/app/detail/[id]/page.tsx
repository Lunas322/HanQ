import { notFound, redirect } from "next/navigation";

import { AnswerInput } from "@/app/components/AnswerInput";
import { AnswerItem } from "@/app/components/AnswerItem";
import { QuestionDetail } from "@/app/components/QuestionDetail";
import { findCategory } from "@/lib/categories";
import { listAnswers } from "@/lib/answers";
import { getCurrentUser } from "@/lib/auth";
import { QUESTIONS_COLLECTION } from "@/lib/collections";
import { hasLiked } from "@/lib/likes";
import { getQuestion } from "@/lib/questions";

interface DetailProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: DetailProps) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  const [question, liked, answers] = await Promise.all([
    getQuestion(id),
    hasLiked(QUESTIONS_COLLECTION, id, user.uid),
    listAnswers(id, user.uid),
  ]);

  if (!question) notFound();

  const category = findCategory(question.categoryId);

  return (
    <div className="min-h-dvh flex flex-col bg-surface">
      <QuestionDetail question={question} category={category} liked={liked} />

      <div className="bg-muted w-full h-2 shrink-0" />

      <section className="flex-1 px-5 pb-6 pt-[18px] flex flex-col gap-[18px]">
        <h2 className="font-black text-[16px] text-primary">
          답변 <span className="text-brand">{answers.length}</span>
        </h2>

        {answers.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-tertiary">
            아직 답변이 없어요. 첫 답변을 남겨보세요.
          </p>
        ) : (
          answers.map((answer) => (
            <AnswerItem key={answer.id} answer={answer} />
          ))
        )}
      </section>

      <AnswerInput questionId={id} />
    </div>
  );
}
