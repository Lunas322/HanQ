import type { ReactNode } from "react";
import { Logo } from "./Logo";

type Props = {
  children?: ReactNode;
};

export function Header({ children }: Props) {
  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-muted bg-surface pl-5 pr-3">
      <Logo size="lg" />
      {children ? (
        <div className="flex items-center gap-2">{children}</div>
      ) : null}
    </header>
  );
}
