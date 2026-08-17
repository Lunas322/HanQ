export const CATEGORY_IDS = [
  "korea",
  "japan",
  "career",
  "love",
  "travel",
  "food",
  "hobby",
  "free",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export type Category = {
  id: CategoryId;
  emoji: string;
};

export const CATEGORIES: Category[] = [
  { id: "korea", emoji: "🇰🇷" },
  { id: "japan", emoji: "🇯🇵" },
  { id: "career", emoji: "🎓" },
  { id: "love", emoji: "❤️" },
  { id: "travel", emoji: "✈️" },
  { id: "food", emoji: "🍜" },
  { id: "hobby", emoji: "🎮" },
  { id: "free", emoji: "💬" },
];

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORY_IDS.includes(value as CategoryId);
}

export function findCategory(id: string): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}
