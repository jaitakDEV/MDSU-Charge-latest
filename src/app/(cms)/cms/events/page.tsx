// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";
// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import Link from "next/link";
// import { EventList } from "@/features/cms/components/events/event-list";

// export const metadata = { title: "Events — CMS" };

// export default async function CmsEventsPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ q?: string; status?: string; type?: string }>;
// }) {
//   const session = await auth();
//   if (
//     !session?.user ||
//     (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
//   )
//     redirect(ROUTES.login);

//   const { q, status, type } = await searchParams;
//   const query = q?.trim() ?? "";
//   const filter = status ?? "ALL";
//   const typeFilter = type ?? "ALL";

//   const where = {
//     ...(session.user.role === "CMS_EDITOR"
//       ? { authorId: session.user.id }
//       : {}),
//     ...(filter !== "ALL" ? { status: filter as any } : {}),
//     ...(typeFilter !== "ALL" ? { eventType: typeFilter as any } : {}),
//     ...(query
//       ? { title: { contains: query, mode: "insensitive" as const } }
//       : {}),
//   };

//   const [events, counts] = await Promise.all([
//     db.event.findMany({
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
//         author: { select: { name: true } },
//         _count: { select: { registrations: true } },
//       },
//     }),
//     db.event.groupBy({
//       by: ["status"],
//       where:
//         session.user.role === "CMS_EDITOR" ? { authorId: session.user.id } : {},
//       _count: { _all: true },
//     }),
//   ]);

//   const countMap = counts.reduce(
//     (acc, c) => ({ ...acc, [c.status]: c._count._all }),
//     {} as Record<string, number>,
//   );
//   const totalCount = Object.values(countMap).reduce((a, b) => a + b, 0);

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, sans-serif",
//         maxWidth: "1100px",
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "flex-start",
//           justifyContent: "space-between",
//           marginBottom: "1.75rem",
//           flexWrap: "wrap",
//           gap: "12px",
//         }}
//       >
//         <div>
//           <h1
//             style={{
//               fontSize: "20px",
//               fontWeight: 700,
//               color: "#0f172a",
//               margin: "0 0 4px",
//               letterSpacing: "-0.4px",
//             }}
//           >
//             Events
//           </h1>
//           <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
//             Create and manage events for the public website
//           </p>
//         </div>

//         <Link
//           href={ROUTES.cmsEventsNew}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "6px",
//             height: "38px",
//             padding: "0 18px",
//             borderRadius: "10px",
//             background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
//             color: "#fff",
//             fontWeight: 600,
//             fontSize: "13px",
//             textDecoration: "none",
//             boxShadow: "0 2px 6px rgba(29,78,216,0.25)",
//           }}
//         >
//           <svg
//             width="13"
//             height="13"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <line x1="12" y1="5" x2="12" y2="19" />
//             <line x1="5" y1="12" x2="19" y2="12" />
//           </svg>
//           New Event
//         </Link>
//       </div>

//       <EventList
//         events={events}
//         countMap={{ ...countMap, ALL: totalCount }}
//         currentFilter={filter}
//         currentType={typeFilter}
//         currentQuery={query}
//       />
//     </div>
//   );
// }

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { EventList } from "@/features/cms/components/events/event-list";

export const metadata = { title: "Events — CMS" };

export default async function CmsEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; type?: string }>;
}) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const { q, status, type } = await searchParams;
  const query = q?.trim() ?? "";
  const filter = status ?? "ALL";
  const typeFilter = type ?? "ALL";
  const now = new Date();

  // ── Type filter — actual startDate ke against, stored eventType field pe nahi ──
  const typeWhere =
    typeFilter === "UPCOMING"
      ? { startDate: { gte: now } }
      : typeFilter === "PAST"
        ? { startDate: { lt: now } }
        : {};

  const where = {
    ...(session.user.role === "CMS_EDITOR"
      ? { authorId: session.user.id }
      : {}),
    ...(filter !== "ALL" ? { status: filter as any } : {}),
    ...typeWhere,
    ...(query
      ? { title: { contains: query, mode: "insensitive" as const } }
      : {}),
  };

  const [events, counts] = await Promise.all([
    db.event.findMany({
      where,
      orderBy: [{ status: "asc" }, { startDate: "asc" }],
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
        author: { select: { name: true } },
        _count: { select: { registrations: true } },
      },
    }),
    db.event.groupBy({
      by: ["status"],
      where:
        session.user.role === "CMS_EDITOR" ? { authorId: session.user.id } : {},
      _count: { _all: true },
    }),
  ]);

  const countMap = counts.reduce(
    (acc, c) => ({ ...acc, [c.status]: c._count._all }),
    {} as Record<string, number>,
  );
  const totalCount = Object.values(countMap).reduce((a, b) => a + b, 0);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "1100px",
      }}
    >
      {/* Header */}
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
            Events
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            Create and manage events for the public website
          </p>
        </div>

        <Link
          href={ROUTES.cmsEventsNew}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "38px",
            padding: "0 18px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "13px",
            textDecoration: "none",
            boxShadow: "0 2px 6px rgba(29,78,216,0.25)",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Event
        </Link>
      </div>

      <EventList
        events={events}
        countMap={{ ...countMap, ALL: totalCount }}
        currentFilter={filter}
        currentType={typeFilter}
        currentQuery={query}
      />
    </div>
  );
}
