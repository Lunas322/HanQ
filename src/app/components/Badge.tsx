type Props = {
  emoji: string;
  label: string;
};

export function Badge({ emoji, label }: Props) {
  return (
    <div className="bg-muted rounded-2xl w-fit flex px-[10px] py-[5px] gap-1 items-center">
      <span aria-hidden="true">{emoji}</span>
      <span className="text-[12px] text-secondary font-medium">{label}</span>
    </div>
  );
}
