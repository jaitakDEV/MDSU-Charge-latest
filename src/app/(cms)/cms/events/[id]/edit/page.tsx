import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { EventForm } from "@/features/cms/components/events/event-form";
import Link from "next/link";

export const metadata = { title: "Edit Event — CMS" };

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      coverImage: true,
      eventType: true,
      mode: true,
      status: true,
      isFeatured: true,
      venue: true,
      joinLink: true,
      startDate: true,
      endDate: true,
      timezone: true,
      capacity: true,
      registeredCount: true,
      waitlistEnabled: true,
      pricingType: true,
      price: true,
      refundPolicy: true,
      cancellationDeadline: true,
      tags: true,
      metaTitle: true,
      metaDescription: true,
      authorId: true,
      _count: { select: { registrations: true } },
    },
  });

  if (!event) notFound();

  // CMS Editor sirf apna event edit kar sakta hai
  if (
    session.user.role === "CMS_EDITOR" &&
    event.authorId !== session.user.id
  ) {
    redirect(ROUTES.cmsEvents);
  }

  // Datetime-local input format — "YYYY-MM-DDTHH:mm"
  function toDateTimeLocal(date: Date | null): string {
    if (!date) return "";
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  const initialData = {
    title: event.title,
    slug: event.slug,
    description: event.description ?? "",
    content: event.content ?? "",
    coverImage: event.coverImage ?? "",
    eventType: event.eventType,
    mode: event.mode,
    status: event.status,
    isFeatured: event.isFeatured,
    venue: event.venue ?? "",
    joinLink: event.joinLink ?? "",
    startDate: toDateTimeLocal(event.startDate),
    endDate: toDateTimeLocal(event.endDate),
    timezone: event.timezone,
    capacity: event.capacity ? String(event.capacity) : "",
    waitlistEnabled: event.waitlistEnabled,
    pricingType: event.pricingType,
    price: event.price > 0 ? String(event.price / 100) : "",
    refundPolicy: event.refundPolicy ?? "",
    cancellationDeadline: toDateTimeLocal(event.cancellationDeadline),
    tags: event.tags?.join(", ") ?? "",
    metaTitle: event.metaTitle ?? "",
    metaDescription: event.metaDescription ?? "",
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "760px",
      }}
    >
      <Link
        href={ROUTES.cmsEvents}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "12.5px",
          color: "#64748b",
          textDecoration: "none",
          marginBottom: "1rem",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        All Events
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1.75rem",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px",
              letterSpacing: "-0.4px",
            }}
          >
            Edit Event
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            {event.title}
          </p>
        </div>

        {event._count.registrations > 0 && (
          <Link
            href={ROUTES.cmsEventRegs(event.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              height: "36px",
              padding: "0 16px",
              border: "1px solid #bfdbfe",
              borderRadius: "9px",
              background: "#eff6ff",
              color: "#1d4ed8",
              fontSize: "12.5px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {event._count.registrations} Registration
            {event._count.registrations !== 1 ? "s" : ""}
          </Link>
        )}
      </div>

      {/* Warning if event has registrations */}
      {event._count.registrations > 0 && event.status === "PUBLISHED" && (
        <div
          style={{
            padding: "12px 16px",
            background: "#fefce8",
            border: "1px solid #fde68a",
            borderRadius: "12px",
            fontSize: "13px",
            color: "#854d0e",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#eab308"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          This event has {event._count.registrations} registered attendee
          {event._count.registrations !== 1 ? "s" : ""}. Setting status to
          "Cancelled" will notify all registrants via email.
        </div>
      )}

      <EventForm
        eventId={event.id}
        initialData={initialData}
        isAdmin={session.user.role === "ADMIN"}
      />
    </div>
  );
}
