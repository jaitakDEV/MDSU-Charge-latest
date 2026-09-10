import { razorpay } from "@/server/razorpay";
import { db } from "@/server/db";
import {
  generateReceiptId,
  verifyPaymentSignature,
  calculateDiscount,
} from "@/lib/razorpay-utils";
import { computeAccessExpiry } from "@/lib/access-utils";
import type { AccessDuration } from "@prisma/client";

// ── Create Razorpay Order ─────────────────────────────────────

export async function createRazorpayOrder({
  courseId,
  userId,
  couponCode,
}: {
  courseId: string;
  userId: string;
  couponCode?: string;
}) {
  // Price hamesha DB se — client se nahi
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      price: true,
      accessDuration: true,
      status: true,
    },
  });

  if (!course || course.status !== "PUBLISHED") {
    throw new Error("Course not available for purchase.");
  }

  if (course.price === 0) {
    throw new Error("Free course — no payment needed.");
  }

  // Duplicate enrolment check
  const existing = await db.enrolment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) throw new Error("You are already enrolled in this course.");

  // Coupon validate karo
  let discountAmount = 0;
  let couponId: string | undefined;

  if (couponCode) {
    const coupon = await db.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });

    if (
      coupon &&
      coupon.isActive &&
      (!coupon.validUntil || coupon.validUntil > new Date()) &&
      coupon.validFrom <= new Date() &&
      (!coupon.maxUses || coupon.usedCount < coupon.maxUses) &&
      (!coupon.courseId || coupon.courseId === courseId)
    ) {
      const result = calculateDiscount({
        originalPrice: course.price,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue,
      });
      discountAmount = result.discountAmount;
      couponId = coupon.id;
    }
  }

  const finalAmount = course.price - discountAmount;
  const receiptId = generateReceiptId();

  // Razorpay order create karo
  const rzpOrder = await razorpay.orders.create({
    amount: finalAmount, // paise mein
    currency: "INR",
    receipt: receiptId,
  });

  // DB mein PENDING order save karo
  const order = await db.order.create({
    data: {
      userId,
      courseId,
      status: "PENDING",
      amountPaid: finalAmount,
      originalPrice: course.price,
      discountAmount,
      razorpayOrderId: rzpOrder.id,
      accessDuration: course.accessDuration,
      couponId: couponId ?? null,
    },
  });

  return {
    orderId: order.id,
    razorpayOrderId: rzpOrder.id,
    amount: finalAmount,
    currency: "INR",
    courseName: course.title,
    accessDuration: course.accessDuration,
  };
}

// ── Verify Payment + Create Enrolment ────────────────────────

export async function verifyAndEnrol({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  userId,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  userId: string;
}) {
  // Signature verify karo — security gate
  const isValid = verifyPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!isValid) {
    throw new Error("Invalid payment signature.");
  }

  // Order DB se fetch karo
  const order = await db.order.findUnique({
    where: { razorpayOrderId },
    select: {
      id: true,
      userId: true,
      courseId: true,
      accessDuration: true,
      couponId: true,
    },
  });

  if (!order) throw new Error("Order not found.");
  if (order.userId !== userId) throw new Error("Unauthorized.");

  // Idempotency — already enrolled hai toh skip
  const existingEnrolment = await db.enrolment.findUnique({
    where: { userId_courseId: { userId, courseId: order.courseId } },
  });
  if (existingEnrolment) {
    return { alreadyEnrolled: true, courseId: order.courseId };
  }

  const now = new Date();
  const accessExpiresAt = computeAccessExpiry(
    order.accessDuration as AccessDuration,
    now,
  );

  // Transaction — order update + enrolment create
  await db.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "COMPLETED",
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    await tx.enrolment.create({
      data: {
        userId,
        courseId: order.courseId,
        accessDuration: order.accessDuration,
        accessGrantedAt: now,
        accessExpiresAt,
        orderId: order.id,
      },
    });

    // Coupon usedCount increment karo
    if (order.couponId) {
      await tx.coupon.update({
        where: { id: order.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }
  });

  return { alreadyEnrolled: false, courseId: order.courseId, accessExpiresAt };
}
