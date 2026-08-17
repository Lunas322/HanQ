import { getServerDictionary } from "@/lib/i18n/server";
import type { Profile } from "@/types/user";
import { Avatar } from "./Avatar";
import { Flag } from "./Flag";

type Props = {
  profile: Profile;
};

export async function ProfileSummary({ profile }: Props) {
  const {
    name,
    languages,
    photoUrl,
    questionCount,
    answerCount,
    receivedLikeCount,
  } = profile;
  const dictionary = await getServerDictionary();

  return (
    <section className="flex w-full items-center gap-3.5 bg-surface px-5 pt-4 pb-6">
      <Avatar name={name} size="xl" photoUrl={photoUrl} />

      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <h1 className="truncate text-[20px] font-black text-ink">{name}</h1>
          <span className="text-[18px]">
            <Flag language={languages} />
          </span>
        </div>

        <p className="text-[13px] font-medium text-tertiary">
          {dictionary.my.stats(questionCount, answerCount, receivedLikeCount)}
        </p>
      </div>
    </section>
  );
}
