"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { useDictionary } from "@/lib/i18n/context";
import { Chip } from "./Chip";

const PARAM_KEY = "category";

export default function Categories() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dictionary = useDictionary();

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
      <Chip
        label={dictionary.home.allCategories}
        checked={selected.length === 0}
        onToggle={() => apply([])}
      />
      {CATEGORIES.map((category) => (
        <Chip
          key={category.id}
          label={dictionary.category[category.id]}
          emoji={category.emoji}
          checked={selected.includes(category.id)}
          onToggle={() => toggle(category.id)}
        />
      ))}
    </div>
  );
}
