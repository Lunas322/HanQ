
const sizeClass = {
  xl: "text-[28px]",
  lg: "text-[22px]",
  md: "text-[17px]",
  sm: "text-[15px]",
} as const;

type Size = keyof typeof sizeClass;

type Props = {
  size: Size;
  Tag?: "h1" | "h2" | "p" | "span";
};

export function Logo({ size, Tag = "span" }: Props) {
  return (
    <Tag className={`font-black ${sizeClass[size]}`}>
      <span className="text-brand">Han</span>
      <span className="text-ink">Q</span>
    </Tag>
  );
}
