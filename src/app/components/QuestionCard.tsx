import type { Question } from "../mocks/questions";

type Props = {
  question: Question;
};

export function QuestionCard({ question }: Props) {
  const { user, content, likeCount, commentCount, time, category, emoji } = question;

  return (
    <div className="mt-3 w-full h-auto p-5 rounded-2xl shadow-[0_2px_8px_0_rgba(25,31,40,0.06)] flex flex-col gap-3">
      <div className="bg-muted rounded-2xl w-fit flex px-[10px] py-[5px] gap-1 items-center">
        <div>{emoji}</div>
        <div className="text-[12px] text-secondary font-medium">{category}</div>
      </div>
      <div className="text-[17px] font-bold">
        <span>{content}</span>
      </div>
      <div className="flex justify-between items-center gap-3">
        <div className="flex min-w-0 gap-2 items-center">
          <div className="shrink-0 w-[26px] h-[26px] bg-brand-subtle rounded-2xl text-brand text-[11px] font-bold flex justify-center items-center">
            {user.name.slice(0, 1)}
          </div>
          <div className="truncate text-[13px] font-medium text-secondary">
            <span>{user.name}</span>
          </div>
          <div className="shrink-0">{user.languages === "ko" ? "🇰🇷" : "🇯🇵"}</div>
          <div className="shrink-0 whitespace-nowrap text-[12px] text-tertiary">
            <span>· {time}</span>
          </div>
        </div>
        <div className="shrink-0 flex justify-between gap-3 text-[13px] font-bold items-center">
          <div className="flex items-center gap-1 text-tertiary text-[13px]">
            <img src="/Icon/Heart.svg" className="w-4 h-4" />
            {likeCount}
          </div>
          <div className="flex items-center gap-1 text-tertiary text-[13px]">
            <img src="/Icon/Comment.svg" className="w-4 h-4" />
            {commentCount}
          </div>
        </div>
      </div>
    </div>
  );
}
