export const NOTIFICATION_TYPES = [
  "answer",
  "question-like",
  "answer-like",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export function isNotificationType(value: unknown): value is NotificationType {
  return NOTIFICATION_TYPES.includes(value as NotificationType);
}

export type Notification = {
  id: string;
  type: NotificationType;
  actorName: string;
  actorPhotoUrl: string | null;
  questionId: string;
  preview: string;
  time: string;
  read: boolean;
};
