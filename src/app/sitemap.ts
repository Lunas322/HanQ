import type { MetadataRoute } from "next";
import { cacheLife, cacheTag } from "next/cache";

import { QUESTIONS_TAG } from "@/lib/cache-tags";

import { listQuestionSitemapEntries } from "@/lib/questions";
import { SITE_URL } from "@/lib/site";
import { LANGUAGES } from "@/types/language";

function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      LANGUAGES.map((lang) => [lang, `${SITE_URL}/${lang}${path}`]),
    ),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("hours");
  cacheTag(QUESTIONS_TAG);

  const questions = await listQuestionSitemapEntries();

  const landing = LANGUAGES.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
    alternates: alternates(""),
  }));

  const details = questions.flatMap((question) =>
    LANGUAGES.map((lang) => ({
      url: `${SITE_URL}/${lang}/detail/${question.id}`,
      lastModified: question.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: alternates(`/detail/${question.id}`),
    })),
  );

  return [...landing, ...details];
}
