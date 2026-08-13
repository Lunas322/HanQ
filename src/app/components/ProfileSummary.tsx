import type { Profile } from "../mocks/profile";
import { Avatar } from "./Avatar";
import { Flag } from "./Flag";

type Props = {
  profile: Profile;
};

export function ProfileSummary({ profile }: Props) {
  const { name, languages, questionCount, answerCount, receivedLikeCount } =
    profile;

  return (
    <section className="flex w-full items-center gap-3.5 bg-surface px-5 pt-4 pb-6">
      <Avatar name={name} size="xl" />

      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <h1 className="truncate text-[20px] font-black text-ink">{name}</h1>
          <span className="text-[18px]">
            <Flag language={languages} />
          </span>
        </div>

        <p className="text-[13px] font-medium text-tertiary">
          질문 {questionCount} · 답변 {answerCount} · 받은 좋아요{" "}
          {receivedLikeCount}
        </p>
      </div>
    </section>
  );
}
