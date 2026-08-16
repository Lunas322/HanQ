import { QuestionCardSkeleton } from "./QuestionCardSkeleton";

type Props = {
  count?: number;
};

export function QuestionListSkeleton({ count = 3 }: Props) {
  return (
    <>
      <span role="status" className="sr-only">
        질문을 불러오는 중
      </span>

      {Array.from({ length: count }, (_, index) => (
        <QuestionCardSkeleton key={index} />
      ))}
    </>
  );
}
