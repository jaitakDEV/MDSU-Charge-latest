import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAuth();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const course = await db.course.findUnique({
    where: { id },
    select: { authorId: true, status: true },
  });

  if (!course) return NextResponse.json(apiError("Not found"), { status: 404 });

  // CMS Editor sirf apna course archive kar sakta hai
  if (guard.role !== "ADMIN" && course.authorId !== guard.userId) {
    return NextResponse.json(apiError("Forbidden"), { status: 403 });
  }

  if (course.status !== "PUBLISHED") {
    return NextResponse.json(
      apiError("Only published courses can be archived"),
      { status: 400 },
    );
  }

  await db.course.update({ where: { id }, data: { status: "ARCHIVED" } });
  return NextResponse.json(apiSuccess(null));
}
