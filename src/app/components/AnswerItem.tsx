import type { Answer } from "@/types/answer";
import { deleteAnswerAction } from "@/app/[lang]/detail/[id]/_actions/delete";
import { toggleAnswerLikeAction } from "@/app/[lang]/detail/[id]/_actions/like";
import { AuthorLink } from "./AuthorLink";
import { Avatar } from "./Avatar";
import { DeleteMenu } from "./DeleteMenu";
import { Flag } from "./Flag";
import { LikeButton } from "./LikeButton";
import { TranslatableAnswer } from "./TranslatableAnswer";
import { TranslatingBadge } from "./TranslatingBadge";

type Props = {
  answer: Answer;
  loginHref?: string;
};

export function AnswerItem({ answer, loginHref }: Props) {
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
    original,
  } = answer;

  return (
    <article className="flex gap-[10px] items-start">
      <Avatar
        name={author.name}
        size="lg"
        color={author.avatarColor}
        photoUrl={author.photoUrl}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-[6px] items-start">
        <div className="flex w-full gap-[5px] items-center">
          <AuthorLink userId={author.id} name={author.name}>
            <span className="text-[13px] font-bold text-strong">
              {author.name}
            </span>
          </AuthorLink>
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

        <TranslatableAnswer content={content} original={original} />

        <LikeButton
          count={likeCount}
          liked={liked}
          size="sm"
          onToggle={toggleAnswerLikeAction.bind(null, id, questionId)}
          loginHref={loginHref}
        />
      </div>
    </article>
  );
}
