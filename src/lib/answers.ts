import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import type { Answer } from "@/types/answer";
import { avatarColorFor, fallbackAuthor, loadAuthorsFor } from "./authors";
import {
  ANSWERS_COLLECTION,
  QUESTIONS_COLLECTION,
  USERS_COLLECTION,
} from "./collections";
import { adminDb } from "./firebase-admin";
import { readDate, readNumber, readString } from "./firestore-value";
import { filterLiked } from "./likes";
import { formatRelativeTime } from "./format";
import { getCurrentLanguage } from "./locale";

const LIST_LIMIT = 100;

type CreateAnswerInput = {
  questionId: string;
  authorId: string;
  content: string;
};

export async function createAnswer({
  questionId,
  authorId,
  content,
}: CreateAnswerInput): Promise<string> {
  const answerRef = adminDb.collection(ANSWERS_COLLECTION).doc();
  const questionRef = adminDb.collection(QUESTIONS_COLLECTION).doc(questionId);
  const authorRef = adminDb.collection(USERS_COLLECTION).doc(authorId);

  const batch = adminDb.batch();

  batch.set(answerRef, {
    questionId,
    authorId,
    content,
    likeCount: 0,
    createdAt: FieldValue.serverTimestamp(),
  });

  batch.update(questionRef, { answerCount: FieldValue.increment(1) });
  batch.update(authorRef, { answerCount: FieldValue.increment(1) });

  await batch.commit();

  return answerRef.id;
}

export async function listAnswers(
  questionId: string,
  viewerId: string,
): Promise<Answer[]> {
  const snapshot = await adminDb
    .collection(ANSWERS_COLLECTION)
    .where("questionId", "==", questionId)
    .orderBy("createdAt", "asc")
    .limit(LIST_LIMIT)
    .get();

  const language = await getCurrentLanguage();

  const [authors, likedIds] = await Promise.all([
    loadAuthorsFor(snapshot.docs, language),
    filterLiked(
      ANSWERS_COLLECTION,
      snapshot.docs.map((doc) => doc.id),
      viewerId,
    ),
  ]);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const authorId = readString(data.authorId);
    const author = authors.get(authorId) ?? fallbackAuthor(language);

    return {
      id: doc.id,
      questionId: readString(data.questionId),
      author: {
        id: authorId,
        name: author.name,
        language: author.languages,
        avatarColor: avatarColorFor(authorId),
      },
      content: readString(data.content),
      likeCount: readNumber(data.likeCount),
      liked: likedIds.has(doc.id),
      time: formatRelativeTime(readDate(data.createdAt), language),
    };
  });
}

export async function listAnsweredQuestionIds(
  authorId: string,
): Promise<string[]> {
  const snapshot = await adminDb
    .collection(ANSWERS_COLLECTION)
    .where("authorId", "==", authorId)
    .orderBy("createdAt", "desc")
    .limit(LIST_LIMIT)
    .get();

  return [
    ...new Set(snapshot.docs.map((doc) => readString(doc.get("questionId")))),
  ].filter(Boolean);
}
