import { NextResponse } from "next/server";
import { requireAdminApi } from "@/server/api-guard";
import { db } from "@/server/db";
import { razorpay } from "@/server/razorpay";
import { apiError, apiSuccess } from "@/lib/utils";
import { notifyNextWaitlistPerson } from "@/server/waitlist-notifier";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAdminApi();
    if (!guard.ok) return guard.response;

    const { id } = await params;

    const registration = await db.eventRegistration.findUnique({
      where: { id },
      select: {
        status: true,
        amountPaid: true,
        razorpayPaymentId: true,
        eventId: true,
      },
    });

    if (!registration)
      return NextResponse.json(apiError("Registration not found."), {
        status: 404,
      });
    if (registration.status !== "CONFIRMED")
      return NextResponse.json(
        apiError("Only confirmed registrations can be refunded."),
        { status: 400 },
      );
    if (!registration.razorpayPaymentId || !registration.amountPaid)
      return NextResponse.json(
        apiError("This is a free registration — cannot refund."),
        { status: 400 },
      );

    // Razorpay refund
    await razorpay.payments.refund(registration.razorpayPaymentId, {
      amount: registration.amountPaid,
    });

    // Update registration + decrement count
    await db.$transaction(async (tx) => {
      await tx.eventRegistration.update({
        where: { id },
        data: { status: "REFUNDED" },
      });
      await tx.event.update({
        where: { id: registration.eventId },
        data: { registeredCount: { decrement: 1 } },
      });
    });

    // Notify next waitlist person if any
    await notifyNextWaitlistPerson(registration.eventId);

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[EVENT_REFUND]", error);
    return NextResponse.json(
      apiError("Refund failed. Check Razorpay dashboard."),
      { status: 500 },
    );
  }
}
