import { BottomNavigation } from "../components/BottomNavigation";
import Categories from "../components/Categories";
import { QuestionCard } from "../components/QuestionCard";
import { Tab, type TabItem } from "../components/Tab";
import { findCategory } from "../mocks/categories";
import { QUESTIONS } from "../mocks/questions";

const TABS: TabItem[] = [
  { value: "latest", label: "최신" },
  { value: "popular", label: "인기" },
];

type Props = {
  searchParams: Promise<{
    tab?: string;
    category?: string | string[];
  }>;
};

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function Page({ searchParams }: Props) {
  const { tab, category } = await searchParams;

  const selected = toArray(category);

  const filtered =
    selected.length === 0
      ? QUESTIONS
      : QUESTIONS.filter((question) => selected.includes(question.categoryId));

  const questions =
    tab === "popular"
      ? [...filtered].sort((a, b) => b.likeCount - a.likeCount)
      : filtered;

  return (
    <div className="px-5 py-4 mb-[76px]">
      <Tab items={TABS} className="w-full" />
      <Categories />

      {questions.length === 0 ? (
        <p className="py-16 text-center text-[14px] text-tertiary">
          선택한 카테고리에 아직 질문이 없어요.
        </p>
      ) : (
        <ul>
          {questions.map((question) => (
            <li key={question.id}>
              <QuestionCard
                question={question}
                category={findCategory(question.categoryId)}
              />
            </li>
          ))}
        </ul>
      )}
      <BottomNavigation/>
    </div>
  );
}
