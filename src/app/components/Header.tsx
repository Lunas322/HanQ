import type { ReactNode } from "react";
import { Logo } from "./Logo";
import React from "react";
import { BackButton } from "./BackButton";

type MainIcon = 'Logo'|'ChevronLeft'|'My'
type Props = {
  children?: ReactNode;
  mainIcon: MainIcon;
  title?: string
  // 본문에 별도의 h1이 없는 화면에서만 켠다. 상세·프로필처럼 본문이 h1을 가진 화면에서 켜면 h1이 둘이 된다.
  titleAsHeading?: boolean;
};

const LeftIcon: Record<MainIcon,React.ReactNode> = {
  Logo: <Logo size="lg"/>,
  ChevronLeft: <BackButton fallback="/home" />,
  My: <div className=" font-black text-[20px]">MY</div>

}

export function Header({ children,mainIcon,title,titleAsHeading = false }: Props) {
  const TitleTag = titleAsHeading ? "h1" : "span";

  return (
    // 양옆 1fr이 남은 공간을 똑같이 나눠 가지므로, 좌우 내용 폭과 무관하게 가운데가 진짜 가운데다.
    // 세 칸을 항상 렌더해야 한다. 비었다고 건너뛰면 다음 요소가 그 칸으로 밀려 들어온다.
    <header className="grid h-14 w-full grid-cols-[1fr_auto_1fr] items-center border-b border-muted bg-surface pl-5 pr-3">
      <div className="flex items-center justify-self-start">
        {LeftIcon[mainIcon]}
      </div>

      <TitleTag className="min-w-0 truncate text-center font-bold">{title}</TitleTag>

      <div className="flex items-center gap-2 justify-self-end">{children}</div>
    </header>
  );
}
