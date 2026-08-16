import { QuestionListSkeleton } from "../components/QuestionListSkeleton";
import { Skeleton } from "../components/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="px-5 pt-4">
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      <div className="px-5 pb-19">
        <QuestionListSkeleton count={2} />
      </div>
    </>
  );
}
