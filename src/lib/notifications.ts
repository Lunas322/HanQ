import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import {
  ANSWERS_COLLECTION,
  NOTIFICATIONS_SUBCOLLECTION,
  QUESTIONS_COLLECTION,
  USERS_COLLECTION,
} from "./collections";
import { adminDb } from "./firebase-admin";
import {
  readDate,
  readLocalizedText,
  readString,
} from "./firestore-value";
import { formatRelativeTime } from "./format";
import { getCurrentLanguage } from "./locale";
import { resolveDisplayName } from "./user";
import { isLanguage, type Language } from "@/types/language";
import {
  isNotificationType,
  type Notification,
  type NotificationType,
} from "@/types/notification";

const LIST_LIMIT = 50;
const PREVIEW_MAX = 40;

type NotificationInput = {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  questionId: string;
  answerId?: string;
};

function notificationsRef(uid: string) {
  return adminDb
    .collection(USERS_COLLECTION)
    .doc(uid)
    .collection(NOTIFICATIONS_SUBCOLLECTION);
}

function notificationId({
  type,
  actorId,
  questionId,
  answerId,
}: Omit<NotificationInput, "recipientId">): string {
  if (type === "answer") {
    return `answer_${answerId}`;
  }

  if (type === "answer-like") {
    return `alike_${answerId}_${actorId}`;
  }

  return `qlike_${questionId}_${actorId}`;
}

export async function createNotification(
  input: NotificationInput,
): Promise<void> {
  const { recipientId, actorId, type, questionId, answerId } = input;

  if (!recipientId || recipientId === actorId) {
    return;
  }

  await notificationsRef(recipientId)
    .doc(notificationId(input))
    .set({
      type,
      actorId,
      questionId,
      ...(answerId ? { answerId } : {}),
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    });
}

export async function removeNotification(
  recipientId: string,
  input: Omit<NotificationInput, "recipientId">,
): Promise<void> {
  if (!recipientId || recipientId === input.actorId) {
    return;
  }

  await notificationsRef(recipientId).doc(notificationId(input)).delete();
}

export async function notifyAnswer(input: {
  questionId: string;
  answerId: string;
  actorId: string;
}): Promise<void> {
  const question = await adminDb
    .collection(QUESTIONS_COLLECTION)
    .doc(input.questionId)
    .get();

  await createNotification({
    recipientId: readString(question.get("authorId")),
    actorId: input.actorId,
    type: "answer",
    questionId: input.questionId,
    answerId: input.answerId,
  });
}

export async function countUnreadNotifications(uid: string): Promise<number> {
  const snapshot = await notificationsRef(uid)
    .where("read", "==", false)
    .count()
    .get();

  return snapshot.data().count;
}

export async function markNotificationsRead(uid: string): Promise<void> {
  const snapshot = await notificationsRef(uid)
    .where("read", "==", false)
    .limit(LIST_LIMIT)
    .get();

  if (snapshot.empty) {
    return;
  }

  const batch = adminDb.batch();

  for (const doc of snapshot.docs) {
    batch.update(doc.ref, { read: true });
  }

  await batch.commit();
}

function truncate(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();

  return flat.length > PREVIEW_MAX ? `${flat.slice(0, PREVIEW_MAX)}…` : flat;
}

async function loadByIds(collection: string, ids: string[]) {
  if (ids.length === 0) {
    return new Map<string, FirebaseFirestore.DocumentSnapshot>();
  }

  const refs = ids.map((id) => adminDb.collection(collection).doc(id));
  const snapshots = await adminDb.getAll(...refs);

  return new Map(snapshots.map((snapshot) => [snapshot.id, snapshot]));
}

function previewFor(
  snapshot: FirebaseFirestore.DocumentSnapshot | undefined,
  field: string,
  language: Language,
): string | null {
  if (!snapshot?.exists) {
    return null;
  }

  const source = isLanguage(snapshot.get("sourceLanguage"))
    ? snapshot.get("sourceLanguage")
    : language;

  return truncate(readLocalizedText(snapshot.get(field), language, source));
}

export async function listNotifications(uid: string): Promise<Notification[]> {
  const language = await getCurrentLanguage();

  const snapshot = await notificationsRef(uid)
    .orderBy("createdAt", "desc")
    .limit(LIST_LIMIT)
    .get();

  const unique = (values: string[]) => [...new Set(values.filter(Boolean))];

  const [actors, questions, answers] = await Promise.all([
    loadByIds(
      USERS_COLLECTION,
      unique(snapshot.docs.map((doc) => readString(doc.get("actorId")))),
    ),
    loadByIds(
      QUESTIONS_COLLECTION,
      unique(snapshot.docs.map((doc) => readString(doc.get("questionId")))),
    ),
    loadByIds(
      ANSWERS_COLLECTION,
      unique(snapshot.docs.map((doc) => readString(doc.get("answerId")))),
    ),
  ]);

  return snapshot.docs.flatMap((doc) => {
    const type = doc.get("type");

    if (!isNotificationType(type)) {
      return [];
    }

    const questionId = readString(doc.get("questionId"));
    const answerId = readString(doc.get("answerId"));

    const preview =
      type === "question-like"
        ? previewFor(questions.get(questionId), "title", language)
        : previewFor(answers.get(answerId), "content", language);

    if (preview === null) {
      return [];
    }

    return [
      {
        id: doc.id,
        type,
        actorName: resolveDisplayName(
          actors.get(readString(doc.get("actorId")))?.get("name"),
          language,
        ),
        questionId,
        preview,
        time: formatRelativeTime(readDate(doc.get("createdAt")), language),
        read: doc.get("read") === true,
      },
    ];
  });
}
