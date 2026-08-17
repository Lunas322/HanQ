import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";

import { LanguageProvider } from "@/lib/i18n/context";
import { getDictionary } from "@/lib/i18n";
import { isLanguage, LANGUAGES } from "@/types/language";
import "@/app/globals.css";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params;

  if (!isLanguage(lang)) {
    return {};
  }

  const { meta } = getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: meta.title, template: `%s | ${meta.title}` },
    description: meta.description,
    keywords: meta.keywords,
    applicationName: meta.title,
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(
        LANGUAGES.map((code) => [code, `/${code}`]),
      ),
    },
    openGraph: {
      type: "website",
      siteName: "HanQ",
      title: meta.socialTitle,
      description: meta.description,
      locale: lang === "ko" ? "ko_KR" : "ja_JP",
      alternateLocale: lang === "ko" ? "ja_JP" : "ko_KR",
      url: `/${lang}`,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.socialTitle,
      description: meta.description,
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!isLanguage(lang)) {
    notFound();
  }

  return (
    <html
      lang={lang}
      className={`${pretendard.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider language={lang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
