import { ImageResponse } from "next/og";

const SIZES = ["192", "512"] as const;

type Params = { params: Promise<{ size: string }> };

export function generateStaticParams() {
  return SIZES.map((size) => ({ size }));
}

export async function GET(_request: Request, { params }: Params) {
  const { size } = await params;

  if (!SIZES.includes(size as (typeof SIZES)[number])) {
    return new Response("Not Found", { status: 404 });
  }

  const length = Number(size);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0064ff",
          color: "#ffffff",
          fontSize: length * 0.62,
          fontWeight: 900,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Q
      </div>
    ),
    { width: length, height: length },
  );
}
