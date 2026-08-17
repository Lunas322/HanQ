"use client";

import { useEffect } from "react";

import { useDictionary } from "@/lib/i18n/context";
import { Button } from "./components/Button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  const dictionary = useDictionary();

  useEffect(() => {
    console.error("[error boundary]", error.digest, error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-20 text-center">
      <p className="text-[40px]" aria-hidden="true">
        😵
      </p>

      <div className="flex flex-col gap-1.5">
        <h2 className="text-[17px] font-bold text-ink">
          {dictionary.error.pageTitle}
        </h2>
        <p className="text-[14px] text-tertiary">
          {dictionary.error.pageDescription}
        </p>
      </div>

      <Button content={dictionary.common.retry} size="md" onClick={reset} />

      {error.digest && (
        <p className="text-[12px] text-disabled">
          {dictionary.error.digest(error.digest)}
        </p>
      )}
    </div>
  );
}
