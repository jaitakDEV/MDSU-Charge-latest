import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";
import { isAccessExpired } from "@/lib/access-utils";

const schema = z.object({
  lectureId: z.string().min(1),
  courseId: z.string().min(1),
  isCompleted: z.boolean(),
});

export async function POST(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "STUDENT") {
      return NextResponse.json(apiError("Only students can track progress."), {
        status: 403,
      });
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const { lectureId, courseId, isCompleted } = parsed.data;

    // ── Access guard — server-side expiry check ──────────────
    const enrolment = await db.enrolment.findUnique({
      where: { userId_courseId: { userId: guard.userId, courseId } },
      select: { id: true, accessExpiresAt: true },
    });

    if (!enrolment) {
      return NextResponse.json(apiError("Not enrolled in this course."), {
        status: 403,
      });
    }

    if (isAccessExpired(enrolment.accessExpiresAt)) {
      return NextResponse.json(
        apiError("Your access to this course has expired."),
        { status: 403 },
      );
    }

    // Lecture belongs to this course check
    const lecture = await db.lecture.findFirst({
      where: { id: lectureId, section: { courseId } },
      select: { id: true },
    });

    if (!lecture) {
      return NextResponse.json(apiError("Lecture not found."), { status: 404 });
    }

    // Upsert progress record
    await db.lectureProgress.upsert({
      where: { userId_lectureId: { userId: guard.userId, lectureId } },
      update: { isCompleted, watchedAt: new Date() },
      create: { userId: guard.userId, lectureId, isCompleted },
    });

    // ── Check 100% completion ────────────────────────────────
    if (isCompleted) {
      const totalPublished = await db.lecture.count({
        where: { isPublished: true, section: { courseId } },
      });

      const completedCount = await db.lectureProgress.count({
        where: {
          userId: guard.userId,
          isCompleted: true,
          lecture: { section: { courseId } },
        },
      });

      const pct =
        totalPublished > 0
          ? Math.round((completedCount / totalPublished) * 100)
          : 0;

      await db.enrolment.update({
        where: { userId_courseId: { userId: guard.userId, courseId } },
        data: {
          completionPercent: pct,
          ...(pct === 100 && { completedAt: new Date() }),
        },
      });

      // Certificate generate — agar 100% complete hua
      if (pct === 100) {
        const existingCert = await db.certificate.findUnique({
          where: { userId_courseId: { userId: guard.userId, courseId } },
        });

        if (!existingCert) {
          const course = await db.course.findUnique({
            where: { id: courseId },
            select: { title: true },
          });
          const student = await db.user.findUnique({
            where: { id: guard.userId },
            select: { name: true },
          });
          const certNumber = `CERT-${Date.now()}-${guard.userId.slice(-4).toUpperCase()}`;

          await db.certificate.create({
            data: {
              userId: guard.userId,
              courseId,
              certificateNumber: certNumber,
              courseTitle: course?.title ?? "Course",
              studentName: student?.name ?? "Student",
            },
          });
          try {
            await fetch(
              `${process.env.NEXT_PUBLIC_APP_URL}/api/certificates/generate`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: guard.userId,
                  courseId,
                }),
              },
            );
          } catch (e) {
            // PDF generation fail hone se certificate record affect nahi hota
            console.error("[CERT_PDF_GENERATE_FAILED]", e);
          }
        }
      }

      return NextResponse.json(apiSuccess({ completionPercent: pct }));
    }

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[PROGRESS_UPDATE]", error);
    return NextResponse.json(apiError("Failed to update progress."), {
      status: 500,
    });
  }
}
