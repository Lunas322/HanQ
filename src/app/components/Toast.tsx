"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const DURATION_MS = 4000;

type Tone = "info" | "error";

type Toast = {
  id: number;
  message: string;
  tone: Tone;
};

const ToastContext = createContext<((message: string, tone?: Tone) => void) | null>(
  null,
);

export function useToast(): (message: string, tone?: Tone) => void {
  const show = use(ToastContext);

  if (show === null) {
    throw new Error("useToast는 ToastProvider 안에서만 쓸 수 있어요.");
  }

  return show;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const show = useCallback((message: string, tone: Tone = "info") => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext value={show}>
      {children}

      {toast && (
        <div
          // 하단 탭바(76px)와 홈 인디케이터 위로 띄운다.
          className="pointer-events-none fixed inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom))] z-100 flex justify-center px-5"
        >
          <p
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className={`max-w-full rounded-xl px-4 py-3 text-[14px] font-medium text-white shadow-[0_4px_16px_0_rgba(25,31,40,0.24)] ${
              toast.tone === "error" ? "bg-like" : "bg-ink"
            }`}
          >
            {toast.message}
          </p>
        </div>
      )}
    </ToastContext>
  );
}
