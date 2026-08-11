const BASE =
  "relative h-8.5 shrink-0 whitespace-nowrap flex items-center gap-1 text-[13px] px-3 rounded-full font-medium cursor-pointer border-[1.5px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand";
const ON = "border-brand bg-brand-subtle text-brand";
const OFF = "border-default bg-surface text-secondary";

type Props = {
  label: string;
  emoji?: string;
  checked: boolean;
  onToggle: () => void;
  type?: "checkbox" | "radio";
  name?: string;
};

export function Chip({
  label,
  emoji,
  checked,
  onToggle,
  type = "checkbox",
  name,
}: Props) {
  return (
    <label className={`${BASE} ${checked ? ON : OFF}`}>
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      {emoji && <span aria-hidden="true">{emoji}</span>}
      <span>{label}</span>
    </label>
  );
}
