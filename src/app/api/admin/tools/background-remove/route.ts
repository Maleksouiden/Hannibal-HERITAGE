import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  BG_REMOVE_MAX_BYTES,
  isAllowedBgRemoveType,
  removeImageBackground,
} from "@/lib/remove-background";

export const maxDuration = 120;

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  if (file.size <= 0 || file.size > BG_REMOVE_MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be between 1 byte and 8MB" },
      { status: 400 },
    );
  }
  if (!isAllowedBgRemoveType(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, or GIF images are allowed" },
      { status: 400 },
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const png = await removeImageBackground(bytes, file.type);
    const filename = `${pathBase(file.name)}-nobg.png`;
    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Background removal failed";
    console.error("[background-remove]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function pathBase(name: string): string {
  const base = name.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-");
  return base.slice(0, 80) || "image";
}
