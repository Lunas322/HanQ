import { Skeleton } from "../../components/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-8 px-5 pb-5 pt-8">
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />

          <div className="flex gap-2">
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        </div>

        <div>
          <Skeleton className="h-5 w-16" />
          <Skeleton className="mt-2 h-13 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
