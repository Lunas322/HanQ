"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useDictionary, useLocalePath } from "@/lib/i18n/context";
import { Icon, type IconName } from "./Icon";

type NavItem = {
  href: string;
  icon: IconName;
  label: string;
};

// flex-1은 + 버튼을 정중앙에 고정하는 장치다. 빼면 양쪽 라벨 폭 차이만큼 + 가 밀린다.
// 그래서 바깥쪽으로 붙이는 건 justify가 아니라 이 안쪽 정렬로 처리한다.
// 바깥 층: 아이콘＋라벨 묶음을 벽쪽으로 민다
const ALIGN_CLASS = {
  start: "justify-start",
  end: "justify-end",
} as const;

type NavLinkProps = {
  item: NavItem;
  isActive: boolean;
  align: keyof typeof ALIGN_CLASS;
};

function NavLink({ item, isActive, align }: NavLinkProps) {
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={`flex flex-1 items-center ${ALIGN_CLASS[align]} ${
        isActive ? "text-brand" : "text-tertiary"
      }`}
    >
      {/* 안쪽 층: 묶음끼리는 서로 중앙. 폭이 내용에 맞게 줄어들어야 위 justify가 먹는다 */}
      <span className="flex flex-col items-center gap-0.5">
        <Icon icon={item.icon} size="xl" />
        <span className="text-[12px] font-medium">{item.label}</span>
      </span>
    </Link>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();
  const { nav } = useDictionary();
  const path = useLocalePath();

  const home: NavItem = { href: path("/home"), icon: "Home", label: nav.home };
  const profile: NavItem = { href: path("/my"), icon: "User", label: nav.profile };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex min-h-19 items-center bg-surface px-8 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <NavLink item={home} isActive={pathname === home.href} align="start" />

      <Link
        href={path("/ask")}
        aria-label={nav.askAria}
        className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-brand text-white"
      >
        <Icon icon="Plus" size="plus" />
      </Link>

      <NavLink item={profile} isActive={pathname === profile.href} align="end" />
    </nav>
  );
}
