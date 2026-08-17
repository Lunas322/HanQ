"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { markNotificationsRead } from "@/lib/notifications";

export async function markNotificationsReadAction(): Promise<void> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logout");
  }

  await markNotificationsRead(user.uid);

  revalidatePath("/home");
}
