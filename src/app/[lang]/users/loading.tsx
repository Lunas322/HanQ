import { ProfileSummarySkeleton } from "@/app/components/ProfileSummarySkeleton";
import { QuestionListSkeleton } from "@/app/components/QuestionListSkeleton";
import { Skeleton } from "@/app/components/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="sticky top-0 z-50 flex h-14 w-full items-center border-b border-muted bg-surface pl-5 pr-3">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="mx-auto h-5 w-24" />
        <div className="w-6" />
      </div>

      <main className="flex-1 bg-muted">
        <ProfileSummarySkeleton />

        <div className="px-5 pt-4">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        <div className="px-5 pb-8">
          <QuestionListSkeleton count={2} />
        </div>
      </main>
    </>
  );
}
