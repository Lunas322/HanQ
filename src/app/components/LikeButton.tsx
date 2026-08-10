"use client";

import { useState } from "react";
import { Icon } from "./Icon";

const SIZE_CLASS = {
  sm: "px-[10px] py-[6px] gap-1 text-[13px]",
  md: "px-3 py-2 gap-2 text-[14px]",
} as const;

const ICON_SIZE = { sm: "m", md: "l" } as const;

type Props = {
  count: number;
  size: keyof typeof SIZE_CLASS;
  defaultLiked?: boolean;
};

export function LikeButton({ count, size, defaultLiked = false }: Props) {
  const [liked, setLiked] = useState(defaultLiked);

  // count는 defaultLiked가 반영된 값이다. 지금 상태와의 차이만 더하고 뺀다.
  const displayCount = count + (liked ? 1 : 0) - (defaultLiked ? 1 : 0);

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={`좋아요 ${displayCount}개`}
      onClick={() => setLiked((liked) => !liked)}
      className={`w-fit rounded-2xl font-bold flex items-center ${
        SIZE_CLASS[size]
      } ${
        liked
          ? "bg-like-subtle text-like"
          : "border-2 border-default bg-surface text-tertiary"
      }`}
    >
      <Icon icon="Heart" size={ICON_SIZE[size]} />
      {displayCount}
    </button>
  );
}
