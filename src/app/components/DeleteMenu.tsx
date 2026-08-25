"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import type { FormErrorCode } from "@/lib/form-errors";
import { useDictionary } from "@/lib/i18n/context";
import type { Dictionary } from "@/lib/i18n";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

type Target = keyof Dictionary["deletion"];

type Props = {
  target: Target;
  onDelete: () => Promise<FormErrorCode | null>;
};

export function DeleteMenu({ target, onDelete }: Props) {
  const { common, deletion, formError } = useDictionary();
  const toast = useToast();
  const copy = deletion[target];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<FormErrorCode | null>(null);
  const [isPending, startTransition] = useTransition();

  const isOpen = isMenuOpen || isConfirming;

  useEffect(() => {
    if (!isOpen) return;

    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isPending) return;

      setIsMenuOpen(false);
      setIsConfirming(false);
    };

    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [isOpen, isPending]);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const wasConfirming = useRef(false);

  useEffect(() => {
    if (!isConfirming) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled])",
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", trap);

    return () => {
      window.removeEventListener("keydown", trap);
      body.style.overflow = previousOverflow;
    };
  }, [isConfirming]);

  useEffect(() => {
    if (wasConfirming.current && !isConfirming) {
      triggerRef.current?.focus();
    }

    wasConfirming.current = isConfirming;
  }, [isConfirming]);

  const remove = () => {
    startTransition(async () => {
      const failure = await onDelete();

      if (failure) {
        setError(failure);
        return;
      }

      setIsConfirming(false);
      toast(common.deleted);
    });
  };

  return (
    <div className="relative flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label={copy.menuAria}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
        className="flex items-center text-icon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <Icon size="l" icon="More" />
      </button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-1 w-max min-w-28 overflow-hidden rounded-xl bg-surface py-1 shadow-[0_4px_16px_0_rgba(25,31,40,0.14)]"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsMenuOpen(false);
                setIsConfirming(true);
              }}
              className="w-full px-4 py-2.5 text-left text-[14px] font-medium text-like"
            >
              {common.delete}
            </button>
          </div>
        </>
      )}

      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-title-${target}`}
            className="w-full max-w-xs rounded-2xl bg-surface px-5 pb-4 pt-6"
          >
            <h2
              id={`delete-title-${target}`}
              className="text-center text-[17px] font-bold text-ink"
            >
              {copy.title}
            </h2>
            <p className="mt-2 text-center text-[14px] leading-[1.5] text-tertiary">
              {copy.description}
            </p>

            {error && (
              <p role="alert" className="mt-3 text-center text-[13px] text-like">
                {formError[error]}
              </p>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                autoFocus
                disabled={isPending}
                onClick={() => {
                  setIsConfirming(false);
                  setError(null);
                }}
                className="h-12 flex-1 rounded-xl bg-muted text-[15px] font-bold text-secondary disabled:opacity-60"
              >
                {common.cancel}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={remove}
                className="h-12 flex-1 rounded-xl bg-like text-[15px] font-bold text-white disabled:opacity-60"
              >
                {isPending ? common.deleting : common.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
