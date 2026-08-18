import {
  browserSessionPersistence,
  getRedirectResult,
  setPersistence,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { auth, googleProvider } from "@/lib/firebase";
import { useDictionary, useLanguage } from "@/lib/i18n/context";
import { localePath } from "@/lib/routes";

async function exchangeSession(user: User, failureMessage: string): Promise<void> {
  const idToken = await user.getIdToken();

  const response = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error(failureMessage);
  }

  await signOut(auth);
}

export function useLogin() {
  const router = useRouter();
  const language = useLanguage();
  const { landing } = useDictionary();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const complete = async () => {
      try {
        await setPersistence(auth, browserSessionPersistence);

        const credential = await getRedirectResult(auth);

        if (!credential || !active) {
          return;
        }

        setIsPending(true);

        await exchangeSession(credential.user, landing.sessionFailed);

        router.replace(localePath(language, "/home"));
        router.refresh();
      } catch (e) {
        console.error("[login:redirect]", e);

        if (active) {
          setIsPending(false);
          setError(landing.loginFailed);
        }
      }
    };

    void complete();

    return () => {
      active = false;
    };
  }, [router, language, landing]);

  const login = async () => {
    setIsPending(true);
    setError(null);

    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithRedirect(auth, googleProvider);
    } catch (e) {
      console.error("[login]", e);
      setIsPending(false);
      setError(landing.loginFailed);
    }
  };

  return { login, isPending, error };
}
