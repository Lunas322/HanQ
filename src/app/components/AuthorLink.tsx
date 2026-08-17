import Link from "next/link";
import type { ReactNode } from "react";

import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/routes";
import type { Language } from "@/types/language";

type Props = {
  userId: string;
  name: string;
  language: Language;
  className?: string;
  children: ReactNode;
};

export function AuthorLink({
  userId,
  name,
  language,
  className,
  children,
}: Props) {
  const { profile } = getDictionary(language);

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
