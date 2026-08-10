"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function TranslateToggle() {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    // 라벨 길이가 바뀌므로 폭을 고정하지 않는다.
    <button
      type="button"
      aria-pressed={showOriginal}
      onClick={() => setShowOriginal((showOriginal) => !showOriginal)}
      className="bg-page w-fit px-3 py-[7px] rounded-2xl flex gap-[5px] items-center text-secondary"
    >
      <Icon icon="Translate" size="s" />
      <span className="font-bold text-[13px]">
        {showOriginal ? "번역 보기" : "원문 보기"}
      </span>
    </button>
  );
}
