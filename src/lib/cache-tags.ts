export const QUESTIONS_TAG = "questions";

export const USERS_TAG = "users";

export function questionTag(questionId: string): string {
  return `question:${questionId}`;
}

export function answersTag(questionId: string): string {
  return `answers:${questionId}`;
}
