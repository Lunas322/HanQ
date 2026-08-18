import type { LocalizedText } from "./localized";

export const POLL_MIN_OPTIONS = 2;
export const POLL_MAX_OPTIONS = 4;
export const POLL_OPTION_MAX = 20;

export type RawPoll = {
  optionIds: string[];
  labels: Record<string, LocalizedText>;
  counts: Record<string, number>;
};

export type PollOption = {
  id: string;
  label: string;
  count: number;
};

export type Poll = {
  options: PollOption[];
  totalVotes: number;
};

export function pollOptionId(index: number): string {
  return `o${index + 1}`;
}
