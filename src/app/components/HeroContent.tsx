import { getDictionary } from "@/lib/i18n";
import type { Language } from "@/types/language";

export function HeroContent({ language }: { language: Language }) {
  const { landing } = getDictionary(language);

  return (
    <div>
      <h1 className="flex flex-col text-3xl font-black mt-5.5">
        <span>{landing.heroLine1}</span>
        <span>{landing.heroLine2}</span>
        <span>{landing.heroLine3}</span>
      </h1>
      <p className="text-[16px] text-secondary font-medium mt-4">
        {landing.heroDescriptionLine1}
        <br />
        {landing.heroDescriptionLine2}
      </p>
    </div>
  );
}
