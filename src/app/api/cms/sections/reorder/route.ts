import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiSuccess } from "@/lib/utils";

export async function PATCH(req: Request) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;
  const { ids }: { ids: string[] } = await req.json();
  await Promise.all(
    ids.map((id, i) =>
      db.courseSection.update({ where: { id }, data: { displayOrder: i } }),
    ),
  );
  return NextResponse.json(apiSuccess(null));
}
