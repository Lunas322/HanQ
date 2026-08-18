const OPTION_COLORS = [
  {
    bar: "bg-brand",
    chip: "bg-brand-subtle text-brand",
    border: "border-brand",
  },
  {
    bar: "bg-like",
    chip: "bg-like-subtle text-like",
    border: "border-like",
  },
  {
    bar: "bg-avatar-purple-fg",
    chip: "bg-avatar-purple-bg text-avatar-purple-fg",
    border: "border-avatar-purple-fg",
  },
  {
    bar: "bg-avatar-green-fg",
    chip: "bg-avatar-green-bg text-avatar-green-fg",
    border: "border-avatar-green-fg",
  },
] as const;

export function optionColor(index: number) {
  return OPTION_COLORS[index % OPTION_COLORS.length];
}
