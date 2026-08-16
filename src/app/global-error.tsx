"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[global error]", error.digest, error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 p-5 text-center">
        <h2 className="text-[17px] font-bold">문제가 발생했어요</h2>
        <p className="text-[14px] text-gray-500">
          페이지를 다시 불러와 주세요.
        </p>
        <button
          type="button"
          onClick={reset}
          className="h-11 rounded-2xl bg-blue-600 px-4 font-bold text-white"
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}
