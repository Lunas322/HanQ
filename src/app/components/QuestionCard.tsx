import type { Category } from "../mocks/categories";
import type { Question } from "../mocks/questions";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Flag } from "./Flag";
import { Icon } from "./Icon";

type Props = {
  question: Question;
  category?: Category;
};

export function QuestionCard({ question, category }: Props) {
  const { user, likeCount, commentCount, time } = question;

  return (
    <div className="mt-3 w-full h-auto p-5 rounded-2xl shadow-[0_2px_8px_0_rgba(25,31,40,0.06)] flex flex-col gap-3 bg-surface">
      {category && <Badge emoji={category.emoji} label={category.label} />}

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

        {/* 카드의 숫자는 보여주기만 한다. 카드 전체가 링크가 될 자리라 버튼을 겹치지 않는다. */}
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
    </div>
  );
}
