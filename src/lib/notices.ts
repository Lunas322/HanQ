import "server-only";

import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

import { adminDb } from "./firebase-admin";
import { readLocalizedText, readString } from "./firestore-value";
import { NOTICE_COOKIE_NAME, type Notice } from "./notice";
import { DEFAULT_LANGUAGE, type Language } from "@/types/language";

const CONFIG_COLLECTION = "config";
const NOTICE_DOCUMENT = "notice";

const REVALIDATE_SECONDS = 60;

type RawNotice = {
  id: string;
  active: boolean;
  message: unknown;
};

const fetchNotice = unstable_cache(
  async (): Promise<RawNotice | null> => {
    const snapshot = await adminDb
      .collection(CONFIG_COLLECTION)
      .doc(NOTICE_DOCUMENT)
      .get();

    if (!snapshot.exists) {
      return null;
    }

    return {
      id: readString(snapshot.get("id")),
      active: snapshot.get("active") === true,
      message: snapshot.get("message") ?? null,
    };
  },
  ["notice"],
  { revalidate: REVALIDATE_SECONDS },
);

export async function getVisibleNotice(
  language: Language,
): Promise<Notice | null> {
  const raw = await fetchNotice();

  if (!raw || !raw.active || raw.id === "") {
    return null;
  }

  const message = readLocalizedText(raw.message, language, DEFAULT_LANGUAGE);

  if (message === "") {
    return null;
  }

  const cookieStore = await cookies();

  if (cookieStore.get(NOTICE_COOKIE_NAME)?.value === raw.id) {
    return null;
  }

  return { id: raw.id, message };
}
