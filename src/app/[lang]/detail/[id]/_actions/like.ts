"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { ANSWERS_COLLECTION, QUESTIONS_COLLECTION } from "@/lib/collections";
import { toggleLike } from "@/lib/likes";
import { createNotification, removeNotification } from "@/lib/notifications";
import { revalidateQuestion } from "./revalidate";

export async function toggleQuestionLikeAction(
  questionId: string,
): Promise<void> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logout");
  }

  const { liked, authorId } = await toggleLike(
    QUESTIONS_COLLECTION,
    questionId,
    user.uid,
  );

  const notification = {
    actorId: user.uid,
    type: "question-like",
    questionId,
  } as const;

  after(() =>
    liked
      ? createNotification({ recipientId: authorId, ...notification })
      : removeNotification(authorId, notification),
  );

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

  const { liked, authorId } = await toggleLike(
    ANSWERS_COLLECTION,
    answerId,
    user.uid,
  );

  const notification = {
    actorId: user.uid,
    type: "answer-like",
    questionId,
    answerId,
  } as const;

  after(() =>
    liked
      ? createNotification({ recipientId: authorId, ...notification })
      : removeNotification(authorId, notification),
  );

  revalidateQuestion(questionId);
}
