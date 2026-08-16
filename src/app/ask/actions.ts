"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import type { FormErrorCode } from "@/lib/form-errors";
import { validateQuestionDraft } from "@/lib/question-rules";
import { createQuestion } from "@/lib/questions";

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

  const error = validateQuestionDraft(draft);

  if (error) {
    return { error };
  }

  try {
    await createQuestion({ authorId: user.uid, ...draft });
  } catch (e) {
    console.error("[submitQuestion]", e);
    return { error: "QUESTION_SUBMIT_FAILED" };
  }

  redirect("/home");
}
