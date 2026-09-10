import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET() {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const settings = await db.seoSettings.findUnique({ where: { id: "global" } });
  return NextResponse.json(apiSuccess(settings));
}

export async function PATCH(req: Request) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const data = await req.json();
  const settings = await db.seoSettings.upsert({
    where: { id: "global" },
    update: data,
    create: { id: "global", ...data },
  });

  return NextResponse.json(apiSuccess(settings));
}
