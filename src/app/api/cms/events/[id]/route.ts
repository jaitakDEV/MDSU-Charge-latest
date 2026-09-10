import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { z } from "zod";
import type {
  EventType,
  EventMode,
  EventStatus,
  PricingType,
} from "@prisma/client";
import { sendEventCancelledEmail } from "@/server/email";

const updateEventSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  description: z.string().max(300).optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  eventType: z.enum(["UPCOMING", "PAST"]).optional(),
  mode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "ARCHIVED"]).optional(),
  isFeatured: z.boolean().optional(),
  venue: z.string().optional(),
  joinLink: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  timezone: z.string().optional(),
  capacity: z.number().int().positive().nullable().optional(),
  waitlistEnabled: z.boolean().optional(),
  pricingType: z.enum(["FREE", "PAID"]).optional(),
  price: z.number().int().min(0).optional(),
  refundPolicy: z.string().optional(),
  cancellationDeadline: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

    const event = await db.event.findUnique({
      where: { id },
      include: {
        registrations: {
          orderBy: { registeredAt: "desc" },
          select: {
            id: true,
            status: true,
            ticketCode: true,
            checkedIn: true,
            checkedInAt: true,
            amountPaid: true,
            registeredAt: true,
            razorpayPaymentId: true,
            userId: true,
            guestName: true,
            guestEmail: true,
            guestPhone: true,
            user: { select: { name: true, email: true } },
          },
        },
        _count: { select: { registrations: true, waitlistEntries: true } },
      },
    });

    if (!event)
      return NextResponse.json(apiError("Event not found."), { status: 404 });

    if (guard.role === "CMS_EDITOR" && event.authorId !== guard.userId)
      return NextResponse.json(apiError("Forbidden."), { status: 403 });

    return NextResponse.json(apiSuccess(event));
  } catch (error) {
    console.error("[CMS_EVENT_GET]", error);
    return NextResponse.json(apiError("Failed to fetch event."), {
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

    const existing = await db.event.findUnique({
      where: { id },
      select: { authorId: true, status: true },
    });

    if (!existing)
      return NextResponse.json(apiError("Event not found."), { status: 404 });

    if (guard.role === "CMS_EDITOR" && existing.authorId !== guard.userId)
      return NextResponse.json(apiError("Forbidden."), { status: 403 });

    const body = await req.json();
    const parsed = updateEventSchema.safeParse(body);

    if (!parsed.success)
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });

    const d = parsed.data;

    if (d.isFeatured !== undefined && guard.role !== "ADMIN")
      delete d.isFeatured;

    if (d.slug && d.slug !== existing.authorId) {
      const slugExists = await db.event.findFirst({
        where: { slug: d.slug, id: { not: id } },
      });
      if (slugExists)
        return NextResponse.json(
          apiError("A different event already uses this slug."),
          { status: 409 },
        );
    }

    await db.event.update({
      where: { id },
      data: {
        ...(d.title !== undefined && { title: d.title }),
        ...(d.slug !== undefined && { slug: d.slug }),
        ...(d.description !== undefined && {
          description: d.description || null,
        }),
        ...(d.content !== undefined && { content: d.content || null }),
        ...(d.coverImage !== undefined && { coverImage: d.coverImage || null }),
        ...(d.eventType !== undefined && {
          eventType: d.eventType as EventType,
        }),
        ...(d.mode !== undefined && { mode: d.mode as EventMode }),
        ...(d.status !== undefined && { status: d.status as EventStatus }),
        ...(d.isFeatured !== undefined && { isFeatured: d.isFeatured }),
        ...(d.venue !== undefined && { venue: d.venue || null }),
        ...(d.joinLink !== undefined && { joinLink: d.joinLink || null }),
        ...(d.startDate !== undefined && { startDate: new Date(d.startDate) }),
        ...(d.endDate !== undefined && {
          endDate: d.endDate ? new Date(d.endDate) : null,
        }),
        ...(d.timezone !== undefined && { timezone: d.timezone }),
        ...(d.capacity !== undefined && { capacity: d.capacity }),
        ...(d.waitlistEnabled !== undefined && {
          waitlistEnabled: d.waitlistEnabled,
        }),
        ...(d.pricingType !== undefined && {
          pricingType: d.pricingType as PricingType,
        }),
        ...(d.price !== undefined && {
          price: d.pricingType === "FREE" ? 0 : d.price,
        }),
        ...(d.refundPolicy !== undefined && {
          refundPolicy: d.refundPolicy || null,
        }),
        ...(d.cancellationDeadline !== undefined && {
          cancellationDeadline: d.cancellationDeadline
            ? new Date(d.cancellationDeadline)
            : null,
        }),
        ...(d.tags !== undefined && { tags: d.tags }),
        ...(d.metaTitle !== undefined && { metaTitle: d.metaTitle || null }),
        ...(d.metaDescription !== undefined && {
          metaDescription: d.metaDescription || null,
        }),
      },
    });

    if (d.status === "CANCELLED" && existing.status !== "CANCELLED") {
      await handleEventCancellation(id);
    }

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[CMS_EVENT_PATCH]", error);
    return NextResponse.json(apiError("Failed to update event."), {
      status: 500,
    });
  }
}

