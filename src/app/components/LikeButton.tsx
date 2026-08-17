"use client";

import { useOptimistic, useTransition } from "react";

import Link from "next/link";

import { useDictionary } from "@/lib/i18n/context";
import { Icon } from "./Icon";

const SIZE_CLASS = {
  sm: "px-[10px] py-[6px] gap-1 text-[13px]",
  md: "px-3 py-2 gap-2 text-[14px]",
} as const;

const ICON_SIZE = { sm: "m", md: "l" } as const;

type Props = {
  count: number;
  liked: boolean;
  size: keyof typeof SIZE_CLASS;
  onToggle: () => Promise<void>;
  loginHref?: string;
};

export function LikeButton({ count, liked, size, onToggle, loginHref }: Props) {
  const { detail } = useDictionary();
  const [isPending, startTransition] = useTransition();

  const [optimistic, setOptimistic] = useOptimistic(
    { liked, count },
    (state, nextLiked: boolean) => ({
      liked: nextLiked,
      count: state.count + (nextLiked ? 1 : -1),
    }),
  );

  const handleClick = () => {
    startTransition(async () => {
      setOptimistic(!optimistic.liked);
      await onToggle();
    });
  };

  const className = `w-fit rounded-2xl font-bold flex items-center disabled:opacity-70 ${
    SIZE_CLASS[size]
  } ${
    optimistic.liked
      ? "bg-like-subtle text-like"
      : "border-2 border-default bg-surface text-tertiary"
  }`;

  if (loginHref) {
    return (
      <Link href={loginHref} aria-label={detail.likeAria(count)} className={className}>
        <Icon icon="Heart" size={ICON_SIZE[size]} />
        {count}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={optimistic.liked}
      aria-label={detail.likeAria(optimistic.count)}
      onClick={handleClick}
      disabled={isPending}
      className={className}
    >
      <Icon icon="Heart" size={ICON_SIZE[size]} />
      {optimistic.count}
    </button>
  );
}
