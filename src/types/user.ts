import type { Language } from "./language";

export type AvatarColor = "blue" | "purple" | "red" | "green";

export type User = {
  id: string;
  name: string;
  languages: Language;
  photoUrl: string | null;
};

export type Profile = User & {
  questionCount: number;
  answerCount: number;
  receivedLikeCount: number;
};
