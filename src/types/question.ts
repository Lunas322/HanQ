import type { User } from "./user";

export type Question = {
  id: string;
  user: User;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  time: string;
  categoryId: string;
};
