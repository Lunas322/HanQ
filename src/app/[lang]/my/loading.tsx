import { QuestionListSkeleton } from "@/app/components/QuestionListSkeleton";
import { Skeleton } from "@/app/components/Skeleton";

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
