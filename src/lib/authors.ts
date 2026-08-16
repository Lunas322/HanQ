import "server-only";

import type { DocumentSnapshot } from "firebase-admin/firestore";

import type { Language } from "@/types/language";
import type { AvatarColor } from "@/types/user";
import { USERS_COLLECTION } from "./collections";
import { adminDb } from "./firebase-admin";
import { readString } from "./firestore-value";
import { resolveDisplayName, toLanguage } from "./user";

export type Author = {
  name: string;
  languages: Language;
};

export const FALLBACK_AUTHOR: Author = { name: "사용자", languages: "ko" };

const AVATAR_COLORS: AvatarColor[] = ["blue", "purple", "red", "green"];

export function avatarColorFor(uid: string): AvatarColor {
  const sum = [...uid].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

async function loadAuthors(uids: string[]): Promise<Map<string, Author>> {
  const authors = new Map<string, Author>();

  if (uids.length === 0) {
    return authors;
  }

  const refs = uids.map((uid) => adminDb.collection(USERS_COLLECTION).doc(uid));

  for (const snapshot of await adminDb.getAll(...refs)) {
    const data = snapshot.data();

    if (!data) {
      continue;
    }

    authors.set(snapshot.id, {
      name: resolveDisplayName(data.name),
      languages: toLanguage(data.languages),
    });
  }

  return authors;
}

export async function loadAuthorsFor(
  docs: DocumentSnapshot[],
): Promise<Map<string, Author>> {
  const uids = [
    ...new Set(docs.map((doc) => readString(doc.get("authorId")))),
  ].filter(Boolean);

  return loadAuthors(uids);
}
