import type { Language } from "@/types/language";

const HANGUL = /[가-힣ᄀ-ᇿ㄰-㆏]/g;
const KANA = /[぀-ゟ゠-ヿ]/g;
const TRANSLATABLE = /[가-힣ᄀ-ᇿ㄰-㆏぀-ゟ゠-ヿ㐀-䶿一-鿿]/;

export type Detection = {
  language: Language;
  confident: boolean;
};

export function detectLanguage(text: string, fallback: Language): Detection {
  const hangul = text.match(HANGUL)?.length ?? 0;
  const kana = text.match(KANA)?.length ?? 0;

  const [language, dominant, other] =
    hangul >= kana
      ? (["ko", hangul, kana] as const)
      : (["ja", kana, hangul] as const);

  if (dominant === 0 || dominant <= other * 2) {
    return { language: fallback, confident: false };
  }

  return { language, confident: true };
}

export function hasTranslatableText(text: string): boolean {
  return TRANSLATABLE.test(text);
}
