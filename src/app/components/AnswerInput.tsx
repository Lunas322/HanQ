"use client";

import { useActionState, useEffect, useRef } from "react";

import { ANSWER_MAX } from "@/lib/answer-rules";
import { useDictionary } from "@/lib/i18n/context";
import {
  type AnswerFormState,
  submitAnswer,
} from "../detail/[id]/_actions/answer";
import { Button } from "./Button";

const INITIAL_STATE: AnswerFormState = { error: null };

type Props = {
  questionId: string;
};

export function AnswerInput({ questionId }: Props) {
  const dictionary = useDictionary();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    submitAnswer,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (!isPending && state.error === null) {
      formRef.current?.reset();
    }
  }, [isPending, state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="sticky bottom-0 border-t border-muted bg-surface px-4 pb-[14px] pt-[10px]"
    >
      <input type="hidden" name="questionId" value={questionId} />

      {state.error && (
        <p role="alert" className="mb-2 text-[13px] text-like">
          {dictionary.formError[state.error]}
        </p>
      )}

      <div className="flex gap-2 items-center">
        <label htmlFor="answer" className="sr-only">
          {dictionary.detail.answerInputLabel}
        </label>
        <input
          id="answer"
          name="answer"
          type="text"
          maxLength={ANSWER_MAX}
          disabled={isPending}
          placeholder={dictionary.detail.answerPlaceholder}
          className="h-11 min-w-0 flex-1 rounded-2xl bg-page px-4 text-[15px] text-primary outline-none placeholder:text-disabled disabled:opacity-60"
        />
        <Button
          content={isPending ? dictionary.common.submitting : dictionary.common.submit}
          size="md"
          type="submit"
          disabled={isPending}
          className="w-16 shrink-0"
        />
      </div>
    </form>
  );
}
