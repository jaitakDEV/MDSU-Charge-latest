import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { formatEventDate, formatEventPrice } from "@/lib/event-utils";
import { AdminEventRegistrationsTable } from "@/features/admin/components/events/admin-event-registrations-table";

export const metadata = { title: "Event Registrations — Admin" };

export default async function AdminEventRegistrationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; status?: string; type?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { id } = await params;
  const { q, status, type } = await searchParams;
  const query = q?.trim() ?? "";
  const filter = status ?? "ALL";
  const typeFilter = type ?? "ALL";

  const event = await db.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      coverImage: true,
      startDate: true,
      mode: true,
      pricingType: true,
      price: true,
      capacity: true,
      registeredCount: true,
      waitlistCount: true,
      author: { select: { name: true, email: true } },
    },
  });

  if (!event) notFound();

  const where = {
    eventId: id,
    ...(filter !== "ALL" ? { status: filter as any } : {}),
    ...(typeFilter === "USER" ? { userId: { not: null } } : {}),
    ...(typeFilter === "GUEST" ? { userId: null } : {}),
    ...(query
      ? {
          OR: [
            { guestName: { contains: query, mode: "insensitive" as const } },
            { guestEmail: { contains: query, mode: "insensitive" as const } },
            { guestPhone: { contains: query, mode: "insensitive" as const } },
            {
              user: { name: { contains: query, mode: "insensitive" as const } },
            },
            {
              user: {
                email: { contains: query, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  };

  const registrations = await db.eventRegistration.findMany({
    where,
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

  const allRegs = await db.eventRegistration.findMany({
    where: { eventId: id },
    select: { status: true, checkedIn: true, amountPaid: true, userId: true },
  });

  const totalConfirmed = allRegs.filter((r) => r.status === "CONFIRMED").length;
  const totalCheckedIn = allRegs.filter((r) => r.checkedIn).length;
  const totalGuests = allRegs.filter((r) => !r.userId).length;
  const totalUsers = allRegs.filter((r) => r.userId).length;
  const totalRevenue = allRegs
    .filter((r) => r.status === "CONFIRMED" && r.amountPaid)
    .reduce((sum, r) => sum + (r.amountPaid ?? 0), 0);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "1150px",
      }}
    >
      <Link
        href={ROUTES.adminEvents}
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
          gap: "14px",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "44px",
            borderRadius: "8px",
            background: "#f1f5f9",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {event.coverImage && (
            <img
              src={event.coverImage}
              alt={event.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
        <div>
          <h1
            style={{
              fontSize: "19px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px",
            }}
          >
            {event.title}
          </h1>
          <p style={{ fontSize: "12.5px", color: "#64748b", margin: 0 }}>
            {formatEventDate(event.startDate)} ·{" "}
            {formatEventPrice(event.pricingType, event.price)} · By{" "}
            {event.author.name ?? event.author.email}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "10px",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Registered",
            value: event.registeredCount,
            color: "#1d4ed8",
            bg: "#eff6ff",
          },
          {
            label: "Confirmed",
            value: totalConfirmed,
            color: "#16a34a",
            bg: "#f0fdf4",
          },
          {
            label: "Checked In",
            value: totalCheckedIn,
            color: "#7c3aed",
            bg: "#faf5ff",
          },
          {
            label: "Guests",
            value: totalGuests,
            color: "#854d0e",
            bg: "#fefce8",
          },
          {
            label: "Users",
            value: totalUsers,
            color: "#0f766e",
            bg: "#f0fdfa",
          },
          ...(event.pricingType === "PAID"
            ? [
                {
                  label: "Revenue",
                  value: `₹${(totalRevenue / 100).toLocaleString("en-IN")}`,
                  color: "#991b1b",
                  bg: "#fef2f2",
                },
              ]
            : []),
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              borderRadius: "12px",
              padding: "12px 14px",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: s.color,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 4px",
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontSize: "19px",
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <AdminEventRegistrationsTable
        eventId={id}
        registrations={registrations}
        currentFilter={filter}
        currentType={typeFilter}
        currentQuery={query}
        isPaid={event.pricingType === "PAID"}
      />
    </div>
  );
}
