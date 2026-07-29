const sizeClass = {
  Logo: "text-[28px] font-bold",
  lg: "text-[22px] font-bold",
  md: "text-[17px] font-bold",
  sm: "text-[15px] font-medium",
} 

type Size = keyof typeof sizeClass;

type Props = {
  size: Size;
  Tag?: "h1" | "h2" | "p" | "span";
};

export function Logo({ size, Tag = "span" }: Props) {
  return (
    <Tag className={sizeClass[size]}>
      <span className="text-[#0064ff]">Han</span>
      <span>Q</span>
    </Tag>
  );
}
