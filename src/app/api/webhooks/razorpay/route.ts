import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { verifyWebhookSignature } from "@/lib/razorpay-utils";
import { computeAccessExpiry } from "@/lib/access-utils";
import type { AccessDuration } from "@prisma/client";

export async function POST(req: Request) {
  try {
    // ── 1. Raw body string lao — signature verify ke liye ────
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";

    // ── 2. Webhook signature verify karo ─────────────────────
    const isValid = verifyWebhookSignature({ rawBody, signature });
    if (!isValid) {
      console.warn("[WEBHOOK] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // ── 3. Event parse karo ───────────────────────────────────
    const event = JSON.parse(rawBody) as {
      event: string;
      payload: {
        payment?: {
          entity: {
            id: string; // razorpay_payment_id
            order_id: string; // razorpay_order_id
            status: string;
          };
        };
        refund?: {
          entity: {
            id: string;
            payment_id: string;
            amount: number;
          };
        };
      };
    };

    // ── 4. Event type handle karo ─────────────────────────────
    if (event.event === "payment.captured") {
      await handlePaymentCaptured(event.payload.payment!.entity);
    }

    if (event.event === "refund.processed") {
      await handleRefundProcessed(event.payload.refund!.entity);
    }

    // Razorpay expects 200 — warna retry karta hai
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    // 200 return karo — warna Razorpay baar baar retry karega
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

// ── payment.captured handler ──────────────────────────────────

async function handlePaymentCaptured(payment: {
  id: string;
  order_id: string;
  status: string;
}) {
  const { id: razorpayPaymentId, order_id: razorpayOrderId } = payment;

  // DB se order dhundo
  const order = await db.order.findUnique({
    where: { razorpayOrderId },
    select: {
      id: true,
      userId: true,
      courseId: true,
      status: true,
      accessDuration: true,
      couponId: true,
    },
  });

  if (!order) {
    console.warn("[WEBHOOK] Order not found:", razorpayOrderId);
    return;
  }

  // ── Idempotency check ─────────────────────────────────────
  // Agar order already COMPLETED hai — verify route ne already handle kiya
  if (order.status === "COMPLETED") {
    console.log("[WEBHOOK] Already processed:", razorpayOrderId);
    return;
  }

  // Agar enrolment already exist karta hai — skip
  const existingEnrolment = await db.enrolment.findUnique({
    where: {
      userId_courseId: {
        userId: order.userId,
        courseId: order.courseId,
      },
    },
  });

  if (existingEnrolment) {
    console.log("[WEBHOOK] Enrolment already exists — skipping");
    return;
  }

  const now = new Date();
  const accessExpiresAt = computeAccessExpiry(
    order.accessDuration as AccessDuration,
    now,
  );

  // ── Transaction — order + enrolment ───────────────────────
  await db.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "COMPLETED",
        razorpayPaymentId,
      },
    });

    await tx.enrolment.create({
      data: {
        userId: order.userId,
        courseId: order.courseId,
        accessDuration: order.accessDuration,
        accessGrantedAt: now,
        accessExpiresAt,
        orderId: order.id,
      },
    });

    // Coupon usedCount increment
    if (order.couponId) {
      await tx.coupon.update({
        where: { id: order.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }
  });

  console.log("[WEBHOOK] Enrolment created for:", order.userId, order.courseId);
}

// ── refund.processed handler ──────────────────────────────────

async function handleRefundProcessed(refund: {
  id: string;
  payment_id: string;
  amount: number;
}) {
  // Payment ID se order dhundo
  const order = await db.order.findUnique({
    where: { razorpayPaymentId: refund.payment_id },
    select: { id: true, userId: true, courseId: true },
  });

  if (!order) {
    console.warn("[WEBHOOK] Order not found for refund:", refund.payment_id);
    return;
  }

  // Order status REFUNDED karo + enrolment access revoke karo
  await db.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: "REFUNDED" },
    });

    await tx.enrolment.updateMany({
      where: {
        userId: order.userId,
        courseId: order.courseId,
      },
      data: {
        accessExpiresAt: new Date(), // turant lock
        renewedAt: new Date(), // audit trail
      },
    });
  });

  console.log("[WEBHOOK] Refund processed access revoked:", order.userId);
}
