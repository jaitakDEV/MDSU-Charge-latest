import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { razorpay } from "@/server/razorpay";
import { generateReceiptId } from "@/lib/razorpay-utils";
import { apiError, apiSuccess } from "@/lib/utils";
import { isEventFull, isEventPast } from "@/lib/event-utils";
import { z } from "zod";

const schema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("user"),
    eventId: z.string().min(1),
    userId: z.string().min(1),
  }),
  z.object({
    type: z.literal("guest"),
    eventId: z.string().min(1),
    guestName: z.string().min(2),
    guestEmail: z.string().email(),
    guestPhone: z.string().min(10),
  }),
]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isUserFlow = "userId" in body;

    const parsed = schema.safeParse({
      type: isUserFlow ? "user" : "guest",
      ...body,
    });

    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const data = parsed.data;

    if (data.type === "user") {
      const session = await auth();
      if (!session?.user || session.user.id !== data.userId) {
        return NextResponse.json(apiError("Unauthorized."), { status: 401 });
      }
    }

    // ── Fetch event — price ALWAYS read server-side ──────────
    const event = await db.event.findUnique({
      where: { id: data.eventId },
      select: {
        id: true,
        title: true,
        status: true,
        startDate: true,
        pricingType: true,
        price: true,
        capacity: true,
        registeredCount: true,
        waitlistEnabled: true,
      },
    });

    if (!event) {
      return NextResponse.json(apiError("Event not found."), { status: 404 });
    }

    if (event.status !== "PUBLISHED") {
      return NextResponse.json(
        apiError("This event is not open for registration."),
        { status: 400 },
      );
    }

    if (isEventPast(event.startDate)) {
      return NextResponse.json(apiError("This event has already concluded."), {
        status: 400,
      });
    }

    if (event.pricingType !== "PAID") {
      return NextResponse.json(
        apiError(
          "This is a free event. Please use the free registration flow.",
        ),
        { status: 400 },
      );
    }

    if (isEventFull(event.capacity, event.registeredCount)) {
      return NextResponse.json(
        apiError(
          event.waitlistEnabled
            ? "This event is full. Please join the waitlist."
            : "This event has reached full capacity.",
        ),
        { status: 409 },
      );
    }

    // ── Duplicate check ────────────────────────────────────────
    if (data.type === "user") {
      const existing = await db.eventRegistration.findUnique({
        where: {
          eventId_userId: { eventId: data.eventId, userId: data.userId },
        },
      });
      if (existing) {
        return NextResponse.json(
          apiError("You are already registered for this event."),
          { status: 409 },
        );
      }
    } else {
      const existing = await db.eventRegistration.findFirst({
        where: {
          eventId: data.eventId,
          guestEmail: data.guestEmail,
          userId: null,
        },
      });
      if (existing) {
        return NextResponse.json(
          apiError("This email is already registered for this event."),
          { status: 409 },
        );
      }
    }

    // ── Create Razorpay order — price from DB, never client ──
    const receiptId = generateReceiptId();
    const rzpOrder = await razorpay.orders.create({
      amount: event.price, // paise — already server-side
      currency: "INR",
      receipt: receiptId,
    });

    // ── Create PENDING registration ───────────────────────────
    const registration = await db.eventRegistration.create({
      data: {
        eventId: data.eventId,
        status: "PENDING",
        razorpayOrderId: rzpOrder.id,
        amountPaid: event.price,
        ...(data.type === "user"
          ? { userId: data.userId }
          : {
              userId: null,
              guestName: data.guestName,
              guestEmail: data.guestEmail,
              guestPhone: data.guestPhone,
            }),
      },
    });

    return NextResponse.json(
      apiSuccess({
        registrationId: registration.id,
        razorpayOrderId: rzpOrder.id,
        amount: event.price,
        currency: "INR",
        eventTitle: event.title,
      }),
      { status: 201 },
    );
  } catch (error) {
    console.error("[EVENT_CREATE_ORDER]", error);
    return NextResponse.json(
      apiError("Failed to create order. Please try again."),
      { status: 500 },
    );
  }
}
