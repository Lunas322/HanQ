import { Skeleton } from "./Skeleton";

export function AnswerListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-start gap-[10px]">
          <Skeleton className="h-[34px] w-[34px] shrink-0 rounded-full" />

          <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-1 h-8 w-16 rounded-2xl" />
          </div>
        </div>
      ))}
    </>
  );
}
