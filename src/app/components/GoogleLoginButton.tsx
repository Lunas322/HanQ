"use client";

import { useSyncExternalStore } from "react";

import { useLogin } from "@/hooks/login";
import { useDictionary } from "@/lib/i18n/context";
import { isInAppBrowser, platformOf } from "@/lib/in-app-browser";
import { Button } from "./Button";
import { OpenInBrowser } from "./OpenInBrowser";

const subscribe = () => () => {};

const serverUserAgent = () => "";

const readUserAgent = () => navigator.userAgent;

export function GoogleLoginButton({ url }: { url: string }) {
  const { login, isPending, error } = useLogin();
  const { landing } = useDictionary();

  const userAgent = useSyncExternalStore(
    subscribe,
    readUserAgent,
    serverUserAgent,
  );

  if (isInAppBrowser(userAgent)) {
    return <OpenInBrowser url={url} platform={platformOf(userAgent)} />;
  }

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
