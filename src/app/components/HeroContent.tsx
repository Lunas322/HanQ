import { getServerDictionary } from "@/lib/i18n/server";

export async function HeroContent() {
  const { landing } = await getServerDictionary();

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
