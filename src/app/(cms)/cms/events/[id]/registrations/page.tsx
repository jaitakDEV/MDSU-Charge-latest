import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { formatEventDate, formatEventPrice } from "@/lib/event-utils";
import { RegistrationsTable } from "@/features/cms/components/events/registrations-table";
import Link from "next/link";

export const metadata = { title: "Event Registrations — CMS" };

export default async function EventRegistrationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const { id } = await params;
  const { status, q } = await searchParams;
  const query = q?.trim() ?? "";
  const filter = status ?? "ALL";

  const event = await db.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      startDate: true,
      authorId: true,
      pricingType: true,
      price: true,
      capacity: true,
      registeredCount: true,
      waitlistCount: true,
    },
  });

  if (!event) notFound();

  if (
    session.user.role === "CMS_EDITOR" &&
    event.authorId !== session.user.id
  ) {
    redirect(ROUTES.cmsEvents);
  }

  const registrations = await db.eventRegistration.findMany({
    where: {
      eventId: id,
      ...(filter !== "ALL" ? { status: filter as any } : {}),
      ...(query
        ? {
            OR: [
              { guestName: { contains: query, mode: "insensitive" as const } },
              { guestEmail: { contains: query, mode: "insensitive" as const } },
              {
                user: {
                  name: { contains: query, mode: "insensitive" as const },
                },
              },
              {
                user: {
                  email: { contains: query, mode: "insensitive" as const },
                },
              },
            ],
          }
        : {}),
    },
    orderBy: { registeredAt: "desc" },
    select: {
      id: true,
      status: true,
      ticketCode: true,
      checkedIn: true,
      checkedInAt: true,
      amountPaid: true,
      razorpayPaymentId: true,
      registeredAt: true,
      userId: true,
      guestName: true,
      guestEmail: true,
      guestPhone: true,
      user: { select: { name: true, email: true } },
    },
  });

  const waitlist = await db.eventWaitlist.findMany({
    where: { eventId: id },
    orderBy: { position: "asc" },
    select: {
      id: true,
      position: true,
      notified: true,
      joinedAt: true,
      userId: true,
      guestName: true,
      guestEmail: true,
      guestPhone: true,
      user: { select: { name: true, email: true } },
    },
  });

  const counts = {
    ALL: registrations.length,
    CONFIRMED: registrations.filter((r) => r.status === "CONFIRMED").length,
    PENDING: registrations.filter((r) => r.status === "PENDING").length,
    CANCELLED: registrations.filter((r) => r.status === "CANCELLED").length,
    REFUNDED: registrations.filter((r) => r.status === "REFUNDED").length,
  };

  const checkedInCount = registrations.filter((r) => r.checkedIn).length;
  const totalRevenue = registrations
    .filter((r) => r.status === "CONFIRMED" && r.amountPaid)
    .reduce((sum, r) => sum + (r.amountPaid ?? 0), 0);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "1100px",
      }}
    >
      <Link
        href={ROUTES.cmsEventEdit(id)}
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
        Back to Event
      </Link>

      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
            letterSpacing: "-0.4px",
          }}
        >
          Registrations
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          {event.title} · {formatEventDate(event.startDate)}
        </p>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Total Registered",
            value: String(event.registeredCount),
            color: "#1d4ed8",
            bg: "#eff6ff",
          },
          {
            label: "Checked In",
            value: `${checkedInCount}/${registrations.length}`,
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          {
            label: "Waitlist",
            value: String(waitlist.length),
            color: "#854d0e",
            bg: "#fefce8",
          },
          ...(event.pricingType === "PAID"
            ? [
                {
                  label: "Revenue",
                  value: `₹${(totalRevenue / 100).toLocaleString("en-IN")}`,
                  color: "#7c3aed",
                  bg: "#faf5ff",
                },
              ]
            : []),
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            style={{
              background: bg,
              borderRadius: "12px",
              padding: "1rem 1.1rem",
            }}
          >
            <p
              style={{
                fontSize: "10.5px",
                color,
                margin: "0 0 4px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <RegistrationsTable
        eventId={id}
        registrations={registrations}
        waitlist={waitlist}
        counts={counts}
        currentFilter={filter}
        currentQuery={query}
        capacity={event.capacity}
        isPaid={event.pricingType === "PAID"}
      />
    </div>
  );
}
