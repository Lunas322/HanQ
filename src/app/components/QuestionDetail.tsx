import type { Category } from "@/lib/categories";
import { getDictionary } from "@/lib/i18n";
import type { Language } from "@/types/language";
import type { Question } from "@/types/question";
import { toggleQuestionLikeAction } from "@/app/[lang]/detail/[id]/_actions/like";
import { voteAction } from "@/app/[lang]/detail/[id]/_actions/vote";
import { AuthorLink } from "./AuthorLink";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Flag } from "./Flag";
import { LikeButton } from "./LikeButton";
import { PollVote } from "./PollVote";
import { RelativeTime } from "./RelativeTime";
import { TranslatableQuestion } from "./TranslatableQuestion";
import { TranslatingBadge } from "./TranslatingBadge";

type Props = {
  question: Question;
  category?: Category;
  liked: boolean;
  votedOptionId: string | null;
  language: Language;
  loginHref?: string;
};

export function QuestionDetail({
  question,
  category,
  liked,
  votedOptionId,
  language,
  loginHref,
}: Props) {
  const { id, user, title, content, likeCount, createdAt, translationPending, original, poll } =
    question;
  const dictionary = getDictionary(language);

  return (
    <section className="px-5 pb-5 pt-[18px] flex flex-col items-start">
      {category && (
        <div className="mb-3">
          <Badge emoji={category.emoji} label={dictionary.category[category.id]} />
        </div>
      )}

      <TranslatableQuestion title={title} content={content} original={original}>
        <div className="flex min-w-0 gap-2 items-center mb-[14px]">
          <AuthorLink userId={user.id} name={user.name} language={language}>
            <Avatar name={user.name} size="md" photoUrl={user.photoUrl} />
            <span className="truncate text-[14px] font-bold text-strong">
              {user.name}
            </span>
          </AuthorLink>
          <Flag language={user.languages} />
          <span className="shrink-0 whitespace-nowrap text-[12px] text-tertiary">
            · <RelativeTime iso={createdAt} />
          </span>
          {translationPending && <TranslatingBadge language={language} />}
        </div>
      </TranslatableQuestion>

      {poll && (
        <div className="mb-4 w-full">
          <PollVote
            poll={poll}
            votedOptionId={votedOptionId}
            onVote={voteAction.bind(null, id)}
            loginHref={loginHref}
          />
        </div>
      )}

      <LikeButton
        count={likeCount}
        liked={liked}
        size="md"
        onToggle={toggleQuestionLikeAction.bind(null, id)}
        loginHref={loginHref}
      />
    </section>
  );
}
