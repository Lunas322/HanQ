import type { FormErrorCode } from "@/lib/form-errors";

export const ANSWER_MAX = 500;

export type AnswerErrorCode = Extract<
  FormErrorCode,
  "ANSWER_REQUIRED" | "ANSWER_TOO_LONG"
>;

export function validateAnswerContent(
  content: string,
): AnswerErrorCode | null {
  if (content.length === 0) {
    return "ANSWER_REQUIRED";
  }

  if (content.length > ANSWER_MAX) {
    return "ANSWER_TOO_LONG";
  }

  return null;
}
