"use client";

import { useLogin } from "@/hooks/login";
import { useDictionary } from "@/lib/i18n/context";
import { Button } from "./Button";

export function GoogleLoginButton() {
  const { login, isPending, error } = useLogin();
  const { landing } = useDictionary();

  return (
    <>
      <Button
        content={isPending ? landing.loggingIn : landing.login}
        size="lg"
        className="w-full"
        disabled={isPending}
        onClick={login}
      />

      {error && (
        <p role="alert" className="mt-2 text-center text-[13px] text-like">
          {error}
        </p>
      )}
    </>
  );
}
