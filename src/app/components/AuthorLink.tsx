import Link from "next/link";
import type { ReactNode } from "react";

import { getServerDictionary } from "@/lib/i18n/server";
import { getCurrentLanguage } from "@/lib/locale";
import { localePath } from "@/lib/routes";

type Props = {
  userId: string;
  name: string;
  className?: string;
  children: ReactNode;
};

export async function AuthorLink({ userId, name, className, children }: Props) {
  const [{ profile }, language] = await Promise.all([
    getServerDictionary(),
    getCurrentLanguage(),
  ]);

  return (
    <Link
      href={localePath(language, `/users/${userId}`)}
      aria-label={profile.linkAria(name)}
      className={`flex min-w-0 items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
