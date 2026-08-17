import Image from "next/image";

import type { AvatarColor } from "@/types/user";

const SIZE_CLASS = {
  sm: "w-[26px] h-[26px] text-[11px]",
  md: "w-8 h-8 text-[13px]",
  lg: "w-[34px] h-[34px] text-[14px]",
  xl: "w-[60px] h-[60px] text-[25px]",
  xxl: "w-24 h-24 text-[38px]",
} as const;

const SIZE_PX = { sm: 26, md: 32, lg: 34, xl: 60, xxl: 96 } as const;

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
  photoUrl?: string | null;
};

export function Avatar({ name, size, color = "blue", photoUrl }: Props) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt=""
        width={SIZE_PX[size]}
        height={SIZE_PX[size]}
        className={`shrink-0 rounded-full object-cover ${SIZE_CLASS[size]}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`shrink-0 rounded-full font-bold flex justify-center items-center ${SIZE_CLASS[size]} ${COLOR_CLASS[color]}`}
    >
      {name.slice(0, 1)}
    </div>
  );
}
