"use server";

import { redirect } from "next/navigation";

import { validateAnswerContent } from "@/lib/answer-rules";
import { createAnswer } from "@/lib/answers";
import { getCurrentUser } from "@/lib/auth";
import { revalidateQuestion } from "./revalidate";

export type AnswerFormState = {
  error: string | null;
};

export async function submitAnswer(
  _prevState: AnswerFormState,
  formData: FormData,
): Promise<AnswerFormState> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logout");
  }

  const questionId = String(formData.get("questionId") ?? "");
  const content = String(formData.get("answer") ?? "").trim();

  if (!questionId) {
    return { error: "질문을 찾을 수 없어요." };
  }

  const error = validateAnswerContent(content);

  if (error) {
    return { error };
  }

  try {
    await createAnswer({ questionId, authorId: user.uid, content });
  } catch (e) {
    console.error("[submitAnswer]", e);
    return { error: "답변 등록에 실패했어요. 다시 시도해 주세요." };
  }

  revalidateQuestion(questionId);

  return { error: null };
}
