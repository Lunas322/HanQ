"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "../mocks/categories";

const PARAM_KEY = "category";

const CHIP_BASE =
  "relative h-8.5 shrink-0 whitespace-nowrap flex items-center gap-1 text-[13px] px-3 rounded-2xl font-medium cursor-pointer border-[1.5] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand";
const CHIP_ON = "border-brand bg-brand-subtle text-brand";
const CHIP_OFF = "border-default bg-surface text-secondary";

export default function Categories() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const selected = searchParams.getAll(PARAM_KEY);

  const apply = (next: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(PARAM_KEY);
    next.forEach((id) => params.append(PARAM_KEY, id));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggle = (id: string) => {
    apply(
      selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id],
    );
  };

  return (
    <div className="my-4 flex gap-2 overflow-x-auto scrollbar-hide">
      {CATEGORIES.map((category) => {
        const isAll = category.id === "all";
        const isOn = isAll
          ? selected.length === 0
          : selected.includes(category.id);

        return (
            
          <label
            key={category.id}
            className={`${CHIP_BASE} ${isOn ? CHIP_ON : CHIP_OFF}`}>
            <input
              type="checkbox"
              checked={isOn}
              onChange={() => (isAll ? apply([]) : toggle(category.id))}
              className="sr-only"
            />
            {category.emoji} {category.label}
          </label>
        );
      })}
    </div>
  );
}
