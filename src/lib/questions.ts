import "server-only";

import {
  type DocumentSnapshot,
  FieldValue,
  type Query,
} from "firebase-admin/firestore";
import { cache } from "react";

import type { Question } from "@/types/question";
import { type Author, fallbackAuthor, loadAuthorsFor } from "./authors";
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
import { formatRelativeTime } from "./format";
import { getCurrentLanguage } from "./locale";
import { isLanguage, type Language } from "@/types/language";
import type { QuestionDraft } from "./question-rules";

const LIST_LIMIT = 50;

type CreateQuestionInput = QuestionDraft & {
  authorId: string;
};

export async function createQuestion({
  authorId,
  title,
  content,
  categoryId,
}: CreateQuestionInput): Promise<string> {
  const questionRef = adminDb.collection(QUESTIONS_COLLECTION).doc();
  const authorRef = adminDb.collection(USERS_COLLECTION).doc(authorId);

  const { language: sourceLanguage } = detectLanguage(
    `${title}\n${content}`,
    await getCurrentLanguage(),
  );

  const batch = adminDb.batch();

  batch.set(questionRef, {
    authorId,
    title: { [sourceLanguage]: title },
    content: { [sourceLanguage]: content },
    sourceLanguage,
    translationStatus: "pending",
    categoryId,
    likeCount: 0,
    answerCount: 0,
    createdAt: FieldValue.serverTimestamp(),
  });

  batch.update(authorRef, {
    questionCount: FieldValue.increment(1),
  });

  await batch.commit();

  return questionRef.id;
}

function toQuestion(
  doc: DocumentSnapshot,
  authors: Map<string, Author>,
  language: Language,
): Question {
  const data = doc.data() ?? {};
  const authorId = readString(data.authorId);
  const author = authors.get(authorId) ?? fallbackAuthor(language);

  const sourceLanguage = isLanguage(data.sourceLanguage)
    ? data.sourceLanguage
    : language;

  const translationPending =
    language !== sourceLanguage &&
    readTranslationStatus(data.translationStatus) !== "done";

  const isTranslated = language !== sourceLanguage && !translationPending;

  return {
    id: doc.id,
    user: {
      id: authorId,
      name: author.name,
      languages: author.languages,
      photoUrl: author.photoUrl,
    },
    title: readLocalizedText(data.title, language, sourceLanguage),
    content: readLocalizedText(data.content, language, sourceLanguage),
    sourceLanguage,
    translationPending,
    original: isTranslated
      ? {
          title: readLocalizedText(data.title, sourceLanguage, sourceLanguage),
          content: readLocalizedText(
            data.content,
            sourceLanguage,
            sourceLanguage,
          ),
        }
      : null,
    likeCount: readNumber(data.likeCount),
    commentCount: readNumber(data.answerCount),
    time: formatRelativeTime(readDate(data.createdAt), language),
    categoryId: readString(data.categoryId),
  };
}

type ListQuestionsOptions = {
  authorId?: string;
};

export async function listQuestions({
  authorId,
}: ListQuestionsOptions = {}): Promise<Question[]> {
  const collection = adminDb.collection(QUESTIONS_COLLECTION);
  const filtered: Query = authorId
    ? collection.where("authorId", "==", authorId)
    : collection;

  const language = await getCurrentLanguage();

  const snapshot = await filtered
    .orderBy("createdAt", "desc")
    .limit(LIST_LIMIT)
    .get();

  const authors = await loadAuthorsFor(snapshot.docs, language);

  return snapshot.docs.map((doc) => toQuestion(doc, authors, language));
}

export async function getQuestionsByIds(ids: string[]): Promise<Question[]> {
  if (ids.length === 0) {
    return [];
  }

  const refs = ids.map((id) => adminDb.collection(QUESTIONS_COLLECTION).doc(id));
  const snapshots = (await adminDb.getAll(...refs)).filter(
    (snapshot) => snapshot.exists,
  );

  const language = await getCurrentLanguage();
  const authors = await loadAuthorsFor(snapshots, language);

  return snapshots.map((snapshot) => toQuestion(snapshot, authors, language));
}

export const getQuestion = cache(async (id: string): Promise<Question | null> => {
  const snapshot = await adminDb.collection(QUESTIONS_COLLECTION).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  const language = await getCurrentLanguage();
  const authors = await loadAuthorsFor([snapshot], language);

  return toQuestion(snapshot, authors, language);
});

type CountDelta = {
  questions: number;
  answers: number;
  likes: number;
};

export type DeleteQuestionResult = "ok" | "not-found" | "forbidden";

export async function deleteQuestion(
  questionId: string,
  requesterId: string,
): Promise<DeleteQuestionResult> {
  const questionRef = adminDb.collection(QUESTIONS_COLLECTION).doc(questionId);
  const snapshot = await questionRef.get();

  if (!snapshot.exists) {
    return "not-found";
  }

  const authorId = readString(snapshot.get("authorId"));

  if (authorId !== requesterId) {
    return "forbidden";
  }

  const answers = await adminDb
    .collection(ANSWERS_COLLECTION)
    .where("questionId", "==", questionId)
    .get();

  const deltas = new Map<string, CountDelta>();

  const addDelta = (uid: string, delta: Partial<CountDelta>) => {
    if (!uid) return;

    const current = deltas.get(uid) ?? { questions: 0, answers: 0, likes: 0 };

    deltas.set(uid, {
      questions: current.questions + (delta.questions ?? 0),
      answers: current.answers + (delta.answers ?? 0),
      likes: current.likes + (delta.likes ?? 0),
    });
  };

  addDelta(authorId, {
    questions: 1,
    likes: readNumber(snapshot.get("likeCount")),
  });

  for (const answer of answers.docs) {
    addDelta(readString(answer.get("authorId")), {
      answers: 1,
      likes: readNumber(answer.get("likeCount")),
    });
  }

  await Promise.all([
    adminDb.recursiveDelete(questionRef),
    ...answers.docs.map((answer) => adminDb.recursiveDelete(answer.ref)),
  ]);

  const batch = adminDb.batch();

  for (const [uid, delta] of deltas) {
    batch.update(adminDb.collection(USERS_COLLECTION).doc(uid), {
      questionCount: FieldValue.increment(-delta.questions),
      answerCount: FieldValue.increment(-delta.answers),
      receivedLikeCount: FieldValue.increment(-delta.likes),
    });
  }

  try {
    await batch.commit();
  } catch (e) {
    console.error("[deleteQuestion] 카운터 정리 실패", questionId, e);
  }

  return "ok";
}
