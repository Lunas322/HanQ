"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { ANSWERS_COLLECTION, QUESTIONS_COLLECTION } from "@/lib/collections";
import { toggleLike } from "@/lib/likes";
import { revalidateQuestion } from "./revalidate";

export async function toggleQuestionLikeAction(
  questionId: string,
): Promise<void> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logout");
  }

  await toggleLike(QUESTIONS_COLLECTION, questionId, user.uid);

  revalidateQuestion(questionId);
}

export async function toggleAnswerLikeAction(
  answerId: string,
  questionId: string,
): Promise<void> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logout");
  }

  await toggleLike(ANSWERS_COLLECTION, answerId, user.uid);

  revalidateQuestion(questionId);
}
