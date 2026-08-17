export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const PRIVATE_PATHS = [
  "/home",
  "/ask",
  "/my",
  "/notifications",
  "/profile",
] as const;
