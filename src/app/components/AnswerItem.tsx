import type { Answer } from "@/types/answer";
import { toggleAnswerLikeAction } from "../detail/[id]/_actions/like";
import { Avatar } from "./Avatar";
import { Flag } from "./Flag";
import { LikeButton } from "./LikeButton";

export function AnswerItem({ answer }: { answer: Answer }) {
  const { id, questionId, author, content, likeCount, liked, time } = answer;

  return (
    <article className="flex gap-[10px] items-start">
      <Avatar name={author.name} size="lg" color={author.avatarColor} />

      <div className="flex min-w-0 flex-1 flex-col gap-[6px] items-start">
        <div className="flex gap-[5px] items-center">
          <span className="text-[13px] font-bold text-strong">
            {author.name}
          </span>
          <Flag language={author.language} />
          <span className="whitespace-nowrap text-[12px] text-tertiary">
            · {time}
          </span>
        </div>

        <p className="text-[15px] leading-[1.6] text-body">{content}</p>

        <LikeButton
          count={likeCount}
          liked={liked}
          size="sm"
          onToggle={toggleAnswerLikeAction.bind(null, id, questionId)}
        />
      </div>
    </article>
  );
}
