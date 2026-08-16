import { isCategoryId } from "@/lib/categories";
import type { FormErrorCode } from "@/lib/form-errors";

export const TITLE_MAX = 60;
export const CONTENT_MAX = 1000;

export type QuestionDraft = {
  title: string;
  content: string;
  categoryId: string;
};

export type QuestionErrorCode = Extract<
  FormErrorCode,
  | "TITLE_REQUIRED"
  | "TITLE_TOO_LONG"
  | "CONTENT_REQUIRED"
  | "CONTENT_TOO_LONG"
  | "CATEGORY_REQUIRED"
>;

export function validateQuestionDraft(
  draft: QuestionDraft,
): QuestionErrorCode | null {
  if (draft.title.length === 0) {
    return "TITLE_REQUIRED";
  }

  if (draft.title.length > TITLE_MAX) {
    return "TITLE_TOO_LONG";
  }

  if (draft.content.length === 0) {
    return "CONTENT_REQUIRED";
  }

  if (draft.content.length > CONTENT_MAX) {
    return "CONTENT_TOO_LONG";
  }

  if (!isCategoryId(draft.categoryId)) {
    return "CATEGORY_REQUIRED";
  }

  return null;
}
