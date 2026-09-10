import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { calculateDiscount, formatINR } from "@/lib/razorpay-utils";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(1, "Coupon code required").toUpperCase(),
  courseId: z.string().min(1, "courseId required"),
});

export async function POST(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const { code, courseId } = parsed.data;

    // Course price fetch karo
    const course = await db.course.findUnique({
      where: { id: courseId, status: "PUBLISHED" },
      select: { id: true, price: true },
    });

    if (!course) {
      return NextResponse.json(apiError("Course not found."), { status: 404 });
    }

    // Coupon fetch karo
    const coupon = await db.coupon.findUnique({
      where: { code },
      select: {
        id: true,
        code: true,
        discountType: true,
        discountValue: true,
        validFrom: true,
        validUntil: true,
        maxUses: true,
        usedCount: true,
        isActive: true,
        courseId: true,
        minOrderValue: true,
      },
    });

    // ── Validation checks ─────────────────────────────────────

    if (!coupon) {
      return NextResponse.json(apiError("Invalid coupon code."), {
        status: 404,
      });
    }

    if (!coupon.isActive) {
      return NextResponse.json(apiError("This coupon is no longer active."), {
        status: 400,
      });
    }

    const now = new Date();

    if (coupon.validFrom > now) {
      return NextResponse.json(apiError("This coupon is not yet active."), {
        status: 400,
      });
    }

    if (coupon.validUntil && coupon.validUntil < now) {
      return NextResponse.json(apiError("This coupon has expired."), {
        status: 400,
      });
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        apiError("This coupon has reached its usage limit."),
        { status: 400 },
      );
    }

    // Course-specific coupon check
    if (coupon.courseId && coupon.courseId !== courseId) {
      return NextResponse.json(
        apiError("This coupon is not valid for this course."),
        { status: 400 },
      );
    }

    // Min order value check
    if (course.price < coupon.minOrderValue) {
      return NextResponse.json(
        apiError(
          `Minimum order value for this coupon is ${formatINR(coupon.minOrderValue)}.`,
        ),
        { status: 400 },
      );
    }

    // ── Discount calculate karo ───────────────────────────────

    const { discountAmount, finalPrice } = calculateDiscount({
      originalPrice: course.price,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
    });

    return NextResponse.json(
      apiSuccess({
        couponId: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount, // paise mein
        originalPrice: course.price, // paise mein
        finalPrice, // paise mein
        discountAmountFormatted: formatINR(discountAmount),
        originalPriceFormatted: formatINR(course.price),
        finalPriceFormatted: formatINR(finalPrice),
      }),
    );
  } catch (error) {
    console.error("[COUPON_VALIDATE]", error);
    return NextResponse.json(apiError("Failed to validate coupon."), {
      status: 500,
    });
  }
}
