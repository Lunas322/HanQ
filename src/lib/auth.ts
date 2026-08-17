import "server-only";

import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { resolveDisplayName } from "@/lib/user";

type CurrentUser = {
  uid: string;
  name: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!value) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(value, false);

    return { uid: decoded.uid, name: resolveDisplayName(decoded.name) };
  } catch {
    return null;
  }
}
