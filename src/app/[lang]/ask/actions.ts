"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { getCurrentLanguage } from "@/lib/locale";
import { localePath } from "@/lib/routes";
import type { FormErrorCode } from "@/lib/form-errors";
import { validatePollLabels } from "@/lib/poll-rules";
import { validateQuestionDraft } from "@/lib/question-rules";
import { QUESTIONS_TAG } from "@/lib/cache-tags";
import { createQuestion } from "@/lib/questions";
import { translateQuestion } from "@/lib/translations";

export type AskFormState = {
  error: FormErrorCode | null;
};

export async function submitQuestion(
  _prevState: AskFormState,
  formData: FormData,
): Promise<AskFormState> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logout");
  }

  const draft = {
    title: String(formData.get("title") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    categoryId: String(formData.get("categoryId") ?? ""),
  };

  const pollLabels = formData
    .getAll("pollOption")
    .map((value) => String(value).trim());

  const error = validateQuestionDraft(draft) ?? validatePollLabels(pollLabels);

  if (error) {
    return { error };
  }

  let questionId: string;

  try {
    questionId = await createQuestion({
      authorId: user.uid,
      pollLabels,
      ...draft,
    });
  } catch (e) {
    console.error("[submitQuestion]", e);
    return { error: "QUESTION_SUBMIT_FAILED" };
  }

  updateTag(QUESTIONS_TAG);

  after(() => translateQuestion(questionId));

  redirect(localePath(await getCurrentLanguage(), "/home"));
}
