"use client";

import { useState } from "react";

import { useDictionary } from "@/lib/i18n/context";
import { chromeIntentUrl, type Platform } from "@/lib/in-app-browser";
import { Button } from "./Button";

type Props = {
  url: string;
  platform: Platform;
};

export function OpenInBrowser({ url, platform }: Props) {
  const { landing } = useDictionary();
  const [copied, setCopied] = useState(false);

  const openChrome = () => {
    window.location.href = chromeIntentUrl(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (e) {
      console.error("[copy]", e);
    }
  };

  return (
    <div className="rounded-2xl bg-brand-subtle p-4">
      <p className="text-[14px] font-bold text-brand">{landing.inAppTitle}</p>
      <p className="mt-1 text-[13px] leading-[1.5] text-secondary">
        {platform === "android"
          ? landing.inAppDescription
          : landing.inAppGuideIos}
      </p>

      {platform === "android" ? (
        <Button
          content={landing.openInBrowser}
          size="lg"
          onClick={openChrome}
          className="mt-3 w-full"
        />
      ) : (
        <Button
          content={copied ? landing.copied : landing.copyLink}
          size="lg"
          onClick={copy}
          className="mt-3 w-full"
        />
      )}
    </div>
  );
}
