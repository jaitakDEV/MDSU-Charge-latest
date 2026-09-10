import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { AdminRegistrationsTable } from "@/features/admin/components/events/admin-registrations-table";

export const metadata = { title: "Event Registrations — Admin" };

const PAGE_SIZE = 25;

export default async function AdminEventRegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    eventId?: string;
    page?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { q, status, eventId, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const filter = status ?? "ALL";
  const page = Math.max(1, Number(pageParam ?? 1));

  const where = {
    ...(eventId ? { eventId } : {}),
    ...(filter !== "ALL" ? { status: filter as any } : {}),
    ...(query
      ? {
          OR: [
            { guestName: { contains: query, mode: "insensitive" as const } },
            { guestEmail: { contains: query, mode: "insensitive" as const } },
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

  const [registrations, total, events] = await Promise.all([
    db.eventRegistration.findMany({
      where,
      orderBy: { registeredAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
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
        event: { select: { id: true, title: true, pricingType: true } },
      },
    }),
    db.eventRegistration.count({ where }),
    db.event.findMany({
      select: { id: true, title: true },
      orderBy: { startDate: "desc" },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "1150px",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
          }}
        >
          Event Registrations
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          {total} total registrations across all events
        </p>
      </div>

      <AdminRegistrationsTable
        registrations={registrations}
        events={events}
        currentFilter={filter}
        currentQuery={query}
        currentEventId={eventId ?? ""}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
