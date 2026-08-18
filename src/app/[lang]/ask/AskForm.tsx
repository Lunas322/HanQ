"use client";

import { useActionState, useState } from "react";

import { useDictionary } from "@/lib/i18n/context";
import { CONTENT_MAX, TITLE_MAX } from "@/lib/question-rules";
import { Button } from "@/app/components/Button";
import { CategoryPicker } from "@/app/components/CategoryPicker";
import { Notice } from "@/app/components/Notice";
import { PollBuilder } from "@/app/components/PollBuilder";
import { TextField } from "@/app/components/TextField";
import { type AskFormState, submitQuestion } from "./actions";

const INITIAL_STATE: AskFormState = { error: null };

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

  const canSubmit =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    categoryId !== null &&
    (pollLabels === null ||
      pollLabels.every((label) => label.trim().length > 0));

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

      <div className="sticky bottom-0 mt-auto bg-surface px-5 pb-[18px] pt-3 shadow-[0_-4px_16px_0_rgba(25,31,40,0.06)]">
        {state.error && (
          <p role="alert" className="mb-2 text-[13px] text-like">
            {dictionary.formError[state.error]}
          </p>
        )}

        <Button
          content={isPending ? dictionary.ask.submitting : dictionary.ask.submit}
          size="lg"
          type="submit"
          disabled={!canSubmit || isPending}
          className="w-full"
        />
      </div>
    </form>
  );
}
