import type { User } from "./questions";

export type Profile = User & {
  questionCount: number;
  answerCount: number;
  receivedLikeCount: number;
};

export const ME: Profile = {
  id: "u1",
  name: "유리",
  languages: "ko",
  questionCount: 2,
  answerCount: 2,
  receivedLikeCount: 27,
};
