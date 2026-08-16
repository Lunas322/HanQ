import type { Metadata } from "next";
import localFont from "next/font/local";

import { LanguageProvider } from "@/lib/i18n/context";
import { getServerDictionary } from "@/lib/i18n/server";
import { getCurrentLanguage } from "@/lib/locale";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getServerDictionary();

  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getCurrentLanguage();

  return (
    <html
      lang={language}
      className={`${pretendard.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider language={language}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
