import { Skeleton } from "@/app/components/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-6 px-5 pb-5 pt-4">
        <div>
          <Skeleton className="h-5 w-12" />
          <Skeleton className="mt-2 h-13 w-full rounded-xl" />
        </div>

        <div>
          <Skeleton className="h-5 w-12" />
          <Skeleton className="mt-2 h-35 w-full rounded-xl" />
        </div>

        <div>
          <Skeleton className="h-5 w-16" />
          <div className="mt-2.5 flex flex-wrap gap-2">
            {["w-24", "w-24", "w-28", "w-16", "w-16", "w-16", "w-16", "w-24"].map(
              (width, index) => (
                <Skeleton
                  key={index}
                  className={`h-8.5 rounded-full ${width}`}
                />
              ),
            )}
          </div>
        </div>

        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    </div>
  );
}
