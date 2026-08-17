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
    photoUrl: string | null;
  };
  content: string;
  likeCount: number;
  liked: boolean;
  isMine: boolean;
  time: string;
  createdAt: string;
  sourceLanguage: Language;
  translationPending: boolean;
  original: { content: string } | null;
};
