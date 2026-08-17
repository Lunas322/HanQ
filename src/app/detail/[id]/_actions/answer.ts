"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";

import { validateAnswerContent } from "@/lib/answer-rules";
import { createAnswer } from "@/lib/answers";
import { translateAnswer } from "@/lib/translations";
import { getCurrentUser } from "@/lib/auth";
import type { FormErrorCode } from "@/lib/form-errors";
import { revalidateQuestion } from "./revalidate";

export type AnswerFormState = {
  error: FormErrorCode | null;
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
    return { error: "QUESTION_NOT_FOUND" };
  }

  const error = validateAnswerContent(content);

  if (error) {
    return { error };
  }

  let answerId: string;

  try {
    answerId = await createAnswer({ questionId, authorId: user.uid, content });
  } catch (e) {
    console.error("[submitAnswer]", e);
    return { error: "ANSWER_SUBMIT_FAILED" };
  }

  after(() => translateAnswer(answerId));

  revalidateQuestion(questionId);

  return { error: null };
}
