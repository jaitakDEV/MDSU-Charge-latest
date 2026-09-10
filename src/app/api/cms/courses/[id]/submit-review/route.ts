import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN") {
      return NextResponse.json(apiError("Forbidden."), { status: 403 });
    }

    const { id } = await params;

    const course = await db.course.findUnique({
      where: { id },
      select: {
        authorId: true,
        status: true,
        accessDuration: true,
        title: true,
        categoryId: true,
        sections: {
          select: {
            lectures: {
              where: { isPublished: true },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(apiError("Course not found."), { status: 404 });
    }

    // Author check — CMS Editor sirf apna course submit kar sakta hai
    if (guard.role !== "ADMIN" && course.authorId !== guard.userId) {
      return NextResponse.json(apiError("Forbidden."), { status: 403 });
    }

    // Status check
    if (course.status !== "DRAFT") {
      return NextResponse.json(
        apiError("Only DRAFT courses can be submitted for review."),
        { status: 400 },
      );
    }

    // ── Validations ───────────────────────────────────────────

    // 1. Title hona chahiye
    if (!course.title?.trim()) {
      return NextResponse.json(
        apiError("Course title is required before submitting for review."),
        { status: 400 },
      );
    }

    // 2. Category hona chahiye
    if (!course.categoryId) {
      return NextResponse.json(
        apiError("Please select a category before submitting for review."),
        { status: 400 },
      );
    }

    // 3. accessDuration zaroori hai — V3 key requirement
    if (!course.accessDuration) {
      return NextResponse.json(
        apiError("Access duration is required before submitting for review."),
        { status: 400 },
      );
    }

    // 4. Kam se kam ek published lecture hona chahiye
    const publishedLectures = course.sections.flatMap((s) => s.lectures);
    if (publishedLectures.length === 0) {
      return NextResponse.json(
        apiError(
          "Add and publish at least one lecture before submitting for review.",
        ),
        { status: 400 },
      );
    }

    // ── Submit ────────────────────────────────────────────────
    await db.course.update({
      where: { id },
      data: { status: "REVIEW" },
    });

    return NextResponse.json(
      apiSuccess({ message: "Course submitted for review successfully." }),
    );
  } catch (error) {
    console.error("[SUBMIT_REVIEW]", error);
    return NextResponse.json(apiError("Failed to submit for review."), {
      status: 500,
    });
  }
}
