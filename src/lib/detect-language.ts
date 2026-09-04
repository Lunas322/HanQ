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
// 가나가 있으면 일본어가 확실하고, 가나 없이 한자만 있으면 글만으로는 판단할 수
// 없어 접속 지역에서 추론한 언어(region)를 따른다.
function countScripts(
  text: string,
  region: Language,
): Record<Language, number> {
  const kana = text.match(KANA)?.length ?? 0;
  const han = text.match(HAN)?.length ?? 0;
  const hanBelongsToJa = kana > 0 || region === "ja";

  return {
    ko: text.match(HANGUL)?.length ?? 0,
    ja: kana + (hanBelongsToJa ? han : 0),
    en: text.match(LATIN)?.length ?? 0,
    zh: hanBelongsToJa ? 0 : han,
  };
}

export function detectLanguage(text: string, fallback: Language): Detection {
  const ranked = Object.entries(countScripts(text, fallback)).toSorted(
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
