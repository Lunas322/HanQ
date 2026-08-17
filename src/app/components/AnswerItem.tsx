import type { Answer } from "@/types/answer";
import { deleteAnswerAction } from "../detail/[id]/_actions/delete";
import { toggleAnswerLikeAction } from "../detail/[id]/_actions/like";
import { Avatar } from "./Avatar";
import { DeleteMenu } from "./DeleteMenu";
import { Flag } from "./Flag";
import { LikeButton } from "./LikeButton";
import { TranslatingBadge } from "./TranslatingBadge";

export function AnswerItem({ answer }: { answer: Answer }) {
  const {
    id,
    questionId,
    author,
    content,
    likeCount,
    liked,
    isMine,
    time,
    translationPending,
  } = answer;

  return (
    <article className="flex gap-[10px] items-start">
      <Avatar name={author.name} size="lg" color={author.avatarColor} />

      <div className="flex min-w-0 flex-1 flex-col gap-[6px] items-start">
        <div className="flex w-full gap-[5px] items-center">
          <span className="text-[13px] font-bold text-strong">
            {author.name}
          </span>
          <Flag language={author.language} />
          <span className="whitespace-nowrap text-[12px] text-tertiary">
            · {time}
          </span>
          {translationPending && <TranslatingBadge />}

          {isMine && (
            <span className="ml-auto">
              <DeleteMenu
                target="answer"
                onDelete={deleteAnswerAction.bind(null, id, questionId)}
              />
            </span>
          )}
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
