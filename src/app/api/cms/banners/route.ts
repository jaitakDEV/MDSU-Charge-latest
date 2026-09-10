import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiSuccess, apiError } from "@/lib/utils";

export async function POST(req: Request) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
    return NextResponse.json(apiError("Forbidden"), { status: 403 });

  const body = await req.json();
  const banner = await db.banner.create({ data: body });
  return NextResponse.json(apiSuccess(banner), { status: 201 });
}
