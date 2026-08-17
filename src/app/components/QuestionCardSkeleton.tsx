import { Skeleton } from "./Skeleton";

export function QuestionCardSkeleton() {
  return (
    <div className="mt-3 w-full p-5 rounded-2xl shadow-[0_2px_8px_0_rgba(25,31,40,0.06)] flex flex-col gap-3 bg-surface">
      <Skeleton className="h-[26px] w-24 rounded-full" />
      <Skeleton className="h-[22px] w-4/5" />

      <div className="flex justify-between items-center gap-3">
        <div className="flex gap-2 items-center">
          <Skeleton className="h-[26px] w-[26px] rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
