export type Category = {
  id: string;
  label: string;
  emoji: string;
};

export function findCategory(id: string) {
  return CATEGORIES.find((category) => category.id === id);
}

export const CATEGORIES: Category[] = [
  { id: "all", label: "전체", emoji: "🎮" },
  { id: "culture", label: "문화", emoji: "🎎" },
  { id: "travel", label: "여행", emoji: "✈️" },
  { id: "job", label: "취업", emoji: "💼" },
  { id: "language", label: "언어", emoji: "💬" },
  { id: "food", label: "음식", emoji: "🍜" },
  { id: "hobby", label: "취미", emoji: "🎮" },
  { id: "hobby1", label: "취미1", emoji: "🎮" },

];
