import "server-only";

import { FieldValue, type DocumentSnapshot, type Query } from "firebase-admin/firestore";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import type { Question } from "@/types/question";
import { type Author, fallbackAuthor, loadAuthors } from "./authors";
import {
  ANSWERS_COLLECTION,
  QUESTIONS_COLLECTION,
  USERS_COLLECTION,
} from "./collections";
import { QUESTIONS_TAG } from "./cache-tags";
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

type RawQuestion = {
  id: string;
  authorId: string;
  title: unknown;
  content: unknown;
  categoryId: string;
  likeCount: number;
  answerCount: number;
  sourceLanguage: string;
  translationStatus: string;
  createdAt: string;
};

function toRaw(doc: DocumentSnapshot): RawQuestion {
  const data = doc.data() ?? {};

  return {
    id: doc.id,
    authorId: readString(data.authorId),
    title: data.title ?? null,
    content: data.content ?? null,
    categoryId: readString(data.categoryId),
    likeCount: readNumber(data.likeCount),
    answerCount: readNumber(data.answerCount),
    sourceLanguage: readString(data.sourceLanguage),
    translationStatus: readString(data.translationStatus),
    createdAt: readDate(data.createdAt).toISOString(),
  };
}

function toQuestion(
  data: RawQuestion,
  authors: Map<string, Author>,
  language: Language,
): Question {
  const authorId = data.authorId;
  const author = authors.get(authorId) ?? fallbackAuthor(language);

  const sourceLanguage = isLanguage(data.sourceLanguage)
    ? data.sourceLanguage
    : language;

  const translationPending =
    language !== sourceLanguage &&
    readTranslationStatus(data.translationStatus) !== "done";

  const isTranslated = language !== sourceLanguage && !translationPending;

  return {
    id: data.id,
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
    likeCount: data.likeCount,
    commentCount: data.answerCount,
    time: formatRelativeTime(new Date(data.createdAt), language),
    createdAt: data.createdAt,
    categoryId: data.categoryId,
  };
}

const fetchQuestionList = unstable_cache(
  async (authorId: string | null): Promise<RawQuestion[]> => {
    const collection = adminDb.collection(QUESTIONS_COLLECTION);
    const filtered: Query = authorId
      ? collection.where("authorId", "==", authorId)
      : collection;

    const snapshot = await filtered
      .orderBy("createdAt", "desc")
      .limit(LIST_LIMIT)
      .get();

    return snapshot.docs.map(toRaw);
  },
  ["question-list"],
  { tags: [QUESTIONS_TAG], revalidate: 300 },
);

const fetchQuestionsByIds = unstable_cache(
  async (ids: string[]): Promise<RawQuestion[]> => {
    if (ids.length === 0) {
      return [];
    }

    const refs = ids.map((id) =>
      adminDb.collection(QUESTIONS_COLLECTION).doc(id),
    );

    return (await adminDb.getAll(...refs))
      .filter((snapshot) => snapshot.exists)
      .map(toRaw);
  },
  ["question-by-ids"],
  { tags: [QUESTIONS_TAG], revalidate: 300 },
);

async function hydrate(
  raws: RawQuestion[],
  language: Language,
): Promise<Question[]> {
  const authors = await loadAuthors(
    raws.map((raw) => raw.authorId),
    language,
  );

  return raws.map((raw) => toQuestion(raw, authors, language));
}

type ListQuestionsOptions = {
  authorId?: string;
};

export async function listQuestions(
  language: Language,
  { authorId }: ListQuestionsOptions = {},
): Promise<Question[]> {
  return hydrate(await fetchQuestionList(authorId ?? null), language);
}

export async function getQuestionsByIds(
  ids: string[],
  language: Language,
): Promise<Question[]> {
  return hydrate(await fetchQuestionsByIds(ids), language);
}

const fetchQuestion = unstable_cache(
  async (id: string): Promise<RawQuestion | null> => {
    const snapshot = await adminDb
      .collection(QUESTIONS_COLLECTION)
      .doc(id)
      .get();

    return snapshot.exists ? toRaw(snapshot) : null;
  },
  ["question"],
  { tags: [QUESTIONS_TAG], revalidate: 300 },
);

export const getQuestion = cache(
  async (id: string, language: Language): Promise<Question | null> => {
    const raw = await fetchQuestion(id);

    if (!raw) {
      return null;
    }

    return (await hydrate([raw], language))[0];
  },
);

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

export type SitemapEntry = {
  id: string;
  updatedAt: Date;
};

export async function listQuestionSitemapEntries(): Promise<SitemapEntry[]> {
  const snapshot = await adminDb
    .collection(QUESTIONS_COLLECTION)
    .orderBy("createdAt", "desc")
    .limit(5000)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    updatedAt: readDate(doc.get("createdAt")),
  }));
}
