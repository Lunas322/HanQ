import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { QUESTIONS_COLLECTION, VOTES_SUBCOLLECTION } from "./collections";
import { adminDb } from "./firebase-admin";
import { readLocalizedText, readNumber, readString } from "./firestore-value";
import type { Language } from "@/types/language";
import {
  pollOptionId,
  type Poll,
  type PollOption,
  type RawPoll,
} from "@/types/poll";

function readEntries(value: unknown): Map<string, unknown> {
  return typeof value === "object" && value !== null
    ? new Map(Object.entries(value))
    : new Map();
}

function readOptionIds(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string")
    : [];
}

export function buildRawPoll(
  labels: string[],
  language: Language,
): RawPoll | null {
  if (labels.length === 0) {
    return null;
  }

  const optionIds = labels.map((_, index) => pollOptionId(index));

  return {
    optionIds,
    labels: Object.fromEntries(
      optionIds.map((id, index) => [id, { [language]: labels[index] }]),
    ),
    counts: Object.fromEntries(optionIds.map((id) => [id, 0])),
  };
}

export function pollLabelPaths(value: unknown): string[] {
  return readOptionIds(readEntries(value).get("optionIds")).map(
    (id) => `poll.labels.${id}`,
  );
}

export function readPoll(
  value: unknown,
  language: Language,
  fallbackLanguage: Language,
): Poll | null {
  const poll = readEntries(value);
  const optionIds = readOptionIds(poll.get("optionIds"));

  if (optionIds.length === 0) {
    return null;
  }

  const labels = readEntries(poll.get("labels"));
  const counts = readEntries(poll.get("counts"));

  const options: PollOption[] = optionIds.map((id) => ({
    id,
    label: readLocalizedText(labels.get(id), language, fallbackLanguage),
    count: readNumber(counts.get(id)),
  }));

  return {
    options,
    totalVotes: options.reduce((sum, option) => sum + option.count, 0),
  };
}

export async function getVote(
  questionId: string,
  userId: string,
): Promise<string | null> {
  if (!userId) {
    return null;
  }

  const snapshot = await adminDb
    .collection(QUESTIONS_COLLECTION)
    .doc(questionId)
    .collection(VOTES_SUBCOLLECTION)
    .doc(userId)
    .get();

  return readString(snapshot.get("optionId")) || null;
}

export async function votePoll(
  questionId: string,
  userId: string,
  optionId: string,
): Promise<void> {
  const questionRef = adminDb.collection(QUESTIONS_COLLECTION).doc(questionId);
  const voteRef = questionRef.collection(VOTES_SUBCOLLECTION).doc(userId);

  await adminDb.runTransaction(async (transaction) => {
    const [questionSnapshot, voteSnapshot] = await transaction.getAll(
      questionRef,
      voteRef,
    );

    if (!questionSnapshot.exists) {
      throw new Error(`질문을 찾을 수 없습니다: ${questionId}`);
    }

    const optionIds = readOptionIds(
      readEntries(questionSnapshot.get("poll")).get("optionIds"),
    );

    if (!optionIds.includes(optionId)) {
      throw new Error(`없는 선택지입니다: ${optionId}`);
    }

    const previous = readString(voteSnapshot.get("optionId"));

    if (previous === optionId) {
      return;
    }

    const counts: Record<string, FieldValue> = {
      [`poll.counts.${optionId}`]: FieldValue.increment(1),
    };

    if (optionIds.includes(previous)) {
      counts[`poll.counts.${previous}`] = FieldValue.increment(-1);
    }

    transaction.update(questionRef, counts);
    transaction.set(voteRef, {
      optionId,
      createdAt: FieldValue.serverTimestamp(),
    });
  });
}
