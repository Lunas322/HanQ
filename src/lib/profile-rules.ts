import type { FormErrorCode } from "@/lib/form-errors";

export const NAME_MIN = 2;
export const NAME_MAX = 20;

export const IMAGE_MAX_BYTES = 2 * 1024 * 1024;

export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type NameErrorCode = Extract<
  FormErrorCode,
  "NAME_REQUIRED" | "NAME_TOO_SHORT" | "NAME_TOO_LONG"
>;

export type ImageErrorCode = Extract<
  FormErrorCode,
  "IMAGE_TYPE_INVALID" | "IMAGE_TOO_LARGE"
>;

export function validateName(name: string): NameErrorCode | null {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return "NAME_REQUIRED";
  }

  if (trimmed.length < NAME_MIN) {
    return "NAME_TOO_SHORT";
  }

  if (trimmed.length > NAME_MAX) {
    return "NAME_TOO_LONG";
  }

  return null;
}

export function validateImage(file: {
  type: string;
  size: number;
}): ImageErrorCode | null {
  if (!IMAGE_TYPES.some((type) => type === file.type)) {
    return "IMAGE_TYPE_INVALID";
  }

  if (file.size > IMAGE_MAX_BYTES) {
    return "IMAGE_TOO_LARGE";
  }

  return null;
}
