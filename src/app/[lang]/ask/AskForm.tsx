"use client";

import { useActionState, useEffect, useState } from "react";

import { useDictionary } from "@/lib/i18n/context";
import { CONTENT_MAX, TITLE_MAX } from "@/lib/question-rules";
import { Button } from "@/app/components/Button";
import { CategoryPicker } from "@/app/components/CategoryPicker";
import { Notice } from "@/app/components/Notice";
import { PollBuilder } from "@/app/components/PollBuilder";
import { TextField } from "@/app/components/TextField";
import { type AskFormState, submitQuestion } from "./actions";

const INITIAL_STATE: AskFormState = { error: null };

// 오류를 문구로만 알리면 사용자가 어느 칸이 비었는지 직접 찾아야 한다.
const FIELD_SELECTOR: Partial<Record<NonNullable<AskFormState["error"]>, string>> = {
  TITLE_REQUIRED: "#title",
  TITLE_TOO_LONG: "#title",
  CONTENT_REQUIRED: "#content",
  CONTENT_TOO_LONG: "#content",
  CATEGORY_REQUIRED: "input[name='categoryId']",
  POLL_TOO_FEW_OPTIONS: "input[name='pollOption']",
  POLL_TOO_MANY_OPTIONS: "input[name='pollOption']",
  POLL_OPTION_REQUIRED: "input[name='pollOption']",
  POLL_OPTION_TOO_LONG: "input[name='pollOption']",
  POLL_OPTION_DUPLICATED: "input[name='pollOption']",
};

export function AskForm() {
  const dictionary = useDictionary();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [pollLabels, setPollLabels] = useState<string[] | null>(null);

  const [state, formAction, isPending] = useActionState(
    submitQuestion,
    INITIAL_STATE,
  );

  useEffect(() => {
    const selector = state.error && FIELD_SELECTOR[state.error];

    if (!selector) return;

    const field = document.querySelector<HTMLElement>(selector);

    field?.scrollIntoView({ block: "center", behavior: "smooth" });
    field?.focus({ preventScroll: true });
  }, [state]);

  return (
    <form action={formAction} className="flex flex-1 flex-col">
      <div className="flex flex-col gap-6 px-5 pb-5 pt-4">
        <TextField
          id="title"
          label={dictionary.ask.titleLabel}
          value={title}
          onChange={setTitle}
          maxLength={TITLE_MAX}
          placeholder={dictionary.ask.titlePlaceholder}
        />

        <TextField
          id="content"
          label={dictionary.ask.contentLabel}
          value={content}
          onChange={setContent}
          maxLength={CONTENT_MAX}
          placeholder={dictionary.ask.contentPlaceholder}
          multiline
        />

        <CategoryPicker value={categoryId} onChange={setCategoryId} />

        <PollBuilder labels={pollLabels} onChange={setPollLabels} />

        <Notice emoji="🌐">{dictionary.ask.translationNotice}</Notice>
      </div>

      <div className="sticky bottom-0 mt-auto bg-surface px-5 pb-[calc(18px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_0_rgba(25,31,40,0.06)]">
        {state.error && (
          <p role="alert" className="mb-2 text-[13px] text-like">
            {dictionary.formError[state.error]}
          </p>
        )}

        <Button
          content={isPending ? dictionary.ask.submitting : dictionary.ask.submit}
          size="lg"
          type="submit"
          disabled={isPending}
          className="w-full"
        />
      </div>
    </form>
  );
}
