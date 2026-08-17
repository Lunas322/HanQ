import "server-only";

import { randomUUID } from "node:crypto";

import { adminStorage } from "./firebase-admin";

const AVATAR_PREFIX = "avatars";

export async function uploadAvatar(
  uid: string,
  file: File,
): Promise<string | null> {
  const bucket = adminStorage.bucket();
  const path = `${AVATAR_PREFIX}/${uid}`;
  const token = randomUUID();

  try {
    await bucket.file(path).save(Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      metadata: {
        cacheControl: "public, max-age=31536000",
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });
  } catch (e) {
    console.error("[uploadAvatar]", e);
    return null;
  }

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

export async function removeAvatar(uid: string): Promise<void> {
  try {
    await adminStorage.bucket().file(`${AVATAR_PREFIX}/${uid}`).delete();
  } catch (e) {
    console.error("[removeAvatar]", e);
  }
}
