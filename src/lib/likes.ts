import "server-only";

import { type DocumentReference, FieldValue } from "firebase-admin/firestore";

import {
  ANSWERS_COLLECTION,
  LIKES_SUBCOLLECTION,
  QUESTIONS_COLLECTION,
  USERS_COLLECTION,
} from "./collections";
import { adminDb } from "./firebase-admin";
import { readNumber, readString } from "./firestore-value";

export type LikeableCollection =
  | typeof QUESTIONS_COLLECTION
  | typeof ANSWERS_COLLECTION;

export type ToggleLikeResult = {
  liked: boolean;
  likeCount: number;
};

function likeRefFor(
  collection: LikeableCollection,
  docId: string,
  userId: string,
): DocumentReference {
  return adminDb
    .collection(collection)
    .doc(docId)
    .collection(LIKES_SUBCOLLECTION)
    .doc(userId);
}

export async function hasLiked(
  collection: LikeableCollection,
  docId: string,
  userId: string,
): Promise<boolean> {
  const snapshot = await likeRefFor(collection, docId, userId).get();
  return snapshot.exists;
}

export async function filterLiked(
  collection: LikeableCollection,
  docIds: string[],
  userId: string,
): Promise<Set<string>> {
  if (docIds.length === 0) {
    return new Set();
  }

  const refs = docIds.map((docId) => likeRefFor(collection, docId, userId));
  const snapshots = await adminDb.getAll(...refs);

  return new Set(
    snapshots
      .filter((snapshot) => snapshot.exists)
      .map((snapshot) => snapshot.ref.parent.parent?.id ?? "")
      .filter(Boolean),
  );
}

export async function toggleLike(
  collection: LikeableCollection,
  docId: string,
  userId: string,
): Promise<ToggleLikeResult> {
  const targetRef = adminDb.collection(collection).doc(docId);
  const likeRef = targetRef.collection(LIKES_SUBCOLLECTION).doc(userId);

  return adminDb.runTransaction(async (transaction) => {
    const [targetSnapshot, likeSnapshot] = await transaction.getAll(
      targetRef,
      likeRef,
    );

    if (!targetSnapshot.exists) {
      throw new Error(`대상을 찾을 수 없습니다: ${collection}/${docId}`);
    }

    const wasLiked = likeSnapshot.exists;
    const delta = wasLiked ? -1 : 1;
    const authorId = readString(targetSnapshot.get("authorId"));

    if (wasLiked) {
      transaction.delete(likeRef);
    } else {
      transaction.set(likeRef, {
        userId,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    transaction.update(targetRef, { likeCount: FieldValue.increment(delta) });

    if (authorId) {
      transaction.update(adminDb.collection(USERS_COLLECTION).doc(authorId), {
        receivedLikeCount: FieldValue.increment(delta),
      });
    }

    const likeCount = readNumber(targetSnapshot.get("likeCount")) + delta;

    return { liked: !wasLiked, likeCount: Math.max(0, likeCount) };
  });
}
