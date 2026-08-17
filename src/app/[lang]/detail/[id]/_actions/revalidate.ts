import { updateTag } from "next/cache";

import { answersTag, questionTag, QUESTIONS_TAG } from "@/lib/cache-tags";

export function revalidateQuestion(questionId: string): void {
  updateTag(QUESTIONS_TAG);
  updateTag(questionTag(questionId));
  updateTag(answersTag(questionId));
}
