import type { Language } from "./language";
import type { AvatarColor } from "./user";

export type Answer = {
  id: string;
  questionId: string;
  author: {
    id: string;
    name: string;
    language: Language;
    avatarColor: AvatarColor;
  };
  content: string;
  likeCount: number;
  liked: boolean;
  time: string;
};
