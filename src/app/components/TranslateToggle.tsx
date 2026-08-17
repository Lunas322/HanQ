"use client";

import { useDictionary } from "@/lib/i18n/context";
import { Icon } from "./Icon";

type Props = {
  showOriginal: boolean;
  onToggle: () => void;
};

export function TranslateToggle({ showOriginal, onToggle }: Props) {
  const { detail } = useDictionary();

  return (
    <button
      type="button"
      aria-pressed={showOriginal}
      onClick={onToggle}
      className="bg-page w-fit px-3 py-[7px] rounded-2xl flex gap-[5px] items-center text-secondary"
    >
      <Icon icon="Translate" size="s" />
      <span className="font-bold text-[13px]">
        {showOriginal ? detail.showTranslation : detail.showOriginal}
      </span>
    </button>
  );
}
