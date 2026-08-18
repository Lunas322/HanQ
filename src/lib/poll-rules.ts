import type { FormErrorCode } from "@/lib/form-errors";
import {
  POLL_MAX_OPTIONS,
  POLL_MIN_OPTIONS,
  POLL_OPTION_MAX,
} from "@/types/poll";

export type PollErrorCode = Extract<
  FormErrorCode,
  | "POLL_TOO_FEW_OPTIONS"
  | "POLL_TOO_MANY_OPTIONS"
  | "POLL_OPTION_REQUIRED"
  | "POLL_OPTION_TOO_LONG"
  | "POLL_OPTION_DUPLICATED"
>;

export function validatePollLabels(labels: string[]): PollErrorCode | null {
  if (labels.length === 0) {
    return null;
  }

  if (labels.length < POLL_MIN_OPTIONS) {
    return "POLL_TOO_FEW_OPTIONS";
  }

  if (labels.length > POLL_MAX_OPTIONS) {
    return "POLL_TOO_MANY_OPTIONS";
  }

  if (labels.some((label) => label.length === 0)) {
    return "POLL_OPTION_REQUIRED";
  }

  if (labels.some((label) => label.length > POLL_OPTION_MAX)) {
    return "POLL_OPTION_TOO_LONG";
  }

  if (new Set(labels).size !== labels.length) {
    return "POLL_OPTION_DUPLICATED";
  }

  return null;
}
