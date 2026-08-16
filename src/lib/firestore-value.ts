import { Timestamp } from "firebase-admin/firestore";

export function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function readDate(value: unknown): Date {
  return value instanceof Timestamp ? value.toDate() : new Date();
}
