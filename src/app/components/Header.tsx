import type { ReactNode } from "react";
import { Logo } from "./Logo";
import React from "react";
import { Icon } from "./Icon";

type MainIcon = 'Logo'|'ChevronLeft'|'My'
type Props = {
  children?: ReactNode;
  mainIcon: MainIcon;
  title?: string
};

const LeftIcon: Record<MainIcon,React.ReactNode> = {
  Logo: <Logo size="lg"/>,
  ChevronLeft: <Icon icon="ChevronLeft" size="l" className="text-icon" />,
  My: <div className=" font-black text-[20px]">MY</div>

}

export function Header({ children,mainIcon,title }: Props) {
  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-muted bg-surface pl-5 pr-3">


    {LeftIcon[mainIcon]}

    {title ? (<div className="flex items-center justify-center font-bold">{title}</div>):null}
      {children ? (
        <div className="flex items-center gap-2">{children}</div>
      ) : null}
    </header>
  );
}
