import "server-only";

import { cache } from "react";

import { getCurrentLanguage } from "@/lib/locale";
import { getDictionary, type Dictionary } from "./index";

export const getServerDictionary = cache(async (): Promise<Dictionary> => {
  return getDictionary(await getCurrentLanguage());
});
