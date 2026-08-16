import type { Category } from "@/lib/categories";
import { getServerDictionary } from "@/lib/i18n/server";
import type { Question } from "@/types/question";
import { toggleQuestionLikeAction } from "../detail/[id]/_actions/like";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Flag } from "./Flag";
import { LikeButton } from "./LikeButton";
import { TranslateToggle } from "./TranslateToggle";

type Props = {
  question: Question;
  category?: Category;
  liked: boolean;
};

export async function QuestionDetail({ question, category, liked }: Props) {
  const { id, user, title, content, likeCount, time } = question;
  const dictionary = await getServerDictionary();

  return (
    <section className="px-5 pb-5 pt-[18px] flex flex-col items-start">
      {category && (
        <div className="mb-3">
          <Badge emoji={category.emoji} label={dictionary.category[category.id]} />
        </div>
      )}

      <h1 className="font-black text-[22px] leading-[1.35] text-primary mb-[14px]">
        {title}
      </h1>

      <div className="flex min-w-0 gap-2 items-center mb-[14px]">
        <Avatar name={user.name} size="md" />
        <span className="truncate text-[14px] font-bold text-strong">
          {user.name}
        </span>
        <Flag language={user.languages} />
        <span className="shrink-0 whitespace-nowrap text-[12px] text-tertiary">
          · {time}
        </span>
      </div>

      <p className="font-medium text-[16px] leading-[1.65] text-body mb-3">
        {content}
      </p>

      <div className="mb-[18px]">
        <TranslateToggle />
      </div>

      <LikeButton
        count={likeCount}
        liked={liked}
        size="md"
        onToggle={toggleQuestionLikeAction.bind(null, id)}
      />
    </section>
  );
}
