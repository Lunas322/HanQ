import { LoadingAnnouncement } from "./LoadingAnnouncement";
import { QuestionCardSkeleton } from "./QuestionCardSkeleton";

type Props = {
  count?: number;
};

export function QuestionListSkeleton({ count = 3 }: Props) {
  return (
    <>
      <LoadingAnnouncement />

      {Array.from({ length: count }, (_, index) => (
        <QuestionCardSkeleton key={index} />
      ))}
    </>
  );
}
