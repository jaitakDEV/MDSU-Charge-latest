import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { createRazorpayOrder } from "@/server/payments";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  courseId: z.string().min(1, "courseId required"),
  couponCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Auth check
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;

    // Only STUDENT can purchase
    if (guard.role !== "STUDENT") {
      return NextResponse.json(
        apiError("Only students can purchase courses."),
        { status: 403 },
      );
    }

    // Body validate karo
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const { courseId, couponCode } = parsed.data;

    // Order create karo — server/payments.ts se
    const order = await createRazorpayOrder({
      courseId,
      userId: guard.userId,
      couponCode,
    });

    return NextResponse.json(apiSuccess(order), { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";

    // Known business errors — 400
    const knownErrors = [
      "Course not available for purchase.",
      "Free course — no payment needed.",
      "You are already enrolled in this course.",
    ];

    if (knownErrors.includes(message)) {
      return NextResponse.json(apiError(message), { status: 400 });
    }

    console.error("[CREATE_ORDER]", error);
    return NextResponse.json(
      apiError("Failed to create order. Please try again."),
      { status: 500 },
    );
  }
}
