export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { verifyAndEnrol } from "@/server/payments";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;

    if (guard.role !== "STUDENT") {
      return NextResponse.json(apiError("Only students can verify payments."), {
        status: 403,
      });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      parsed.data;

    const result = await verifyAndEnrol({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      userId: guard.userId,
    });

    return NextResponse.json(
      apiSuccess({
        courseId: result.courseId,
        alreadyEnrolled: result.alreadyEnrolled,
        accessExpiresAt: result.accessExpiresAt ?? null,
      }),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";

    if (message === "Invalid payment signature.") {
      return NextResponse.json(apiError(message), { status: 400 });
    }

    if (message === "Unauthorized.") {
      return NextResponse.json(apiError(message), { status: 403 });
    }

    console.error("[VERIFY_PAYMENT]", error);
    return NextResponse.json(
      apiError("Payment verification failed. Contact support."),
      { status: 500 },
    );
  }
}
