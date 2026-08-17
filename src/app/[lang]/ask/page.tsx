import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { AskForm } from "./AskForm";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/logout");

  return <AskForm />;
}
