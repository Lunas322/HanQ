import type { AvatarColor } from "../mocks/answers";

// Icon의 sizeClass와 같은 방식. 디자인에 없는 크기가 들어올 수 없게 닫아둔다.
const SIZE_CLASS = {
  sm: "w-[26px] h-[26px] text-[11px]",
  md: "w-8 h-8 text-[13px]",
  lg: "w-[34px] h-[34px] text-[14px]",
  xl: "w-[60px] h-[60px] text-[25px]",
} as const;

const COLOR_CLASS: Record<AvatarColor, string> = {
  blue: "bg-avatar-blue-bg text-avatar-blue-fg",
  purple: "bg-avatar-purple-bg text-avatar-purple-fg",
  red: "bg-avatar-red-bg text-avatar-red-fg",
  green: "bg-avatar-green-bg text-avatar-green-fg",
};

type Props = {
  name: string;
  size: keyof typeof SIZE_CLASS;
  color?: AvatarColor;
};

export function Avatar({ name, size, color = "blue" }: Props) {
  return (
    // 이름은 항상 옆에 텍스트로 같이 나오므로 스크린리더에는 숨긴다. 안 그러면 두 번 읽힌다.
    <div
      aria-hidden="true"
      className={`shrink-0 rounded-2xl font-bold flex justify-center items-center ${SIZE_CLASS[size]} ${COLOR_CLASS[color]}`}
    >
      {name.slice(0, 1)}
    </div>
  );
}
