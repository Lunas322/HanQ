import { Skeleton } from "@/app/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-dvh flex flex-col bg-surface">
      <span role="status" className="sr-only">
        질문을 불러오는 중
      </span>

      <section className="px-5 pb-5 pt-[18px] flex flex-col items-start">
        <Skeleton className="mb-3 h-[26px] w-24 rounded-full" />

        <Skeleton className="mb-2 h-7 w-full" />
        <Skeleton className="mb-[14px] h-7 w-2/3" />

        <div className="flex gap-2 items-center mb-[14px]">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>

        <Skeleton className="mb-2 h-5 w-full" />
        <Skeleton className="mb-2 h-5 w-full" />
        <Skeleton className="mb-[18px] h-5 w-1/2" />

        <Skeleton className="h-10 w-20 rounded-2xl" />
      </section>

      <div className="bg-muted w-full h-2 shrink-0" />
    </div>
  );
}
