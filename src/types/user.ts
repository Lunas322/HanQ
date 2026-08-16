import type { Language } from "./language";

export type AvatarColor = "blue" | "purple" | "red" | "green";

export type User = {
  id: string;
  name: string;
  languages: Language;
};

export type Profile = User & {
  questionCount: number;
  answerCount: number;
  receivedLikeCount: number;
};
