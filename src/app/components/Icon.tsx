import type { ReactNode } from "react";

export type IconName =
  | "Bell"
  | "ChevronLeft"
  | "Close"
  | "Comment"
  | "Heart"
  | "Home"
  | "More"
  | "Plus"
  | "Translate"
  | "User";

// 색은 여기서 정하지 않는다. stroke="currentColor"라서 부모의 text-* 가 색을 결정한다.
const ICON_PATHS: Record<IconName, ReactNode> = {
  Bell: (
    <path
      d="M10 20C10 20.5304 10.2107 21.0391 10.5858 21.4142C10.9609 21.7893 11.4696 22 12 22C12.5304 22 13.0391 21.7893 13.4142 21.4142C13.7893 21.0391 14 20.5304 14 20M6 9C6 7.4087 6.63214 5.88258 7.75736 4.75736C8.88258 3.63214 10.4087 3 12 3C13.5913 3 15.1174 3.63214 16.2426 4.75736C17.3679 5.88258 18 7.4087 18 9C18 14 20 15 20 15H4C4 15 6 14 6 9Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  ChevronLeft: (
    <path d="M15 5L8 12L15 19" strokeLinecap="round" strokeLinejoin="round" />
  ),
  Close: (
    <path d="M6 6L18 18M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
  ),
  Comment: (
    <path
      d="M4 5H20V16H9L5 19V16H4V5Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  Heart: (
    <path
      d="M12 20.7C12 20.7 2.5 14.9 2.5 8.90005C2.5 5.60005 5.1 3.30005 8 3.30005C9.8 3.30005 11.1 4.40005 12 5.70005C12.9 4.40005 14.2 3.30005 16 3.30005C18.9 3.30005 21.5 5.60005 21.5 8.90005C21.5 14.9 12 20.7 12 20.7Z"
      strokeLinecap="round"
    />
  ),
  Home: (
    <path
      d="M3 10.5L12 3L21 10.5M5 9.5V20C5 20.2652 5.10536 20.5196 5.29289 20.7071C5.48043 20.8946 5.73478 21 6 21H10V15H14V21H18C18.2652 21 18.5196 20.8946 18.7071 20.7071C18.8946 20.5196 19 20.2652 19 20V9.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  // 점 3개는 선이 아니라 면이라서, 부모 svg의 fill/stroke를 자식에서 덮어쓴다.
  More: (
    <>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  Plus: (
    <path d="M12 5V19M5 12H19" strokeLinecap="round" strokeLinejoin="round" />
  ),
  Translate: (
    <>
      <path d="M2 5H14M7 2H8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4 14L10 8L12 5M5 8L11 14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 22L17 12L12 22M14 18H20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  User: (
    <>
      <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" />
      <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" strokeLinecap="round" />
    </>
  ),
};

const sizeClass = {
  s: "w-[16px] h-[16px]",
  m: "w-[18px] h-[18px]",
  l: "w-[20px] h-[20px]",
  xl: "w-[22px] h-[22px]",
  plus: "w-[24px] h-[24px]",
} as const;

type Size = keyof typeof sizeClass;

type Props = {
  icon: IconName;
  size: Size;
  className?: string;
};

export function Icon({ icon, size, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
      className={`text-icon ${sizeClass[size]} ${className ?? ""}`}
    >
      {ICON_PATHS[icon]}
    </svg>
  );
}
