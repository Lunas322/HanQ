"use client";

import { useLogin } from "@/hooks/login";
import { Button } from "./Button";

export function GoogleLoginButton() {
  const { login, isPending, error } = useLogin();

  return (
    <>
      <Button
        content={isPending ? "로그인 중..." : "Google로 3초 만에 시작하기"}
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
