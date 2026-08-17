import type { MetadataRoute } from "next";

import { PRIVATE_PATHS, SITE_URL } from "@/lib/site";
import { LANGUAGES } from "@/types/language";

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/api/",
    "/logout",
    ...LANGUAGES.flatMap((lang) =>
      PRIVATE_PATHS.map((path) => `/${lang}${path}`),
    ),
  ];

  return {
    rules: [{ userAgent: "*", allow: "/", disallow }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
