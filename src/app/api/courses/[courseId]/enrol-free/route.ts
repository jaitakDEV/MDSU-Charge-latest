import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { computeAccessExpiry } from "@/lib/access-utils";
import type { AccessDuration } from "@prisma/client";
import crypto from "crypto";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;

    if (guard.role !== "STUDENT") {
      return NextResponse.json(
        apiError("Only students can enrol in courses."),
        { status: 403 },
      );
    }

    const { courseId } = await params;

    const course = await db.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        status: true,
        price: true,
        accessDuration: true,
        slug: true,
      },
    });

    if (!course) {
      return NextResponse.json(apiError("Course not found."), { status: 404 });
    }

    if (course.status !== "PUBLISHED") {
      return NextResponse.json(apiError("This course is not available."), {
        status: 400,
      });
    }

    if (course.price !== 0) {
      return NextResponse.json(
        apiError("This is a paid course. Please proceed through checkout."),
        { status: 400 },
      );
    }

    const existing = await db.enrolment.findUnique({
      where: { userId_courseId: { userId: guard.userId, courseId: course.id } },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        apiSuccess({ alreadyEnrolled: true, courseSlug: course.slug }),
      );
    }

    const accessExpiresAt = computeAccessExpiry(
      course.accessDuration as AccessDuration,
    );
    const freeOrderId = `FREE-${crypto.randomUUID()}`;

    await db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: guard.userId,
          courseId: course.id,
          status: "COMPLETED",
          amountPaid: 0,
          originalPrice: 0,
          discountAmount: 0,
          razorpayOrderId: freeOrderId,
          razorpayPaymentId: null,
          accessDuration: course.accessDuration,
        },
      });

      await tx.enrolment.create({
        data: {
          userId: guard.userId,
          courseId: course.id,
          orderId: order.id,
          accessDuration: course.accessDuration,
          accessExpiresAt,
        },
      });
    });

    return NextResponse.json(
      apiSuccess({ alreadyEnrolled: false, courseSlug: course.slug }),
      { status: 201 },
    );
  } catch (error) {
    console.error("[FREE_ENROL]", error);
    return NextResponse.json(apiError("Failed to enrol. Please try again."), {
      status: 500,
    });
  }
}
