import Link from "next/link";

import type { Category } from "@/lib/categories";
import { getServerDictionary } from "@/lib/i18n/server";
import type { Question } from "@/types/question";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Flag } from "./Flag";
import { Icon } from "./Icon";

type Props = {
  question: Question;
  category?: Category;
};

export async function QuestionCard({ question, category }: Props) {
  const { user, likeCount, commentCount, time } = question;
  const dictionary = await getServerDictionary();

  return (
    <Link
      href={`/detail/${question.id}`}
      className="mt-3 w-full h-auto p-5 rounded-2xl shadow-[0_2px_8px_0_rgba(25,31,40,0.06)] flex flex-col gap-3 bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {category && (
        <Badge emoji={category.emoji} label={dictionary.category[category.id]} />
      )}

      <h3 className="text-[17px] font-bold">{question.title}</h3>

      <div className="flex justify-between items-center gap-3">
        <div className="flex min-w-0 gap-2 items-center">
          <Avatar name={user.name} size="sm" />
          <span className="truncate text-[13px] font-medium text-secondary">
            {user.name}
          </span>
          <Flag language={user.languages} />
          <span className="shrink-0 whitespace-nowrap text-[12px] text-tertiary">
            · {time}
          </span>
        </div>

        <div className="shrink-0 flex gap-3 text-[13px] font-bold text-tertiary items-center">
          <span className="flex items-center gap-1">
            <Icon icon="Heart" size="s" />
            {likeCount}
          </span>
          <span className="flex items-center gap-1">
            <Icon icon="Comment" size="s" />
            {commentCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
