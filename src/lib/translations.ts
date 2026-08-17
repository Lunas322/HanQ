import "server-only";

import { revalidateTag } from "next/cache";

import { answersTag, questionTag, QUESTIONS_TAG } from "./cache-tags";
import { ANSWERS_COLLECTION, QUESTIONS_COLLECTION } from "./collections";
import { detectLanguage, hasTranslatableText } from "./detect-language";
import { adminDb } from "./firebase-admin";
import { readLocalizedText } from "./firestore-value";
import { translateTexts } from "./translate";
import { isLanguage, type Language } from "@/types/language";
import { otherLanguage, type TranslationStatus } from "@/types/localized";

type FieldUpdate = Record<string, unknown>;

function buildUpdate(
  fields: string[],
  originals: string[],
  translated: string[],
  source: Language,
): FieldUpdate {
  const target = otherLanguage(source);

  const update: FieldUpdate = {
    sourceLanguage: source,
    translationStatus: "done" satisfies TranslationStatus,
  };

  fields.forEach((field, index) => {
    update[field] = {
      [source]: originals[index],
      [target]: translated[index],
    };
  });

  return update;
}

async function translateDocument(
  collection: string,
  id: string,
  fields: string[],
): Promise<void> {
  const ref = adminDb.collection(collection).doc(id);
  const snapshot = await ref.get();
  const data = snapshot.data();

  if (!data || data.translationStatus === "done") {
    return;
  }

  const stored = isLanguage(data.sourceLanguage) ? data.sourceLanguage : "ko";

  const originals = fields.map((field) =>
    readLocalizedText(data[field], stored, stored),
  );

  const combined = originals.join("\n");

  if (!hasTranslatableText(combined)) {
    await ref.update(buildUpdate(fields, originals, originals, stored));
    return;
  }

  const detection = detectLanguage(combined, stored);

  let source = detection.language;
  let result = await translateTexts(
    originals,
    otherLanguage(source),
    detection.confident ? source : undefined,
  );

  if (
    result &&
    !detection.confident &&
    result.detectedSource &&
    result.detectedSource !== source
  ) {
    source = result.detectedSource;
    result = await translateTexts(originals, otherLanguage(source), source);
  }

  if (!result) {
    await ref.update({
      translationStatus: "failed" satisfies TranslationStatus,
    });
    return;
  }

  await ref.update(buildUpdate(fields, originals, result.texts, source));
}

export async function translateQuestion(id: string): Promise<void> {
  await translateDocument(QUESTIONS_COLLECTION, id, ["title", "content"]);

  revalidateTag(QUESTIONS_TAG, "max");
  revalidateTag(questionTag(id), "max");
}

export async function translateAnswer(id: string, questionId: string): Promise<void> {
  await translateDocument(ANSWERS_COLLECTION, id, ["content"]);

  revalidateTag(answersTag(questionId), "max");
}