// export async function DELETE(
//   _req: Request,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     const guard = await requireAuth();
//     if (!guard.ok) return guard.response;
//     if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
//       return NextResponse.json(apiError("Forbidden"), { status: 403 });

//     const { id } = await params;

//     const event = await db.event.findUnique({
//       where: { id },
//       select: {
//         authorId: true,
//         status: true,
//         title: true,
//         startDate: true,
//         pricingType: true,
//         _count: { select: { registrations: true } },
//       },
//     });

//     if (!event)
//       return NextResponse.json(apiError("Event not found."), { status: 404 });

//     if (guard.role === "CMS_EDITOR" && event.authorId !== guard.userId)
//       return NextResponse.json(apiError("Forbidden."), { status: 403 });

//     if (event._count.registrations > 0 && event.status === "PUBLISHED") {
//       await handleEventCancellation(id);
//     }

//     await db.event.delete({ where: { id } });

//     return NextResponse.json(apiSuccess(null));
//   } catch (error) {
//     console.error("[CMS_EVENT_DELETE]", error);
//     return NextResponse.json(apiError("Failed to delete event."), {
//       status: 500,
//     });
//   }
// }
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

    const event = await db.event.findUnique({
      where: { id },
      select: {
        authorId: true,
        status: true,
        _count: { select: { registrations: true } },
      },
    });

    if (!event)
      return NextResponse.json(apiError("Event not found."), { status: 404 });

    if (guard.role === "CMS_EDITOR" && event.authorId !== guard.userId)
      return NextResponse.json(apiError("Forbidden."), { status: 403 });

    // ── Registrations wale event ko delete mat karo — cancel karwao ──
    if (event._count.registrations > 0) {
      return NextResponse.json(
        apiError(
          "This event has registrations and cannot be deleted. Please cancel the event instead — registrants will be notified automatically and records will be preserved.",
        ),
        { status: 400 },
      );
    }

    await db.event.delete({ where: { id } });

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[CMS_EVENT_DELETE]", error);
    return NextResponse.json(apiError("Failed to delete event."), {
      status: 500,
    });
  }
}

async function handleEventCancellation(eventId: string) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: {
      title: true,
      startDate: true,
      pricingType: true,
      registrations: {
        where: { status: "CONFIRMED" },
        select: {
          id: true,
          amountPaid: true,
          userId: true,
          guestEmail: true,
          guestName: true,
          user: { select: { name: true, email: true } },
        },
      },
    },
  });

  if (!event) return;

  await db.eventRegistration.updateMany({
    where: { eventId, status: "CONFIRMED" },
    data: { status: "CANCELLED" },
  });

  for (const reg of event.registrations) {
    const email = reg.user?.email ?? reg.guestEmail;
    const name = reg.user?.name ?? reg.guestName ?? "Attendee";
    if (!email) continue;

    try {
      await sendEventCancelledEmail({
        email,
        name,
        eventTitle: event.title,
        startDate: event.startDate,
        isPaid: event.pricingType === "PAID",
        amountPaid: reg.amountPaid ?? null,
      });
    } catch (e) {
      console.error(`[CANCEL_EMAIL_FAILED] ${email}`, e);
    }
  }
}
