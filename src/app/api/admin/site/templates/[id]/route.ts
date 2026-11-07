import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { updateHomeTemplate } from "@/lib/site-content";

type Ctx = { params: Promise<{ id: string }> };

type PatchBody = {
  title?: string;
  body?: string;
  ctaLabel?: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  isPublished?: boolean;
  sortOrder?: number;
};

export async function PATCH(request: Request, context: Ctx) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const { id } = await context.params;
  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data: PatchBody = {};
  if (body.title !== undefined) {
    const title = body.title.trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    data.title = title;
  }
  if (body.body !== undefined) data.body = body.body.trim();
  if (body.ctaLabel !== undefined) {
    const ctaLabel = body.ctaLabel.trim();
    if (!ctaLabel) {
      return NextResponse.json({ error: "CTA label is required" }, { status: 400 });
    }
    data.ctaLabel = ctaLabel;
  }
  if (body.href !== undefined) {
    const href = body.href.trim();
    if (!href.startsWith("/")) {
      return NextResponse.json(
        { error: "Href must be a site path starting with /" },
        { status: 400 },
      );
    }
    data.href = href;
  }
  if (body.imageSrc !== undefined) {
    const imageSrc = body.imageSrc.trim();
    if (!imageSrc) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    data.imageSrc = imageSrc;
  }
  if (body.imageAlt !== undefined) data.imageAlt = body.imageAlt.trim();
  if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);
  if (body.sortOrder !== undefined) {
    const sortOrder = Math.floor(Number(body.sortOrder));
    if (!Number.isFinite(sortOrder) || sortOrder < 0) {
      return NextResponse.json({ error: "Invalid sort order" }, { status: 400 });
    }
    data.sortOrder = sortOrder;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const template = await updateHomeTemplate(id, data);
    return NextResponse.json({ template });
  } catch {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }
}
