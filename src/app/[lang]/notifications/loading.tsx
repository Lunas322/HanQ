import { LoadingAnnouncement } from "@/app/components/LoadingAnnouncement";
import { Skeleton } from "@/app/components/Skeleton";

export default function Loading() {
  return (
    <>
      <LoadingAnnouncement />

      <ul className="divide-y divide-muted">
        {Array.from({ length: 5 }, (_, index) => (
          <li key={index} className="flex items-start gap-3 px-5 py-4">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
