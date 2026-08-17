"use client";

import { useState } from "react";

import { TranslateToggle } from "./TranslateToggle";

type Props = {
  content: string;
  original: { content: string } | null;
};

export function TranslatableAnswer({ content, original }: Props) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <>
      <p className="text-[15px] leading-[1.6] text-body">
        {showOriginal && original ? original.content : content}
      </p>

      {original && (
        <TranslateToggle
          showOriginal={showOriginal}
          onToggle={() => setShowOriginal((value) => !value)}
        />
      )}
    </>
  );
}
