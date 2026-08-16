import { FirebaseError } from "firebase/app";
import {
  inMemoryPersistence,
  setPersistence,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { auth, googleProvider } from "@/lib/firebase";
import { useDictionary } from "@/lib/i18n/context";

const CANCELLED_CODES = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
]);

export function useLogin() {
  const router = useRouter();
  const { landing } = useDictionary();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setIsPending(true);
    setError(null);

    try {
      await setPersistence(auth, inMemoryPersistence);

      const credential = await signInWithPopup(auth, googleProvider);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error(landing.sessionFailed);
      }

      router.replace("/home");
      router.refresh();
    } catch (e) {
      console.error("[login]", e);
      setIsPending(false);

      if (e instanceof FirebaseError && CANCELLED_CODES.has(e.code)) {
        return;
      }

      setError(landing.loginFailed);
    }
  };

  return { login, isPending, error };
}
