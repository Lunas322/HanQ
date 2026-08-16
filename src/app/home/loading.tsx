import { QuestionListSkeleton } from "../components/QuestionListSkeleton";
import { Skeleton } from "../components/Skeleton";

export default function Loading() {
  return (
    <div className="px-5 py-4 mb-[76px]">
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
