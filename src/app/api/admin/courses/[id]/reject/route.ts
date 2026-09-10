import { NextResponse } from "next/server";
import { requireAdminApi } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { sendCourseRejectedEmail } from "@/server/email";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const { reason } = await req.json();

  if (!reason?.trim()) {
    return NextResponse.json(apiError("Rejection reason is required."), {
      status: 400,
    });
  }

  const course = await db.course.findUnique({
    where: { id },
    select: {
      status: true,
      title: true,
      author: { select: { email: true, name: true } },
    },
  });

  if (!course)
    return NextResponse.json(apiError("Course not found."), { status: 404 });
  if (course.status !== "REVIEW") {
    return NextResponse.json(
      apiError("Only courses in REVIEW can be rejected."),
      { status: 400 },
    );
  }

  await db.course.update({ where: { id }, data: { status: "DRAFT" } });

  // Resend email — fail-safe, course status already updated
  try {
    await sendCourseRejectedEmail(course.author.email, course.title, reason);
  } catch (e) {
    console.error("[REJECT_EMAIL_FAILED]", e);
  }

  return NextResponse.json(apiSuccess(null));
}
