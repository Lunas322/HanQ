import { Skeleton } from "./Skeleton";

export function ProfileSummarySkeleton() {
  return (
    <section className="flex w-full items-center gap-3.5 bg-surface px-5 pt-4 pb-6">
      <Skeleton className="h-[60px] w-[60px] shrink-0 rounded-full" />

      <div className="flex min-w-0 flex-col gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    </section>
  );
}
