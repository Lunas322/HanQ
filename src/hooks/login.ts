import { FirebaseError } from "firebase/app";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { auth, googleProvider } from "@/lib/firebase";

const CANCELLED_CODES = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
]);

export function useLogin() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setIsPending(true);
    setError(null);

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("세션 생성에 실패했습니다.");
      }

      router.replace("/home");
      router.refresh();
    } catch (e) {
      console.error("[login]", e);
      setIsPending(false);

      if (e instanceof FirebaseError && CANCELLED_CODES.has(e.code)) {
        return;
      }

      setError("로그인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  return { login, isPending, error };
}
