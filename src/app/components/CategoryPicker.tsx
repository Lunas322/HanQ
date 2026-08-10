import { CATEGORIES } from "../mocks/categories";
import { Chip } from "./Chip";

type Props = {
  value: string | null;
  onChange: (id: string) => void;
};

export function CategoryPicker({ value, onChange }: Props) {
  return (
    <fieldset>
      <legend className="text-[14px] font-bold text-secondary">카테고리</legend>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Chip
            key={category.id}
            type="radio"
            name="category"
            label={category.label}
            emoji={category.emoji}
            checked={value === category.id}
            onToggle={() => onChange(category.id)}
          />
        ))}
      </div>
    </fieldset>
  );
}
