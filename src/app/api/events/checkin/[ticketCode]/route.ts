import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticketCode: string }> },
) {
  try {
    // ── Auth guard — sirf CMS_EDITOR ya ADMIN check-in kar sakte hain ─
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN") {
      return NextResponse.json(
        apiError("Forbidden — only staff can check in attendees."),
        { status: 403 },
      );
    }

    const { ticketCode } = await params;

    const registration = await db.eventRegistration.findUnique({
      where: { ticketCode },
      select: {
        id: true,
        status: true,
        checkedIn: true,
        checkedInAt: true,
        eventId: true,
        userId: true,
        guestName: true,
        guestEmail: true,
        user: { select: { name: true, email: true } },
        event: {
          select: {
            id: true,
            title: true,
            authorId: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!registration) {
      return NextResponse.json(
        apiError(
          "Invalid ticket. This QR code does not match any registration.",
        ),
        { status: 404 },
      );
    }

    // CMS_EDITOR sirf apne event ke tickets check-in kar sakta hai
    if (
      guard.role === "CMS_EDITOR" &&
      registration.event.authorId !== guard.userId
    ) {
      return NextResponse.json(
        apiError("Forbidden — this is not your event."),
        { status: 403 },
      );
    }

    // Registration status check
    if (registration.status === "CANCELLED") {
      return NextResponse.json(
        apiError("This registration has been cancelled. Entry not permitted."),
        { status: 400 },
      );
    }

    if (registration.status === "REFUNDED") {
      return NextResponse.json(
        apiError("This ticket has been refunded. Entry not permitted."),
        { status: 400 },
      );
    }

    if (registration.status === "PENDING") {
      return NextResponse.json(
        apiError(
          "Payment not yet confirmed for this ticket. Entry not permitted.",
        ),
        { status: 400 },
      );
    }

    // Already checked in — idempotent response, not an error
    if (registration.checkedIn) {
      return NextResponse.json(
        apiSuccess({
          alreadyCheckedIn: true,
          attendeeName:
            registration.user?.name ?? registration.guestName ?? "Attendee",
          checkedInAt: registration.checkedInAt,
          eventTitle: registration.event.title,
        }),
      );
    }

    // ── Mark checked in ────────────────────────────────────────
    const updated = await db.eventRegistration.update({
      where: { id: registration.id },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
      },
      select: { checkedInAt: true },
    });

    return NextResponse.json(
      apiSuccess({
        alreadyCheckedIn: false,
        attendeeName:
          registration.user?.name ?? registration.guestName ?? "Attendee",
        attendeeEmail: registration.user?.email ?? registration.guestEmail,
        checkedInAt: updated.checkedInAt,
        eventTitle: registration.event.title,
      }),
    );
  } catch (error) {
    console.error("[EVENT_CHECKIN]", error);
    return NextResponse.json(apiError("Check-in failed. Please try again."), {
      status: 500,
    });
  }
}
