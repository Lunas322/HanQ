import type { Category } from "@/lib/categories";
import { getServerDictionary } from "@/lib/i18n/server";
import type { Question } from "@/types/question";
import { toggleQuestionLikeAction } from "@/app/[lang]/detail/[id]/_actions/like";
import { AuthorLink } from "./AuthorLink";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Flag } from "./Flag";
import { LikeButton } from "./LikeButton";
import { TranslatableQuestion } from "./TranslatableQuestion";
import { TranslatingBadge } from "./TranslatingBadge";

type Props = {
  question: Question;
  category?: Category;
  liked: boolean;
};

export async function QuestionDetail({ question, category, liked }: Props) {
  const { id, user, title, content, likeCount, time, translationPending, original } =
    question;
  const dictionary = await getServerDictionary();

  return (
    <section className="px-5 pb-5 pt-[18px] flex flex-col items-start">
      {category && (
        <div className="mb-3">
          <Badge emoji={category.emoji} label={dictionary.category[category.id]} />
        </div>
      )}

      <TranslatableQuestion title={title} content={content} original={original}>
        <div className="flex min-w-0 gap-2 items-center mb-[14px]">
          <AuthorLink userId={user.id} name={user.name}>
            <Avatar name={user.name} size="md" photoUrl={user.photoUrl} />
            <span className="truncate text-[14px] font-bold text-strong">
              {user.name}
            </span>
          </AuthorLink>
          <Flag language={user.languages} />
          <span className="shrink-0 whitespace-nowrap text-[12px] text-tertiary">
            · {time}
          </span>
          {translationPending && <TranslatingBadge />}
        </div>
      </TranslatableQuestion>

      <LikeButton
        count={likeCount}
        liked={liked}
        size="md"
        onToggle={toggleQuestionLikeAction.bind(null, id)}
      />
    </section>
  );
}
