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
import {
  readDate,
  readLocalizedText,
  readNumber,
  readString,
  readTranslationStatus,
} from "./firestore-value";
import { detectLanguage } from "./detect-language";
import { isLanguage } from "@/types/language";
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

  const { language: sourceLanguage } = detectLanguage(
    content,
    await getCurrentLanguage(),
  );

  const batch = adminDb.batch();

  batch.set(answerRef, {
    questionId,
    authorId,
    content: { [sourceLanguage]: content },
    sourceLanguage,
    translationStatus: "pending",
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
    viewerId
      ? filterLiked(
          ANSWERS_COLLECTION,
          snapshot.docs.map((doc) => doc.id),
          viewerId,
        )
      : new Set<string>(),
  ]);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const authorId = readString(data.authorId);
    const author = authors.get(authorId) ?? fallbackAuthor(language);

    const sourceLanguage = isLanguage(data.sourceLanguage)
      ? data.sourceLanguage
      : language;

    const pending =
      language !== sourceLanguage &&
      readTranslationStatus(data.translationStatus) !== "done";

    return {
      id: doc.id,
      questionId: readString(data.questionId),
      author: {
        id: authorId,
        name: author.name,
        language: author.languages,
        avatarColor: avatarColorFor(authorId),
        photoUrl: author.photoUrl,
      },
      content: readLocalizedText(data.content, language, sourceLanguage),
      likeCount: readNumber(data.likeCount),
      liked: likedIds.has(doc.id),
      isMine: viewerId !== "" && authorId === viewerId,
      time: formatRelativeTime(readDate(data.createdAt), language),
      sourceLanguage,
      translationPending: pending,
      original:
        language !== sourceLanguage && !pending
          ? {
              content: readLocalizedText(
                data.content,
                sourceLanguage,
                sourceLanguage,
              ),
            }
          : null,
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

export type DeleteAnswerResult = "ok" | "not-found" | "forbidden";

export async function deleteAnswer(
  answerId: string,
  requesterId: string,
): Promise<DeleteAnswerResult> {
  const answerRef = adminDb.collection(ANSWERS_COLLECTION).doc(answerId);
  const snapshot = await answerRef.get();

  if (!snapshot.exists) {
    return "not-found";
  }

  const authorId = readString(snapshot.get("authorId"));

  if (authorId !== requesterId) {
    return "forbidden";
  }

  const questionId = readString(snapshot.get("questionId"));
  const likeCount = readNumber(snapshot.get("likeCount"));

  await adminDb.recursiveDelete(answerRef);

  const batch = adminDb.batch();

  batch.update(adminDb.collection(USERS_COLLECTION).doc(authorId), {
    answerCount: FieldValue.increment(-1),
    receivedLikeCount: FieldValue.increment(-likeCount),
  });

  if (questionId) {
    batch.update(adminDb.collection(QUESTIONS_COLLECTION).doc(questionId), {
      answerCount: FieldValue.increment(-1),
    });
  }

  try {
    await batch.commit();
  } catch (e) {
    console.error("[deleteAnswer] 카운터 정리 실패", answerId, e);
  }

  return "ok";
}
