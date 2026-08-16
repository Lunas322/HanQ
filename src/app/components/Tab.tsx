"use client";

import { useId, useOptimistic, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type TabItem = {
  value: string;
  label: string;
};

interface TabProps {
  items: TabItem[];
  paramKey?: string;
  className?: string;
}

const TRACK_BASE = "flex w-full rounded-xl bg-muted p-1";
const CELL_BASE =
  "flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg text-[15px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand";
const CELL_ACTIVE =
  "bg-surface font-bold text-ink shadow-[0px_4px_10px_-2px_rgba(0,0,0,0.06),0px_1px_2px_0px_rgba(0,0,0,0.04)]";
const CELL_INACTIVE = "font-medium text-tertiary";

export function Tab({ items, paramKey = "tab", className }: TabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const groupName = useId();

  const [, startTransition] = useTransition();

  const selected = searchParams.get(paramKey) ?? items[0].value;

  const [optimisticSelected, setOptimisticSelected] = useOptimistic(selected);

  const select = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, value);

    startTransition(() => {
      setOptimisticSelected(value);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className={className}>
      <div className={TRACK_BASE}>
        {items.map((item) => {
          const isActive = item.value === optimisticSelected;

          return (
            <label
              key={item.value}
              className={`${CELL_BASE} ${isActive ? CELL_ACTIVE : CELL_INACTIVE}`}
            >
              <input
                type="radio"
                name={groupName}
                value={item.value}
                checked={isActive}
                onChange={() => select(item.value)}
                className="sr-only"
              />
              {item.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
