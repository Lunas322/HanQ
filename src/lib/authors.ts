import "server-only";

import { unstable_cache } from "next/cache";

import type { Language } from "@/types/language";
import type { AvatarColor } from "@/types/user";
import { USERS_TAG } from "./cache-tags";
import { USERS_COLLECTION } from "./collections";
import { adminDb } from "./firebase-admin";
import { readPhotoUrl, resolveDisplayName, toLanguage } from "./user";

export type Author = {
  name: string;
  languages: Language;
  photoUrl: string | null;
};

export function fallbackAuthor(language: Language): Author {
  return {
    name: resolveDisplayName(null, language),
    languages: "ko",
    photoUrl: null,
  };
}

const AVATAR_COLORS: AvatarColor[] = ["blue", "purple", "red", "green"];

export function avatarColorFor(uid: string): AvatarColor {
  const sum = [...uid].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

const fetchUserDocs = unstable_cache(
  async (uids: string[]) => {
    if (uids.length === 0) {
      return [];
    }

    const refs = uids.map((uid) =>
      adminDb.collection(USERS_COLLECTION).doc(uid),
    );

    return (await adminDb.getAll(...refs)).map((snapshot) => ({
      id: snapshot.id,
      name: snapshot.get("name") ?? null,
      languages: snapshot.get("languages") ?? null,
      photoUrl: snapshot.get("photoUrl") ?? null,
    }));
  },
  ["author-docs"],
  { tags: [USERS_TAG], revalidate: 300 },
);

export async function loadAuthors(
  uids: string[],
  language: Language,
): Promise<Map<string, Author>> {
  const docs = await fetchUserDocs([...new Set(uids)].filter(Boolean).sort());

  return new Map(
    docs
      .filter((doc) => doc.name !== null || doc.languages !== null)
      .map((doc) => [
        doc.id,
        {
          name: resolveDisplayName(doc.name, language),
          languages: toLanguage(doc.languages),
          photoUrl: readPhotoUrl(doc.photoUrl),
        },
      ]),
  );
}

