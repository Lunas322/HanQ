import { QuestionListSkeleton } from "@/app/components/QuestionListSkeleton";
import { Skeleton } from "@/app/components/Skeleton";

export default function Loading() {
  return (
    <div className="px-5 py-4 mb-[calc(76px+env(safe-area-inset-bottom))]">
      <Skeleton className="h-12 w-full rounded-xl" />

      <div className="mt-4 flex gap-2 overflow-hidden">
        {["w-20", "w-24", "w-18", "w-22"].map((width) => (
          <Skeleton
            key={width}
            className={`h-[34px] shrink-0 rounded-full ${width}`}
          />
        ))}
      </div>

      <QuestionListSkeleton />
    </div>
  );
}
