import { QuestionCardSkeleton } from "@/app/components/QuestionCardSkeleton";
import { Skeleton } from "@/app/components/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-dvh bg-surface px-6 py-5 pb-[calc(114px+env(safe-area-inset-bottom))]">
      <div className="flex w-full justify-end">
        <Skeleton className="h-[30px] w-32 rounded-full" />
      </div>

      <Skeleton className="mt-2 h-10 w-24" />

      <div className="mt-5.5 flex flex-col gap-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-8 w-36" />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>

      <Skeleton className="mt-8 h-4 w-32" />

      {Array.from({ length: 3 }, (_, index) => (
        <QuestionCardSkeleton key={index} />
      ))}

      <div className="fixed bottom-0 left-0 right-0 bg-surface px-4 pt-3 pb-[calc(1.375rem+env(safe-area-inset-bottom))]">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="mx-auto mt-[10px] h-4 w-56" />
      </div>
    </main>
  );
}
