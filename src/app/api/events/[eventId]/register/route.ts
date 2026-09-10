export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";
import { isEventFull, isEventPast } from "@/lib/event-utils";
import { generateQRCodeBase64 } from "@/lib/qr-utils";
import { sendEventRegistrationEmail } from "@/server/email";
import { uploadQRCode } from "@/lib/qr-upload";

// ── Validation schema ─────────────────────────────────────────
const registerSchema = z.discriminatedUnion("type", [
  // Logged-in user registration
  z.object({
    type: z.literal("user"),
    userId: z.string().min(1),
  }),
  // Guest registration
  z.object({
    type: z.literal("guest"),
    guestName: z.string().min(2, "Name must be at least 2 characters"),
    guestEmail: z.string().email("Invalid email address"),
    guestPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  }),
]);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;
    const body = await req.json();

    // ── Determine registration type ──────────────────────────
    // Client sends either { userId } or { guestName, guestEmail, guestPhone }
    const isUserRegistration = "userId" in body;

    const parsed = registerSchema.safeParse({
      type: isUserRegistration ? "user" : "guest",
      ...body,
    });

    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const data = parsed.data;

    // ── If user registration — verify session matches ───────
    if (data.type === "user") {
      const session = await auth();
      if (!session?.user || session.user.id !== data.userId) {
        return NextResponse.json(apiError("Unauthorized."), { status: 401 });
      }
    }

    // ── Fetch event ───────────────────────────────────────────
    const event = await db.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        startDate: true,
        endDate: true,
        mode: true,
        venue: true,
        joinLink: true,
        capacity: true,
        registeredCount: true,
        waitlistEnabled: true,
        pricingType: true,
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

    if (event.pricingType !== "FREE") {
      return NextResponse.json(
        apiError("This is a paid event. Please use the payment flow."),
        { status: 400 },
      );
    }

    // ── Capacity check ────────────────────────────────────────
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
        where: { eventId_userId: { eventId, userId: data.userId } },
      });
      if (existing) {
        return NextResponse.json(
          apiError("You are already registered for this event."),
          { status: 409 },
        );
      }
    } else {
      // Guest — check by email for this event
      const existing = await db.eventRegistration.findFirst({
        where: { eventId, guestEmail: data.guestEmail, userId: null },
      });
      if (existing) {
        return NextResponse.json(
          apiError("This email is already registered for this event."),
          { status: 409 },
        );
      }
    }

    // ── Fetch user details if userId provided ─────────────────
    let registrantName = "";
    let registrantEmail = "";

    if (data.type === "user") {
      const user = await db.user.findUnique({
        where: { id: data.userId },
        select: { name: true, email: true },
      });
      if (!user) {
        return NextResponse.json(apiError("User not found."), { status: 404 });
      }
      registrantName = user.name ?? "Student";
      registrantEmail = user.email;
    } else {
      registrantName = data.guestName;
      registrantEmail = data.guestEmail;
    }

    // ── Create registration + increment count (transaction) ──
    const registration = await db.$transaction(async (tx) => {
      const reg = await tx.eventRegistration.create({
        data: {
          eventId,
          status: "CONFIRMED",
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

      await tx.event.update({
        where: { id: eventId },
        data: { registeredCount: { increment: 1 } },
      });

      return reg;
    });

    // ── Generate QR code + send confirmation email ────────────
    try {
      const qrCodeUrl = await uploadQRCode(registration.ticketCode);

      await sendEventRegistrationEmail({
        email: registrantEmail,
        name: registrantName,
        eventTitle: event.title,
        eventSlug: event.slug,
        startDate: event.startDate,
        endDate: event.endDate,
        mode: event.mode,
        venue: event.venue,
        joinLink: event.joinLink,
        ticketCode: registration.ticketCode,
        qrCodeUrl,
      });
    } catch (emailError) {
      console.error("[REGISTRATION_EMAIL_FAILED]", emailError);
    }

    try {
      const qrCodeUrl = await uploadQRCode(registration.ticketCode);

      await sendEventRegistrationEmail({
        email: registrantEmail,
        name: registrantName,
        eventTitle: event.title,
        eventSlug: event.slug,
        startDate: event.startDate,
        endDate: event.endDate,
        mode: event.mode,
        venue: event.venue,
        joinLink: event.joinLink,
        ticketCode: registration.ticketCode,
        qrCodeUrl, // null ho sakta hai ab — email template handle karega
      });
    } catch (emailError) {
      console.error("[REGISTRATION_EMAIL_FAILED]", emailError);
      // Registration already ho chuki hai — email fail hone se poora flow fail nahi hota
    }

    return NextResponse.json(
      apiSuccess({
        registrationId: registration.id,
        ticketCode: registration.ticketCode,
        status: registration.status,
      }),
      { status: 201 },
    );
  } catch (error) {
    console.error("[EVENT_REGISTER]", error);
    return NextResponse.json(
      apiError("Failed to register. Please try again."),
      { status: 500 },
    );
  }
}
