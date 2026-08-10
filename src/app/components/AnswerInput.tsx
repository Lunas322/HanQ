import { Button } from "./Button";

export function AnswerInput() {
  return (
    <div className="sticky bottom-0 flex gap-2 items-center border-t border-muted bg-surface px-4 pb-[14px] pt-[10px]">
      {/* placeholder는 label이 아니다. 입력 중에는 사라지므로 별도 label이 필요하다. */}
      <label htmlFor="answer" className="sr-only">
        답변 입력
      </label>
      <input
        id="answer"
        name="answer"
        type="text"
        placeholder="따뜻한 답변을 남겨보세요"
        className="h-11 min-w-0 flex-1 rounded-2xl bg-page px-4 text-[15px] text-primary outline-none placeholder:text-disabled"
      />
      <Button content="등록" size="md" type="submit" className="w-16 shrink-0" />
    </div>
  );
}
