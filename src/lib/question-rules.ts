import { CATEGORIES } from "@/lib/categories";

export const TITLE_MAX = 60;
export const CONTENT_MAX = 1000;

export type QuestionDraft = {
  title: string;
  content: string;
  categoryId: string;
};

export function validateQuestionDraft(draft: QuestionDraft): string | null {
  if (draft.title.length === 0) {
    return "제목을 입력해 주세요.";
  }

  if (draft.title.length > TITLE_MAX) {
    return `제목은 ${TITLE_MAX}자까지 쓸 수 있어요.`;
  }

  if (draft.content.length === 0) {
    return "내용을 입력해 주세요.";
  }

  if (draft.content.length > CONTENT_MAX) {
    return `내용은 ${CONTENT_MAX}자까지 쓸 수 있어요.`;
  }

  if (!CATEGORIES.some((category) => category.id === draft.categoryId)) {
    return "카테고리를 선택해 주세요.";
  }

  return null;
}
