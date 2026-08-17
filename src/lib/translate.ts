import "server-only";

import { isLanguage, type Language } from "@/types/language";

const TIMEOUT_MS = 10_000;

const TARGET_CODE: Record<Language, string> = { ko: "KO", ja: "JA" };

export type TranslateResult = {
  texts: string[];
  detectedSource: Language | null;
};

function endpointFor(key: string): string {
  return key.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";
}

function readTranslations(data: unknown): unknown[] {
  if (typeof data === "object" && data !== null && "translations" in data) {
    const { translations } = data;
    return Array.isArray(translations) ? translations : [];
  }

  return [];
}

function readText(item: unknown): string | null {
  if (typeof item === "object" && item !== null && "text" in item) {
    return typeof item.text === "string" ? item.text : null;
  }

  return null;
}

function readDetectedSource(item: unknown): Language | null {
  if (
    typeof item === "object" &&
    item !== null &&
    "detected_source_language" in item &&
    typeof item.detected_source_language === "string"
  ) {
    const code = item.detected_source_language.toLowerCase();
    return isLanguage(code) ? code : null;
  }

  return null;
}

export async function translateTexts(
  texts: string[],
  target: Language,
  source?: Language,
): Promise<TranslateResult | null> {
  const key = process.env.DEEPL_API_KEY;

  if (!key) {
    console.error("[translate] DEEPL_API_KEY가 비어 있습니다.");
    return null;
  }

  try {
    const response = await fetch(endpointFor(key), {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: texts,
        target_lang: TARGET_CODE[target],
        ...(source ? { source_lang: TARGET_CODE[source] } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error("[translate]", response.status, await response.text());
      return null;
    }

    const items = readTranslations(await response.json());

    if (items.length !== texts.length) {
      console.error("[translate] 응답 개수가 요청과 다릅니다.");
      return null;
    }

    const translated = items.map(readText);

    if (translated.some((text) => text === null)) {
      console.error("[translate] 번역문이 비어 있습니다.");
      return null;
    }

    return {
      texts: translated.filter((text) => text !== null),
      detectedSource: readDetectedSource(items[0]),
    };
  } catch (e) {
    console.error("[translate]", e);
    return null;
  }
}
