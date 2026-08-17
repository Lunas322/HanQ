import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { unstable_cache } from "next/cache";

import type { Answer } from "@/types/answer";
import { avatarColorFor, fallbackAuthor, loadAuthors } from "./authors";
import {
  ANSWERS_COLLECTION,
  QUESTIONS_COLLECTION,
  USERS_COLLECTION,
} from "./collections";
import { answersTag } from "./cache-tags";
import { adminDb } from "./firebase-admin";
import {
  readDate,
  readLocalizedText,
  readNumber,
  readString,
  readTranslationStatus,
} from "./firestore-value";
import { detectLanguage } from "./detect-language";
import { isLanguage, type Language } from "@/types/language";
import { filterLiked } from "./likes";
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

type RawAnswer = {
  id: string;
  questionId: string;
  authorId: string;
  content: unknown;
  likeCount: number;
  sourceLanguage: string;
  translationStatus: string;
  createdAt: string;
};

const fetchAnswers = unstable_cache(
  async (questionId: string): Promise<RawAnswer[]> => {
    const snapshot = await adminDb
      .collection(ANSWERS_COLLECTION)
      .where("questionId", "==", questionId)
      .orderBy("createdAt", "asc")
      .limit(LIST_LIMIT)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        questionId: readString(data.questionId),
        authorId: readString(data.authorId),
        content: data.content ?? null,
        likeCount: readNumber(data.likeCount),
        sourceLanguage: readString(data.sourceLanguage),
        translationStatus: readString(data.translationStatus),
        createdAt: readDate(data.createdAt).toISOString(),
      };
    });
  },
  ["answer-list"],
  { tags: [], revalidate: 300 },
);

export async function listAnswers(
  questionId: string,
  viewerId: string,
  language: Language,
): Promise<Answer[]> {
  const raws = await unstable_cache(
    () => fetchAnswers(questionId),
    ["answers", questionId],
    { tags: [answersTag(questionId)], revalidate: 300 },
  )();

  const [authors, likedIds] = await Promise.all([
    loadAuthors(
      raws.map((raw) => raw.authorId),
      language,
    ),
    viewerId
      ? filterLiked(
          ANSWERS_COLLECTION,
          raws.map((raw) => raw.id),
          viewerId,
        )
      : new Set<string>(),
  ]);

  return raws.map((raw) => {
    const author = authors.get(raw.authorId) ?? fallbackAuthor(language);

    const sourceLanguage = isLanguage(raw.sourceLanguage)
      ? raw.sourceLanguage
      : language;

    const pending =
      language !== sourceLanguage &&
      readTranslationStatus(raw.translationStatus) !== "done";

    return {
      id: raw.id,
      questionId: raw.questionId,
      author: {
        id: raw.authorId,
        name: author.name,
        language: author.languages,
        avatarColor: avatarColorFor(raw.authorId),
        photoUrl: author.photoUrl,
      },
      content: readLocalizedText(raw.content, language, sourceLanguage),
      likeCount: raw.likeCount,
      liked: likedIds.has(raw.id),
      isMine: viewerId !== "" && raw.authorId === viewerId,
      createdAt: raw.createdAt,
      sourceLanguage,
      translationPending: pending,
      original:
        language !== sourceLanguage && !pending
          ? {
              content: readLocalizedText(
                raw.content,
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
