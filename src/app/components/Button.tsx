// 크기는 닫아두고(Icon의 sizeClass와 같은 방식), 폭·여백 같은 배치는 className으로 호출부가 정한다.
const SIZE_CLASS = {
  md: "h-11 px-3 text-[15px]",
  lg: "h-14 px-5 text-[17px]",
} as const;

const FILL_BASE = "rounded-2xl font-bold whitespace-nowrap";
const FILL_DISABLED = "bg-muted text-disabled";
const FILL_ENABLED =
  "bg-brand text-white active:text-brand active:bg-brand-subtle";

interface ButtonProps {
  content: string;
  size: keyof typeof SIZE_CLASS;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Button({
  content,
  size,
  type = "button",
  disabled = false,
  className,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${FILL_BASE} ${SIZE_CLASS[size]} ${
        disabled ? FILL_DISABLED : FILL_ENABLED
      } ${className ?? ""}`}
    >
      {content}
    </button>
  );
}
