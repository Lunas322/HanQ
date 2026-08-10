import type { Answer } from "../mocks/answers";
import { Avatar } from "./Avatar";
import { Flag } from "./Flag";
import { LikeButton } from "./LikeButton";

// LikeButton만 'use client'다. 이 컴포넌트는 서버에 남으므로
// 답변 본문은 HTML로만 내려가고 번들에는 실리지 않는다.
export function AnswerItem({ answer }: { answer: Answer }) {
  const { author, content, likeCount, liked, time } = answer;

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

        <LikeButton count={likeCount} size="sm" defaultLiked={liked} />
      </div>
    </article>
  );
}
