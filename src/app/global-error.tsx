"use client";

import { useEffect, useSyncExternalStore } from "react";

import { getDictionary, LANGUAGE_COOKIE_NAME } from "@/lib/i18n";
import { isLanguage, type Language } from "@/types/language";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const subscribe = () => () => {};

const serverLanguage = (): Language => "ko";

function readLanguage(): Language {
  const value = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${LANGUAGE_COOKIE_NAME}=`))
    ?.split("=")[1];

  return isLanguage(value) ? value : "ko";
}

export default function GlobalError({ error, reset }: Props) {
  const language = useSyncExternalStore(subscribe, readLanguage, serverLanguage);

  useEffect(() => {
    console.error("[global error]", error.digest, error);
  }, [error]);

  const dictionary = getDictionary(language);

  return (
    <html lang={language}>
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 p-5 text-center">
        <h2 className="text-[17px] font-bold">{dictionary.error.globalTitle}</h2>
        <p className="text-[14px] text-gray-500">
          {dictionary.error.globalDescription}
        </p>
        <button
          type="button"
          onClick={reset}
          className="h-11 rounded-2xl bg-blue-600 px-4 font-bold text-white"
        >
          {dictionary.common.retry}
        </button>
      </body>
    </html>
  );
}
