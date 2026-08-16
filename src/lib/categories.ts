export type Category = {
  id: string;
  label: string;
  emoji: string;
};

export function findCategory(id: string) {
  return CATEGORIES.find((category) => category.id === id);
}

export const CATEGORIES: Category[] = [
  { id: "korea", label: "한국 문화", emoji: "🇰🇷" },
  { id: "japan", label: "일본 문화", emoji: "🇯🇵" },
  { id: "career", label: "취업 / 대학", emoji: "🎓" },
  { id: "love", label: "연애", emoji: "❤️" },
  { id: "travel", label: "여행", emoji: "✈️" },
  { id: "food", label: "음식", emoji: "🍜" },
  { id: "hobby", label: "취미", emoji: "🎮" },
  { id: "free", label: "자유 질문", emoji: "💬" },
];
