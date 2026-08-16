"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { validateQuestionDraft } from "@/lib/question-rules";
import { createQuestion } from "@/lib/questions";

export type AskFormState = {
  error: string | null;
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
    return { error: "질문 등록에 실패했어요. 다시 시도해 주세요." };
  }

  redirect("/home");
}
