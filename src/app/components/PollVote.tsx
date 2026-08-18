"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";

import { useDictionary } from "@/lib/i18n/context";
import type { Poll } from "@/types/poll";
import { optionColor } from "./PollOptionColor";

type Props = {
  poll: Poll;
  votedOptionId: string | null;
  onVote: (optionId: string) => Promise<void>;
  loginHref?: string;
};

type Tally = {
  counts: Record<string, number>;
  votedOptionId: string | null;
};

function percent(count: number, total: number): number {
  return total === 0 ? 0 : Math.round((count / total) * 100);
}

export function PollVote({ poll, votedOptionId, onVote, loginHref }: Props) {
  const { detail } = useDictionary();
  const [isPending, startTransition] = useTransition();

  const [tally, setTally] = useOptimistic<Tally, string>(
    {
      counts: Object.fromEntries(
        poll.options.map((option) => [option.id, option.count]),
      ),
      votedOptionId,
    },
    (current, nextId) => {
      if (current.votedOptionId === nextId) {
        return current;
      }

      const counts = {
        ...current.counts,
        [nextId]: (current.counts[nextId] ?? 0) + 1,
      };

      if (current.votedOptionId) {
        counts[current.votedOptionId] =
          (counts[current.votedOptionId] ?? 0) - 1;
      }

      return { counts, votedOptionId: nextId };
    },
  );

  const total = Object.values(tally.counts).reduce((sum, n) => sum + n, 0);
  const hasVoted = tally.votedOptionId !== null;

  const handleVote = (optionId: string) => {
    startTransition(async () => {
      setTally(optionId);
      await onVote(optionId);
    });
  };

  return (
    <section className="w-full rounded-2xl border-2 border-muted bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-black text-primary">
          {detail.pollHeading}
        </h2>
        <span className="shrink-0 text-[12px] font-medium text-tertiary tabular-nums">
          {total === 0 ? detail.pollEmpty : detail.pollTotal(total)}
        </span>
      </div>

      <ul className="flex flex-col gap-2">
        {poll.options.map((option, index) => {
          const count = tally.counts[option.id] ?? 0;
          const ratio = percent(count, total);
          const isChosen = tally.votedOptionId === option.id;
          const color = optionColor(index);

          const inner = (
            <>
              {hasVoted && (
                <span
                  aria-hidden="true"
                  style={{ width: `${ratio}%` }}
                  className={`absolute inset-y-0 left-0 rounded-xl opacity-15 transition-[width] duration-300 ${color.bar}`}
                />
              )}

              <span className="relative flex-1 truncate text-left">
                {option.label}
              </span>

              {hasVoted && (
                <span className="relative shrink-0 tabular-nums">{ratio}%</span>
              )}
            </>
          );

          const shape = `relative flex h-12 w-full items-center gap-2 overflow-hidden rounded-xl border-2 px-4 text-[15px] font-bold ${
            isChosen
              ? `${color.border} ${color.chip}`
              : "border-default bg-surface text-secondary"
          }`;

          return (
            <li key={option.id}>
              {loginHref ? (
                <Link
                  href={loginHref}
                  aria-label={detail.pollVoteAria(option.label)}
                  className={shape}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  type="button"
                  aria-pressed={isChosen}
                  aria-label={
                    hasVoted
                      ? detail.pollResultAria(option.label, ratio)
                      : detail.pollVoteAria(option.label)
                  }
                  disabled={isPending}
                  onClick={() => handleVote(option.id)}
                  className={`${shape} disabled:opacity-70`}
                >
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {hasVoted && !loginHref && (
        <p className="mt-2.5 text-[12px] text-tertiary">{detail.pollChange}</p>
      )}
    </section>
  );
}
