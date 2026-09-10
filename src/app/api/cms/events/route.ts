// import { NextResponse } from "next/server";
// import { requireAuth } from "@/server/api-guard";
// import { db } from "@/server/db";
// import { apiError, apiSuccess } from "@/lib/utils";
// import { z } from "zod";
// import type {
//   EventType,
//   EventMode,
//   EventStatus,
//   PricingType,
// } from "@prisma/client";

// const createEventSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters"),
//   slug: z.string().min(3),
//   description: z.string().max(300).optional(),
//   content: z.string().optional(),
//   coverImage: z.string().optional(),
//   eventType: z.enum(["UPCOMING", "PAST"]),
//   mode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
//   status: z
//     .enum(["DRAFT", "PUBLISHED", "CANCELLED", "ARCHIVED"])
//     .default("DRAFT"),
//   isFeatured: z.boolean().default(false),
//   venue: z.string().optional(),
//   joinLink: z.string().url().optional().or(z.literal("")),
//   startDate: z.string().datetime(),
//   endDate: z.string().datetime().optional(),
//   timezone: z.string().default("Asia/Kolkata"),
//   capacity: z.number().int().positive().optional(),
//   waitlistEnabled: z.boolean().default(false),
//   pricingType: z.enum(["FREE", "PAID"]),
//   price: z.number().int().min(0).default(0), // paise
//   refundPolicy: z.string().optional(),
//   cancellationDeadline: z.string().datetime().optional(),
//   tags: z.array(z.string()).default([]),
//   metaTitle: z.string().optional(),
//   metaDescription: z.string().optional(),
// });

// export async function GET(req: Request) {
//   try {
//     const guard = await requireAuth();
//     if (!guard.ok) return guard.response;
//     if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
//       return NextResponse.json(apiError("Forbidden"), { status: 403 });

//     const { searchParams } = new URL(req.url);
//     const q = searchParams.get("q")?.trim() ?? "";
//     const status = searchParams.get("status") ?? "";
//     const type = searchParams.get("type") ?? "";

//     const where = {
//       ...(guard.role === "CMS_EDITOR" ? { authorId: guard.userId } : {}),
//       ...(status ? { status: status as EventStatus } : {}),
//       ...(type ? { eventType: type as EventType } : {}),
//       ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
//     };

//     const events = await db.event.findMany({
//       where,
//       orderBy: [{ status: "asc" }, { startDate: "asc" }],
//       select: {
//         id: true,
//         title: true,
//         slug: true,
//         status: true,
//         eventType: true,
//         mode: true,
//         pricingType: true,
//         price: true,
//         startDate: true,
//         endDate: true,
//         capacity: true,
//         registeredCount: true,
//         isFeatured: true,
//         coverImage: true,
//         updatedAt: true,
//         author: { select: { name: true, email: true } },
//         _count: { select: { registrations: true } },
//       },
//     });

//     return NextResponse.json(apiSuccess(events));
//   } catch (error) {
//     console.error("[CMS_EVENTS_GET]", error);
//     return NextResponse.json(apiError("Failed to fetch events."), {
//       status: 500,
//     });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const guard = await requireAuth();
//     if (!guard.ok) return guard.response;
//     if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
//       return NextResponse.json(apiError("Forbidden"), { status: 403 });

//     const body = await req.json();
//     const parsed = createEventSchema.safeParse(body);

//     if (!parsed.success)
//       return NextResponse.json(apiError(parsed.error.issues[0].message), {
//         status: 400,
//       });

//     const d = parsed.data;

//     const existing = await db.event.findUnique({ where: { slug: d.slug } });
//     if (existing)
//       return NextResponse.json(
//         apiError("An event with this slug already exists."),
//         { status: 409 },
//       );

//     if (d.pricingType === "PAID" && (!d.price || d.price <= 0))
//       return NextResponse.json(apiError("Price is required for paid events."), {
//         status: 400,
//       });

//     if ((d.mode === "OFFLINE" || d.mode === "HYBRID") && !d.venue)
//       return NextResponse.json(
//         apiError("Venue is required for offline and hybrid events."),
//         { status: 400 },
//       );

//     if ((d.mode === "ONLINE" || d.mode === "HYBRID") && !d.joinLink)
//       return NextResponse.json(
//         apiError("Join link is required for online and hybrid events."),
//         { status: 400 },
//       );

//     const isFeatured = guard.role === "ADMIN" ? d.isFeatured : false;

//     const event = await db.event.create({
//       data: {
//         title: d.title,
//         slug: d.slug,
//         description: d.description ?? null,
//         content: d.content ?? null,
//         coverImage: d.coverImage ?? null,
//         eventType: d.eventType as EventType,
//         mode: d.mode as EventMode,
//         status: d.status as EventStatus,
//         isFeatured,
//         venue: d.venue ?? null,
//         joinLink: d.joinLink ?? null,
//         startDate: new Date(d.startDate),
//         endDate: d.endDate ? new Date(d.endDate) : null,
//         timezone: d.timezone,
//         capacity: d.capacity ?? null,
//         waitlistEnabled: d.capacity ? d.waitlistEnabled : false,
//         pricingType: d.pricingType as PricingType,
//         price: d.pricingType === "FREE" ? 0 : d.price,
//         refundPolicy: d.refundPolicy ?? null,
//         cancellationDeadline: d.cancellationDeadline
//           ? new Date(d.cancellationDeadline)
//           : null,
//         tags: d.tags,
//         metaTitle: d.metaTitle ?? null,
//         metaDescription: d.metaDescription ?? null,
//         authorId: guard.userId,
//       },
//     });

