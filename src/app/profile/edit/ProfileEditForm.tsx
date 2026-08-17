"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";

import type { FormErrorCode } from "@/lib/form-errors";
import { useDictionary } from "@/lib/i18n/context";
import { IMAGE_TYPES, NAME_MAX, validateImage } from "@/lib/profile-rules";
import { resizeImage } from "@/lib/resize-image";
import type { Profile } from "@/types/user";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";
import { type ProfileFormState, submitProfile } from "./_actions/profile";

const INITIAL_STATE: ProfileFormState = { error: null };

type Props = {
  profile: Profile;
};

export function ProfileEditForm({ profile }: Props) {
  const { profile: copy, formError } = useDictionary();

  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile.name);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [pickError, setPickError] = useState<FormErrorCode | null>(null);

  const [state, formAction, isPending] = useActionState(
    submitProfile,
    INITIAL_STATE,
  );

  const error = pickError ?? state.error;
  const shownPhoto = removed ? null : (preview ?? profile.photoUrl);

  const pickFile = async (file: File | undefined) => {
    if (!file) return;

    const invalid = validateImage(file);

    if (invalid) {
      setPickError(invalid);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const resized = await resizeImage(file);

    setPickError(null);
    setPhoto(resized);
    setPreview(URL.createObjectURL(resized));
    setRemoved(false);
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPreview(null);
    setRemoved(true);
    setPickError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = (formData: FormData) => {
    if (photo) {
      formData.set("photo", photo);
    } else {
      formData.delete("photo");
    }

    formAction(formData);
  };

  return (
    <form action={submit} className="flex flex-1 flex-col">
      <input type="hidden" name="removePhoto" value={String(removed)} />

      <div className="flex flex-col gap-8 px-5 pb-5 pt-8">
        <fieldset className="flex flex-col items-center gap-6">
          <legend className="sr-only">{copy.photoLabel}</legend>

          {shownPhoto ? (
            <Image
              src={shownPhoto}
              alt=""
              width={96}
              height={96}
              unoptimized={preview !== null}
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />
          ) : (
            <Avatar name={name} size="xxl" />
          )}

          <input
            ref={fileRef}
            type="file"
            accept={IMAGE_TYPES.join(",")}
            onChange={(event) => void pickFile(event.target.files?.[0])}
            className="sr-only"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-full bg-muted px-4 py-2 text-[13px] font-bold text-secondary"
            >
              {copy.photoChange}
            </button>

            {shownPhoto && (
              <button
                type="button"
                onClick={clearPhoto}
                className="rounded-full bg-muted px-4 py-2 text-[13px] font-bold text-tertiary"
              >
                {copy.photoRemove}
              </button>
            )}
          </div>
        </fieldset>

        <TextField
          id="name"
          label={copy.nameLabel}
          value={name}
          onChange={setName}
          maxLength={NAME_MAX}
          placeholder={copy.namePlaceholder}
        />
      </div>

      <div className="sticky bottom-0 mt-auto bg-surface px-5 pb-[18px] pt-3 shadow-[0_-4px_16px_0_rgba(25,31,40,0.06)]">
        {error && (
          <p role="alert" className="mb-2 text-[13px] text-like">
            {formError[error]}
          </p>
        )}

        <Button
          content={isPending ? copy.saving : copy.save}
          size="lg"
          type="submit"
          disabled={isPending || name.trim().length === 0}
          className="w-full"
        />
      </div>
    </form>
  );
}
