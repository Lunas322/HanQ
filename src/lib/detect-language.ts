import type { Language } from "@/types/language";

const HANGUL = /[가-힣ᄀ-ᇿ㄰-㆏]/g;
const KANA = /[぀-ゟ゠-ヿ]/g;
const HAN = /[㐀-䶿一-鿿]/g;
const LATIN = /[a-zA-Z]/g;
const TRANSLATABLE = /[가-힣ᄀ-ᇿ㄰-㆏぀-ゟ゠-ヿ㐀-䶿一-鿿a-zA-Z]/;

export type Detection = {
  language: Language;
  confident: boolean;
};

// 한자는 일본어와 중국어가 공유하므로 그 자체로는 언어를 가르지 못한다.
// 가나가 일본어에만 있는 신호라, 가나가 있으면 한자를 일본어 쪽으로 세고
// 가나가 없을 때만 중국어의 근거로 삼는다.
function countScripts(text: string): Record<Language, number> {
  const kana = text.match(KANA)?.length ?? 0;
  const han = text.match(HAN)?.length ?? 0;

  return {
    ko: text.match(HANGUL)?.length ?? 0,
    ja: kana === 0 ? 0 : kana + han,
    en: text.match(LATIN)?.length ?? 0,
    zh: kana === 0 ? han : 0,
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
