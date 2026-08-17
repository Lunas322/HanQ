import { cookies } from "next/headers";

import { adminAuth } from "@/lib/firebase-admin";
import { getCurrentLanguage } from "@/lib/locale";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { ensureUserDocument, resolveDisplayName } from "@/lib/user";

const EXPIRES_IN_DAYS = 5;
const EXPIRES_IN_MS = EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000;

export async function POST(request: Request): Promise<Response> {
  const body: unknown = await request.json();

  const idToken =
    typeof body === "object" && body !== null && "idToken" in body
      ? body.idToken
      : null;

  if (typeof idToken !== "string") {
    return Response.json({ error: "idToken이 필요합니다." }, { status: 400 });
  }

  try {
    const language = await getCurrentLanguage();

    const [decoded, sessionCookie] = await Promise.all([
      adminAuth.verifyIdToken(idToken),
      adminAuth.createSessionCookie(idToken, { expiresIn: EXPIRES_IN_MS }),
    ]);

    await ensureUserDocument({
      uid: decoded.uid,
      name: resolveDisplayName(decoded.name, language),
      email: decoded.email ?? null,
      languages: language,
    });

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: EXPIRES_IN_MS / 1000,
      path: "/",
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "로그인에 실패했습니다." }, { status: 401 });
  }
}

export async function DELETE(): Promise<Response> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);

  return Response.json({ ok: true });
}
