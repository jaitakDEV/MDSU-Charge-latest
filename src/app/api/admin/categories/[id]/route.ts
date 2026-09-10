import { NextResponse } from "next/server";
import { requireAdminApi } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiSuccess, apiError } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const { id } = await params;
  await db.category.update({ where: { id }, data: await req.json() });
  return NextResponse.json(apiSuccess(null));
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const { id } = await params;
  const count = await db.course.count({ where: { categoryId: id } });
  if (count > 0)
    return NextResponse.json(
      apiError("Cannot delete courses exist in this category."),
      { status: 400 },
    );
  await db.category.delete({ where: { id } });
  return NextResponse.json(apiSuccess(null));
}
