import type { Language } from "./language";
import type { User } from "./user";

export type Question = {
  id: string;
  user: User;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  time: string;
  createdAt: string;
  categoryId: string;
  sourceLanguage: Language;
  translationPending: boolean;
  original: { title: string; content: string } | null;
};
