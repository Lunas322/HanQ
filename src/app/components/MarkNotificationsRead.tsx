"use client";

import { useEffect } from "react";

import { markNotificationsReadAction } from "../notifications/_actions/read";

export function MarkNotificationsRead() {
  useEffect(() => {
    void markNotificationsReadAction();
  }, []);

  return null;
}
