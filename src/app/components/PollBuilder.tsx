"use client";

import { useDictionary } from "@/lib/i18n/context";
import {
  POLL_MAX_OPTIONS,
  POLL_MIN_OPTIONS,
  POLL_OPTION_MAX,
} from "@/types/poll";
import { optionColor } from "./PollOptionColor";

type Props = {
  labels: string[] | null;
  onChange: (labels: string[] | null) => void;
};

const EMPTY_LABELS = Array.from({ length: POLL_MIN_OPTIONS }, () => "");

export function PollBuilder({ labels, onChange }: Props) {
  const { ask } = useDictionary();

  const update = (index: number, value: string) => {
    onChange((labels ?? []).map((label, i) => (i === index ? value : label)));
  };

  const remove = (index: number) => {
    onChange((labels ?? []).filter((_, i) => i !== index));
  };

  return (
    <fieldset>
      <legend className="text-[14px] font-bold text-secondary">
        {ask.pollLegend}
      </legend>

      <label className="mt-2.5 flex w-fit cursor-pointer items-center gap-2 text-[14px] font-medium text-body">
        <input
          type="checkbox"
          checked={labels !== null}
          onChange={(event) =>
            onChange(event.target.checked ? EMPTY_LABELS : null)
          }
          className="h-4.5 w-4.5 accent-brand"
        />
        {ask.pollEnable}
      </label>

      {labels === null ? (
        <p className="mt-2 text-[12px] text-tertiary">{ask.pollHint}</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {labels.map((label, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${optionColor(index).bar}`}
              />

              <input
                type="text"
                name="pollOption"
                value={label}
                onChange={(event) => update(index, event.target.value)}
                maxLength={POLL_OPTION_MAX}
                aria-label={ask.pollOptionLabel(index + 1)}
                placeholder={ask.pollOptionPlaceholder}
                className="h-12 min-w-0 flex-1 rounded-xl bg-page px-4 text-[15px] text-primary outline-none placeholder:text-disabled focus:outline-2 focus:outline-brand"
              />

              {labels.length > POLL_MIN_OPTIONS && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={ask.pollRemove(index + 1)}
                  className="shrink-0 rounded-xl px-3 py-2 text-[13px] font-bold text-tertiary"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {labels.length < POLL_MAX_OPTIONS && (
            <button
              type="button"
              onClick={() => onChange([...labels, ""])}
              className="h-11 w-fit rounded-xl border-2 border-default px-4 text-[14px] font-bold text-secondary"
            >
              + {ask.pollAdd}
            </button>
          )}
        </div>
      )}
    </fieldset>
  );
}
