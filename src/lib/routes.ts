import type { Language } from "@/types/language";

export function localePath(language: Language, path: string): string {
  return path === "/" ? `/${language}` : `/${language}${path}`;
}

export function stripLocale(pathname: string): string {
  const rest = pathname.split("/").slice(2).join("/");
  return rest === "" ? "/" : `/${rest}`;
}
