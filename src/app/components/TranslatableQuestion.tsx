"use client";

import { useState, type ReactNode } from "react";

import { TranslateToggle } from "./TranslateToggle";

type Props = {
  title: string;
  content: string;
  original: { title: string; content: string } | null;
  children: ReactNode;
};

export function TranslatableQuestion({
  title,
  content,
  original,
  children,
}: Props) {
  const [showOriginal, setShowOriginal] = useState(false);

  const shown = showOriginal && original ? original : { title, content };

  return (
    <>
      <h1 className="font-black text-[22px] leading-[1.35] text-primary mb-[14px]">
        {shown.title}
      </h1>

      {children}

      <p className="font-medium text-[16px] leading-[1.65] text-body mb-3">
        {shown.content}
      </p>

      {original && (
        <div className="mb-[18px]">
          <TranslateToggle
            showOriginal={showOriginal}
            onToggle={() => setShowOriginal((value) => !value)}
          />
        </div>
      )}
    </>
  );
}
