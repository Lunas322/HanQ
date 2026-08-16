"use client";

import { useEffect } from "react";

import { Button } from "./components/Button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
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
          화면을 불러오지 못했어요
        </h2>
        <p className="text-[14px] text-tertiary">
          잠시 후 다시 시도해 주세요. 계속 안 되면 새로고침해 주세요.
        </p>
      </div>

      <Button content="다시 시도" size="md" onClick={reset} />

      {error.digest && (
        <p className="text-[12px] text-disabled">오류 코드 {error.digest}</p>
      )}
    </div>
  );
}
