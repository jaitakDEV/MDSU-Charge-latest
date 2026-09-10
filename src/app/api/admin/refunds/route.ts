import { NextResponse } from "next/server";
import { requireAdminApi } from "@/server/api-guard";
import { db } from "@/server/db";
import { razorpay } from "@/server/razorpay";
import { apiError, apiSuccess } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const guard = await requireAdminApi();
    if (!guard.ok) return guard.response;

    const { orderId, paymentId, amount } = await req.json();

    const order = await db.order.findUnique({
      where: { id: orderId },
      select: { status: true, amountPaid: true, userId: true, courseId: true },
    });

    if (!order)
      return NextResponse.json(apiError("Order not found."), { status: 404 });
    if (order.status !== "COMPLETED")
      return NextResponse.json(
        apiError("Only completed orders can be refunded."),
        { status: 400 },
      );

    await razorpay.payments.refund(paymentId, { amount: order.amountPaid });

    await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "REFUNDED" },
      });

      await tx.enrolment.updateMany({
        where: { userId: order.userId, courseId: order.courseId },
        data: { accessExpiresAt: new Date(), renewedAt: new Date() },
      });
    });

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[REFUND]", error);
    return NextResponse.json(
      apiError("Refund failed. Check Razorpay dashboard."),
      { status: 500 },
    );
  }
}
