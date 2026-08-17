"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import type { FormErrorCode } from "@/lib/form-errors";
import { validateImage, validateName } from "@/lib/profile-rules";
import { removeAvatar, uploadAvatar } from "@/lib/storage";
import { updateUserProfile } from "@/lib/user";

export type ProfileFormState = {
  error: FormErrorCode | null;
};

export async function submitProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/logout");
  }

  const name = String(formData.get("name") ?? "").trim();
  const nameError = validateName(name);

  if (nameError) {
    return { error: nameError };
  }

  const removePhoto = formData.get("removePhoto") === "true";
  const file = formData.get("photo");
  const hasNewPhoto = file instanceof File && file.size > 0;

  let photoUrl: string | null | undefined;

  if (hasNewPhoto) {
    const imageError = validateImage(file);

    if (imageError) {
      return { error: imageError };
    }

    photoUrl = await uploadAvatar(user.uid, file);

    if (photoUrl === null) {
      return { error: "PROFILE_UPDATE_FAILED" };
    }
  } else if (removePhoto) {
    await removeAvatar(user.uid);
    photoUrl = null;
  }

  try {
    await updateUserProfile(user.uid, { name, photoUrl });
  } catch (e) {
    console.error("[submitProfile]", e);
    return { error: "PROFILE_UPDATE_FAILED" };
  }

  revalidatePath("/my");
  revalidatePath("/home");

  redirect("/my");
}
