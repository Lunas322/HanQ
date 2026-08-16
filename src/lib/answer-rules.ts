export const ANSWER_MAX = 500;

export function validateAnswerContent(content: string): string | null {
  if (content.length === 0) {
    return "답변을 입력해 주세요.";
  }

  if (content.length > ANSWER_MAX) {
    return `답변은 ${ANSWER_MAX}자까지 쓸 수 있어요.`;
  }

  return null;
}
