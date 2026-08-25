import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { LanguageProvider } from "@/lib/i18n/context";
import { ToastProvider } from "@/app/components/Toast";
import { getDictionary } from "@/lib/i18n";
import { DEFAULT_LANGUAGE, isLanguage, LANGUAGES } from "@/types/language";
import "@/app/globals.css";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const ADSENSE_CLIENT = "ca-pub-1883892838715528";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export const viewport: Viewport = {
  themeColor: "#0064ff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
    appleWebApp: {
      capable: true,
      title: "HanQ",
      statusBarStyle: "default",
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...Object.fromEntries(LANGUAGES.map((code) => [code, `/${code}`])),
        "x-default": `/${DEFAULT_LANGUAGE}`,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: {
        "naver-site-verification": process.env.NAVER_SITE_VERIFICATION ?? [],
        "msvalidate.01": process.env.BING_SITE_VERIFICATION ?? [],
      },
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
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-xl focus:bg-surface focus:px-4 focus:py-3 focus:text-[15px] focus:font-bold focus:text-brand focus:outline-2 focus:outline-brand"
        >
          {getDictionary(lang).common.skipToContent}
        </a>

        <LanguageProvider language={lang}>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
