import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { isEventFull, isEventPast } from "@/lib/event-utils";
import { z } from "zod";

const schema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("user"),
    userId: z.string().min(1),
  }),
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

    const event = await db.event.findUnique({
      where: { eventId } as any,
      select: {
        id: true,
        status: true,
        startDate: true,
        capacity: true,
        registeredCount: true,
        waitlistEnabled: true,
        waitlistCount: true,
      },
    });

    // Fix — use correct where clause
    const eventFetched = await db.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        status: true,
        startDate: true,
        capacity: true,
        registeredCount: true,
        waitlistEnabled: true,
        waitlistCount: true,
      },
    });

    if (!eventFetched) {
      return NextResponse.json(apiError("Event not found."), { status: 404 });
    }

    if (eventFetched.status !== "PUBLISHED") {
      return NextResponse.json(apiError("This event is not available."), {
        status: 400,
      });
    }

    if (isEventPast(eventFetched.startDate)) {
      return NextResponse.json(apiError("This event has already concluded."), {
        status: 400,
      });
    }

    if (!eventFetched.waitlistEnabled) {
      return NextResponse.json(
        apiError("Waitlist is not enabled for this event."),
        { status: 400 },
      );
    }

    // Waitlist sirf tab jab event actually full ho
    if (!isEventFull(eventFetched.capacity, eventFetched.registeredCount)) {
      return NextResponse.json(
        apiError(
          "This event still has spots available. Please register directly.",
        ),
        { status: 400 },
      );
    }

    // ── Duplicate check ────────────────────────────────────────
    if (data.type === "user") {
      const existingReg = await db.eventRegistration.findUnique({
        where: { eventId_userId: { eventId, userId: data.userId } },
      });
      if (existingReg) {
        return NextResponse.json(
          apiError("You are already registered for this event."),
          { status: 409 },
        );
      }
      const existingWaitlist = await db.eventWaitlist.findUnique({
        where: { eventId_userId: { eventId, userId: data.userId } },
      });
      if (existingWaitlist) {
        return NextResponse.json(apiError("You are already on the waitlist."), {
          status: 409,
        });
      }
    } else {
      const existingReg = await db.eventRegistration.findFirst({
        where: { eventId, guestEmail: data.guestEmail, userId: null },
      });
      if (existingReg) {
        return NextResponse.json(
          apiError("This email is already registered for this event."),
          { status: 409 },
        );
      }
      const existingWaitlist = await db.eventWaitlist.findFirst({
        where: { eventId, guestEmail: data.guestEmail, userId: null },
      });
      if (existingWaitlist) {
        return NextResponse.json(
          apiError("This email is already on the waitlist."),
          { status: 409 },
        );
      }
    }

    // ── Create waitlist entry + increment count (transaction) ─
    const waitlistEntry = await db.$transaction(async (tx) => {
      const position = eventFetched.waitlistCount + 1;

      const entry = await tx.eventWaitlist.create({
        data: {
          eventId,
          position,
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
        data: { waitlistCount: { increment: 1 } },
      });

      return entry;
    });

    return NextResponse.json(
      apiSuccess({
        waitlistId: waitlistEntry.id,
        position: waitlistEntry.position,
      }),
      { status: 201 },
    );
  } catch (error) {
    console.error("[EVENT_WAITLIST]", error);
    return NextResponse.json(
      apiError("Failed to join waitlist. Please try again."),
      { status: 500 },
    );
  }
}
