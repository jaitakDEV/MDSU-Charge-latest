import { NextResponse } from "next/server";
import { requireAdminApi } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiSuccess } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const { id } = await params;
  await db.coupon.update({ where: { id }, data: await req.json() });
  return NextResponse.json(apiSuccess(null));
}
