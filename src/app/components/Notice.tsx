type Props = {
  emoji: string;
  children: React.ReactNode;
};

export function Notice({ emoji, children }: Props) {
  return (
    <p className="flex gap-2.5 rounded-2xl bg-brand-subtle px-4 py-3.5 text-[13px] font-medium leading-[20px] text-secondary">
      <span aria-hidden="true" className="text-[16px] leading-[20px]">
        {emoji}
      </span>
      <span>{children}</span>
    </p>
  );
}
