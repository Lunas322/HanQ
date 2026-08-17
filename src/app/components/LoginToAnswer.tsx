import Link from "next/link";

import { getServerDictionary } from "@/lib/i18n/server";

export async function LoginToAnswer({ href }: { href: string }) {
  const { detail } = await getServerDictionary();

  return (
    <div className="sticky bottom-0 border-t border-muted bg-surface px-4 pb-[14px] pt-[10px]">
      <Link
        href={href}
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-brand text-[15px] font-bold text-white"
      >
        {detail.loginToAnswer}
      </Link>
    </div>
  );
}
