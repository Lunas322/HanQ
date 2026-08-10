import type { Category } from "../mocks/categories";
import type { Question } from "../mocks/questions";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Flag } from "./Flag";
import { LikeButton } from "./LikeButton";
import { TranslateToggle } from "./TranslateToggle";

type Props = {
  question: Question;
  category?: Category;
};

export function QuestionDetail({ question, category }: Props) {
  const { user, title, content, likeCount, time } = question;

  return (
    <section className="px-5 pb-5 pt-[18px] flex flex-col items-start">
      {category && (
        <div className="mb-3">
          <Badge emoji={category.emoji} label={category.label} />
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

      <LikeButton count={likeCount} size="md" />
    </section>
  );
}
