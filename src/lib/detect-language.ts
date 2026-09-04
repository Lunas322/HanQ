import type { Language } from "@/types/language";

const HANGUL = /[가-힣ᄀ-ᇿ㄰-㆏]/g;
const KANA = /[぀-ゟ゠-ヿ]/g;
const LATIN = /[a-zA-Z]/g;
const TRANSLATABLE = /[가-힣ᄀ-ᇿ㄰-㆏぀-ゟ゠-ヿ㐀-䶿一-鿿a-zA-Z]/;

export type Detection = {
  language: Language;
  confident: boolean;
};

function countScripts(text: string): Record<Language, number> {
  return {
    ko: text.match(HANGUL)?.length ?? 0,
    ja: text.match(KANA)?.length ?? 0,
    en: text.match(LATIN)?.length ?? 0,
  };
}

export function detectLanguage(text: string, fallback: Language): Detection {
  const ranked = Object.entries(countScripts(text)).toSorted(
    (a, b) => b[1] - a[1],
  ) as [Language, number][];

  const [language, dominant] = ranked[0];
  const runnerUp = ranked[1][1];

  if (dominant === 0 || dominant <= runnerUp * 2) {
    return { language: fallback, confident: false };
  }

  return { language, confident: true };
}

export function hasTranslatableText(text: string): boolean {
  return TRANSLATABLE.test(text);
}
