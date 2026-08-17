const MAX_EDGE = 512;
const QUALITY = 0.85;

export async function resizeImage(file: File): Promise<File> {
  if (typeof createImageBitmap !== "function") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });

    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      return file;
    }

    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY),
    );

    if (!blob) {
      return file;
    }

    return new File([blob], "avatar.webp", { type: "image/webp" });
  } catch (e) {
    console.error("[resizeImage]", e);
    return file;
  }
}
