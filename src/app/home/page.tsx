import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getCurrentUser } from "@/lib/auth";
import { findCategory } from "@/lib/categories";
import { getServerDictionary } from "@/lib/i18n/server";
import { listQuestions } from "@/lib/questions";
import { BottomNavigation } from "../components/BottomNavigation";
import Categories from "../components/Categories";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionListSkeleton } from "../components/QuestionListSkeleton";
import { Tab, type TabItem } from "../components/Tab";

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

async function QuestionList({
  isPopular,
  selected,
}: {
  isPopular: boolean;
  selected: string[];
}) {
  const [all, dictionary] = await Promise.all([
    listQuestions(),
    getServerDictionary(),
  ]);

  const filtered =
    selected.length === 0
      ? all
      : all.filter((question) => selected.includes(question.categoryId));

  const questions = isPopular
    ? filtered.toSorted((a, b) => b.likeCount - a.likeCount)
    : filtered;

  if (questions.length === 0) {
    return (
      <p className="py-16 text-center text-[14px] text-tertiary">
        {selected.length === 0
          ? dictionary.home.emptyAll
          : dictionary.home.emptyFiltered}
      </p>
    );
  }

  return (
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
  );
}

export default async function Page({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  const { home } = await getServerDictionary();
  const { tab, category } = await searchParams;

  const tabs: TabItem[] = [
    { value: "latest", label: home.tabLatest },
    { value: "popular", label: home.tabPopular },
  ];

  const selected = toArray(category);
  const isPopular = tab === "popular";

  return (
    <div className="px-5 py-4 mb-[76px]">
      <Tab items={tabs} className="w-full" />
      <Categories />

      <Suspense
        key={`${tab ?? "latest"}|${selected.join(",")}`}
        fallback={<QuestionListSkeleton />}
      >
        <QuestionList isPopular={isPopular} selected={selected} />
      </Suspense>

      <BottomNavigation />
    </div>
  );
}
