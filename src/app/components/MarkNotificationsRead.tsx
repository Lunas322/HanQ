"use client";

import { useEffect } from "react";

import { markNotificationsReadAction } from "@/app/[lang]/notifications/_actions/read";

export function MarkNotificationsRead() {
  useEffect(() => {
    void markNotificationsReadAction();
  }, []);

  return null;
}
