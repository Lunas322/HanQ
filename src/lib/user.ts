import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { cache } from "react";

import { getDictionary } from "@/lib/i18n";
import type { Profile } from "@/types/user";
import type { Language } from "@/types/language";
import { getCurrentLanguage } from "./locale";
import { USERS_COLLECTION } from "./collections";
import { adminDb } from "./firebase-admin";

export function resolveDisplayName(
  name: unknown,
  language: Language = "ko",
): string {
  return typeof name === "string" && name.trim() !== ""
    ? name
    : getDictionary(language).common.fallbackUserName;
}

export function readPhotoUrl(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function toLanguage(value: unknown): Language {
  return value === "ja" ? "ja" : "ko";
}

type EnsureUserInput = {
  uid: string;
  name: string;
  email: string | null;
  languages: Language;
};

export async function ensureUserDocument({
  uid,
  name,
  email,
  languages,
}: EnsureUserInput): Promise<void> {
  await adminDb
    .collection(USERS_COLLECTION)
    .doc(uid)
    .set(
      {
        name,
        email,
        languages,
        questionCount: FieldValue.increment(0),
        answerCount: FieldValue.increment(0),
        receivedLikeCount: FieldValue.increment(0),
        lastLoginAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
}

export const getUserProfile = cache(async (uid: string): Promise<Profile | null> => {
  const snapshot = await adminDb.collection(USERS_COLLECTION).doc(uid).get();
  const data = snapshot.data();

  if (!data) {
    return null;
  }

  return {
    id: uid,
    name: resolveDisplayName(data.name, await getCurrentLanguage()),
    languages: toLanguage(data.languages),
    photoUrl: readPhotoUrl(data.photoUrl),
    questionCount: Number(data.questionCount ?? 0),
    answerCount: Number(data.answerCount ?? 0),
    receivedLikeCount: Number(data.receivedLikeCount ?? 0),
  };
});

type ProfileUpdate = {
  name: string;
  photoUrl?: string | null;
};

export async function updateUserProfile(
  uid: string,
  update: ProfileUpdate,
): Promise<void> {
  await adminDb
    .collection(USERS_COLLECTION)
    .doc(uid)
    .update({
      name: update.name,
      ...(update.photoUrl === undefined ? {} : { photoUrl: update.photoUrl }),
    });
}
