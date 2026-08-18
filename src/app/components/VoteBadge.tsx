import { optionColor } from "./PollOptionColor";

type Props = {
  label: string;
  index: number;
};

export function VoteBadge({ label, index }: Props) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-[2px] text-[11px] font-bold ${optionColor(index).chip}`}
    >
      {label}
    </span>
  );
}
