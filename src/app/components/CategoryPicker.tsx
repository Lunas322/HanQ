"use client";

import { CATEGORIES } from "@/lib/categories";
import { useDictionary } from "@/lib/i18n/context";
import { Chip } from "./Chip";

type Props = {
  value: string | null;
  onChange: (id: string) => void;
};

export function CategoryPicker({ value, onChange }: Props) {
  const dictionary = useDictionary();

  return (
    <fieldset>
      <legend className="text-[14px] font-bold text-secondary">
        {dictionary.ask.categoryLegend}
      </legend>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Chip
            key={category.id}
            type="radio"
            name="categoryId"
            value={category.id}
            label={dictionary.category[category.id]}
            emoji={category.emoji}
            checked={value === category.id}
            onToggle={() => onChange(category.id)}
          />
        ))}
      </div>
    </fieldset>
  );
}
