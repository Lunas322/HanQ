import { ImageResponse } from "next/og";

import { getDictionary } from "@/lib/i18n";
import { isLanguage } from "@/types/language";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "HanQ";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const language = isLanguage(lang) ? lang : "ko";
  const { meta } = getDictionary(language);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 148, fontWeight: 900 }}>
          <span style={{ color: "#0064ff" }}>Han</span>
          <span style={{ color: "#191f28" }}>Q</span>
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 44,
            fontWeight: 700,
            color: "#4e5968",
            letterSpacing: -1,
          }}
        >
          Multilingual · Realtime Translated Q&amp;A
        </div>

        <div
          style={{
            marginTop: 56,
            display: "flex",
            gap: 20,
            fontSize: 30,
            fontWeight: 600,
            color: "#8b95a1",
          }}
        >
          <span>{meta.title}</span>
          <span>·</span>
          <span>{language}</span>
        </div>
      </div>
    ),
    size,
  );
}
