import "server-only";

import {
  type DocumentSnapshot,
  FieldValue,
  type Query,
} from "firebase-admin/firestore";

import type { Question } from "@/types/question";
import { type Author, FALLBACK_AUTHOR, loadAuthorsFor } from "./authors";
import { QUESTIONS_COLLECTION, USERS_COLLECTION } from "./collections";
import { adminDb } from "./firebase-admin";
import { readDate, readNumber, readString } from "./firestore-value";
import { formatRelativeTime } from "./format";
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

  const batch = adminDb.batch();

  batch.set(questionRef, {
    authorId,
    title,
    content,
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
): Question {
  const data = doc.data() ?? {};
  const authorId = readString(data.authorId);
  const author = authors.get(authorId) ?? FALLBACK_AUTHOR;

  return {
    id: doc.id,
    user: { id: authorId, name: author.name, languages: author.languages },
    title: readString(data.title),
    content: readString(data.content),
    likeCount: readNumber(data.likeCount),
    commentCount: readNumber(data.answerCount),
    time: formatRelativeTime(readDate(data.createdAt)),
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

  const snapshot = await filtered
    .orderBy("createdAt", "desc")
    .limit(LIST_LIMIT)
    .get();

  const authors = await loadAuthorsFor(snapshot.docs);

  return snapshot.docs.map((doc) => toQuestion(doc, authors));
}

export async function getQuestionsByIds(ids: string[]): Promise<Question[]> {
  if (ids.length === 0) {
    return [];
  }

  const refs = ids.map((id) => adminDb.collection(QUESTIONS_COLLECTION).doc(id));
  const snapshots = (await adminDb.getAll(...refs)).filter(
    (snapshot) => snapshot.exists,
  );

  const authors = await loadAuthorsFor(snapshots);

  return snapshots.map((snapshot) => toQuestion(snapshot, authors));
}

export async function getQuestion(id: string): Promise<Question | null> {
  const snapshot = await adminDb.collection(QUESTIONS_COLLECTION).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  const authors = await loadAuthorsFor([snapshot]);

  return toQuestion(snapshot, authors);
}
