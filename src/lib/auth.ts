import "server-only";

import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

export const SESSION_COOKIE_NAME = "session";

export async function getCurrentUser(): Promise<{ uid: string } | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!value) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(value, false);
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}