//     return NextResponse.json(apiSuccess({ id: event.id, slug: event.slug }), {
//       status: 201,
//     });
//   } catch (error) {
//     console.error("[CMS_EVENTS_POST]", error);
//     return NextResponse.json(apiError("Failed to create event."), {
//       status: 500,
//     });
//   }
// }

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

// ── Schema ─────────────────────────────────────────────────────
const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3),
  description: z.string().max(300).optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  // eventType is intentionally NOT in schema — computed server-side from startDate
  mode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
  status: z
    .enum(["DRAFT", "PUBLISHED", "CANCELLED", "ARCHIVED"])
    .default("DRAFT"),
  isFeatured: z.boolean().default(false),
  venue: z.string().optional(),
  joinLink: z.string().url().optional().or(z.literal("")),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  timezone: z.string().default("Asia/Kolkata"),
  capacity: z.number().int().positive().optional(),
  waitlistEnabled: z.boolean().default(false),
  pricingType: z.enum(["FREE", "PAID"]),
  price: z.number().int().min(0).default(0),
  refundPolicy: z.string().optional(),
  cancellationDeadline: z.string().datetime().optional(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// ── Helper: compute eventType from startDate ──────────────────
function computeEventType(startDate: Date): EventType {
  return startDate >= new Date() ? "UPCOMING" : "PAST";
}

// ── GET /api/cms/events ────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const status = searchParams.get("status") ?? "";
    const type = searchParams.get("type") ?? "";
    const now = new Date();

    // Owner filter
    const ownerFilter =
      guard.role === "CMS_EDITOR" ? { authorId: guard.userId } : {};

    // Type filter — match both DB field and startDate for robustness
    const typeFilter =
      type === "UPCOMING"
        ? {
            OR: [
              { eventType: "UPCOMING" as EventType },
              { startDate: { gte: now } },
            ],
          }
        : type === "PAST"
          ? {
              OR: [
                { eventType: "PAST" as EventType },
                { startDate: { lt: now } },
              ],
            }
          : {};

    const where = {
      ...ownerFilter,
      ...(status ? { status: status as EventStatus } : {}),
      ...typeFilter,
      ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
    };

    const events = await db.event.findMany({
      where,
      orderBy: [{ startDate: "desc" }],
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        eventType: true,
        mode: true,
        pricingType: true,
        price: true,
        startDate: true,
        endDate: true,
        capacity: true,
        registeredCount: true,
        isFeatured: true,
        coverImage: true,
        updatedAt: true,
        author: { select: { name: true, email: true } },
        _count: { select: { registrations: true } },
      },
    });

    return NextResponse.json(apiSuccess(events));
  } catch (error) {
    console.error("[CMS_EVENTS_GET]", error);
    return NextResponse.json(apiError("Failed to fetch events."), {
      status: 500,
    });
  }
}

// ── POST /api/cms/events ───────────────────────────────────────
export async function POST(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const body = await req.json();
    const parsed = createEventSchema.safeParse(body);

    if (!parsed.success)
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });

    const d = parsed.data;

    // ── Slug uniqueness ──
    const existing = await db.event.findUnique({ where: { slug: d.slug } });
    if (existing)
      return NextResponse.json(
        apiError("An event with this slug already exists."),
        { status: 409 },
      );

    // ── Business validations ──
    if (d.pricingType === "PAID" && (!d.price || d.price <= 0))
      return NextResponse.json(apiError("Price is required for paid events."), {
        status: 400,
      });

    if ((d.mode === "OFFLINE" || d.mode === "HYBRID") && !d.venue)
      return NextResponse.json(
        apiError("Venue is required for offline and hybrid events."),
        { status: 400 },
      );

    if ((d.mode === "ONLINE" || d.mode === "HYBRID") && !d.joinLink)
      return NextResponse.json(
        apiError("Join link is required for online and hybrid events."),
        { status: 400 },
      );

    // ── Server-side eventType computation — client value ignored ──
    const startDate = new Date(d.startDate);
    const computedEventType = computeEventType(startDate);

    // Only ADMIN can feature events
    const isFeatured = guard.role === "ADMIN" ? d.isFeatured : false;

    const event = await db.event.create({
      data: {
        title: d.title,
        slug: d.slug,
        description: d.description ?? null,
        content: d.content ?? null,
        coverImage: d.coverImage ?? null,
        eventType: computedEventType, // ← server-computed
        mode: d.mode as EventMode,
        status: d.status as EventStatus,
        isFeatured,
        venue: d.venue ?? null,
        joinLink: d.joinLink ?? null,
        startDate,
        endDate: d.endDate ? new Date(d.endDate) : null,
        timezone: d.timezone,
        capacity: d.capacity ?? null,
        waitlistEnabled: d.capacity ? d.waitlistEnabled : false,
        pricingType: d.pricingType as PricingType,
        price: d.pricingType === "FREE" ? 0 : d.price,
        refundPolicy: d.refundPolicy ?? null,
        cancellationDeadline: d.cancellationDeadline
          ? new Date(d.cancellationDeadline)
          : null,
        tags: d.tags,
        metaTitle: d.metaTitle ?? null,
        metaDescription: d.metaDescription ?? null,
        authorId: guard.userId,
      },
    });

    return NextResponse.json(apiSuccess({ id: event.id, slug: event.slug }), {
      status: 201,
    });
  } catch (error) {
    console.error("[CMS_EVENTS_POST]", error);
    return NextResponse.json(apiError("Failed to create event."), {
      status: 500,
    });
  }
}
