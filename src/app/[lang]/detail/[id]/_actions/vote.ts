"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { votePoll } from "@/lib/polls";
import { revalidateQuestion } from "./revalidate";

export async function voteAction(
  questionId: string,
  optionId: string,
): Promise<boolean> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logout");
  }

  try {
    await votePoll(questionId, user.uid, optionId);
  } catch (e) {
    console.error("[voteAction]", questionId, optionId, e);
    return false;
  }

  revalidateQuestion(questionId);

  return true;
}
