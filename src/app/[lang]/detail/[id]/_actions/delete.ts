"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getCurrentLanguage } from "@/lib/locale";
import { localePath } from "@/lib/routes";
import type { FormErrorCode } from "@/lib/form-errors";
import { deleteAnswer } from "@/lib/answers";
import { deleteQuestion } from "@/lib/questions";
import { revalidateQuestion } from "./revalidate";

export async function deleteQuestionAction(
  questionId: string,
): Promise<FormErrorCode | null> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logout");
  }

  let result;

  try {
    result = await deleteQuestion(questionId, user.uid);
  } catch (e) {
    console.error("[deleteQuestionAction]", e);
    return "QUESTION_DELETE_FAILED";
  }

  if (result === "not-found") {
    return "QUESTION_NOT_FOUND";
  }

  if (result === "forbidden") {
    return "QUESTION_DELETE_FORBIDDEN";
  }

  revalidateQuestion(questionId);

  redirect(localePath(await getCurrentLanguage(), "/home"));
}

export async function deleteAnswerAction(
  answerId: string,
  questionId: string,
): Promise<FormErrorCode | null> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logout");
  }

  let result;

  try {
    result = await deleteAnswer(answerId, user.uid);
  } catch (e) {
    console.error("[deleteAnswerAction]", e);
    return "ANSWER_DELETE_FAILED";
  }

  if (result === "not-found") {
    return "ANSWER_NOT_FOUND";
  }

  if (result === "forbidden") {
    return "ANSWER_DELETE_FORBIDDEN";
  }

  revalidateQuestion(questionId);

  return null;
}
