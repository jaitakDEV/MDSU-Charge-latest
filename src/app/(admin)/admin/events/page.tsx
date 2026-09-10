// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";
// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import Link from "next/link";
// import {
//   EVENT_STATUS_CONFIG,
//   EVENT_MODE_COLORS,
//   formatEventDate,
//   formatEventPrice,
// } from "@/lib/event-utils";

// export const metadata = { title: "Events — Admin" };

// export default async function AdminEventsPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ status?: string; q?: string }>;
// }) {
//   const session = await auth();
//   if (!session?.user || session.user.role !== "ADMIN")
//     redirect(ROUTES.dashboard);

//   const { status, q } = await searchParams;
//   const filter = status ?? "ALL";
//   const query = q?.trim() ?? "";

//   const where = {
//     ...(filter !== "ALL" ? { status: filter as any } : {}),
//     ...(query
//       ? { title: { contains: query, mode: "insensitive" as const } }
//       : {}),
//   };

//   const events = await db.event.findMany({
//     where,
//     orderBy: [{ status: "asc" }, { startDate: "asc" }],
//     select: {
//       id: true,
//       title: true,
//       status: true,
//       mode: true,
//       pricingType: true,
//       price: true,
//       startDate: true,
//       capacity: true,
//       registeredCount: true,
//       isFeatured: true,
//       coverImage: true,
//       author: { select: { name: true, email: true } },
//       _count: { select: { registrations: true } },
//     },
//   });

//   const counts = await db.event.groupBy({
//     by: ["status"],
//     _count: { _all: true },
//   });
//   const countMap = counts.reduce(
//     (acc, c) => ({ ...acc, [c.status]: c._count._all }),
//     {} as Record<string, number>,
//   );
//   const totalCount = Object.values(countMap).reduce((a, b) => a + b, 0);

//   const tabs = [
//     { key: "ALL", label: "All", count: totalCount },
//     { key: "PUBLISHED", label: "Published", count: countMap.PUBLISHED ?? 0 },
//     { key: "DRAFT", label: "Drafts", count: countMap.DRAFT ?? 0 },
//     { key: "CANCELLED", label: "Cancelled", count: countMap.CANCELLED ?? 0 },
//     { key: "ARCHIVED", label: "Archived", count: countMap.ARCHIVED ?? 0 },
//   ];

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, sans-serif",
//         maxWidth: "1100px",
//       }}
//     >
//       <div style={{ marginBottom: "1.5rem" }}>
//         <h1
//           style={{
//             fontSize: "20px",
//             fontWeight: 700,
//             color: "#0f172a",
//             margin: "0 0 4px",
//           }}
//         >
//           Events
//         </h1>
//         <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
//           Manage all events across the platform
//         </p>
//       </div>

//       {/* Filter tabs */}
//       <div
//         style={{
//           display: "flex",
//           gap: "4px",
//           marginBottom: "1.25rem",
//           background: "#f8fafc",
//           padding: "4px",
//           borderRadius: "12px",
//           border: "1px solid #e2e8f0",
//           width: "fit-content",
//         }}
//       >
//         {tabs.map((tab) => {
//           const isActive = filter === tab.key;
//           return (
//             <Link
//               key={tab.key}
//               href={`${ROUTES.adminEvents}?status=${tab.key}${query ? `&q=${query}` : ""}`}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 padding: "6px 14px",
//                 borderRadius: "9px",
//                 fontSize: "12.5px",
//                 fontWeight: isActive ? 600 : 500,
//                 color: isActive ? "#1d4ed8" : "#64748b",
//                 background: isActive ? "#fff" : "transparent",
//                 textDecoration: "none",
//                 border: isActive
//                   ? "1px solid #bfdbfe"
//                   : "1px solid transparent",
//               }}
//             >
//               {tab.label}
//               <span
//                 style={{
//                   fontSize: "11px",
//                   fontWeight: 700,
//                   padding: "1px 6px",
//                   borderRadius: "20px",
//                   background: isActive ? "#dbeafe" : "#e2e8f0",
//                   color: isActive ? "#1d4ed8" : "#64748b",
//                 }}
//               >
//                 {tab.count}
//               </span>
//             </Link>
//           );
//         })}
//       </div>

//       {/* Search */}
//       <form method="GET" style={{ marginBottom: "1.25rem" }}>
//         {filter !== "ALL" && (
//           <input type="hidden" name="status" value={filter} />
//         )}
//         <input
//           name="q"
//           defaultValue={query}
//           placeholder="Search events…"
//           style={{
//             height: "38px",
//             padding: "0 14px",
//             border: "1px solid #e2e8f0",
//             borderRadius: "10px",
//             fontSize: "13px",
//             width: "280px",
//           }}
//         />
//       </form>

//       {/* List */}
//       <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//         {events.map((event) => {
//           const cfg = EVENT_STATUS_CONFIG[event.status];
//           const modeCfg = EVENT_MODE_COLORS[event.mode];
//           const isFull =
//             event.capacity !== null && event.registeredCount >= event.capacity;

//           return (
//             <div
//               key={event.id}
//               style={{
//                 background: "#fff",
//                 border: "1px solid #e8edf2",
//                 borderRadius: "14px",
//                 padding: "1rem 1.25rem",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "14px",
//                 boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//               }}
//             >
//               <div
//                 style={{
//                   width: "64px",
//                   height: "44px",
//                   borderRadius: "8px",
//                   background: "#f1f5f9",
//                   flexShrink: 0,
//                   overflow: "hidden",
//                 }}
//               >
//                 {event.coverImage && (
//                   <img
//                     src={event.coverImage}
//                     alt={event.title}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                     }}
//                   />
//                 )}
//               </div>

//               <div style={{ flex: 1, minWidth: 0 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     marginBottom: "4px",
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: "10.5px",
//                       fontWeight: 700,
//                       padding: "2px 8px",
//                       borderRadius: "20px",
//                       background: cfg.bg,
//                       color: cfg.color,
//                     }}
//                   >
//                     {cfg.label}
//                   </span>
//                   <span
//                     style={{
//                       fontSize: "10.5px",
//                       fontWeight: 600,
//                       padding: "2px 8px",
//                       borderRadius: "20px",
//                       background: modeCfg.bg,
//                       color: modeCfg.color,
//                     }}
//                   >
//                     {event.mode === "ONLINE"
//                       ? "Online"
//                       : event.mode === "OFFLINE"
//                         ? "In Person"
//                         : "Hybrid"}
//                   </span>
//                   {event.isFeatured && (
//                     <span
//                       style={{
//                         fontSize: "10px",
//                         fontWeight: 700,
//                         padding: "2px 8px",
//                         borderRadius: "20px",
//                         background: "#fef9c3",
//                         color: "#854d0e",
//                       }}
//                     >
//                       ★ Featured
//                     </span>
//                   )}
//                 </div>
//                 <p
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: 600,
//                     color: "#0f172a",
//                     margin: "0 0 4px",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {event.title}
//                 </p>
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: "10px",
//                     fontSize: "11.5px",
//                     color: "#94a3b8",
//                   }}
//                 >
//                   <span>By {event.author.name ?? event.author.email}</span>
//                   <span>· {formatEventDate(event.startDate)}</span>
//                   <span>
//                     · {formatEventPrice(event.pricingType, event.price)}
//                   </span>
//                   <span>
//                     · {event.registeredCount}
//                     {event.capacity ? `/${event.capacity}` : ""} registered
//                     {isFull && " (Full)"}
//                   </span>
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
//                 <Link
//                   href={ROUTES.cmsEventRegs(event.id)}
//                   style={{
//                     height: "32px",
//                     padding: "0 12px",
//                     display: "flex",
//                     alignItems: "center",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: "8px",
//                     background: "#fff",
//                     color: "#475569",
//                     fontSize: "12px",
//                     fontWeight: 600,
//                     textDecoration: "none",
//                   }}
//                 >
//                   {event._count.registrations} Registrations
//                 </Link>
//                 <Link
//                   href={ROUTES.cmsEventEdit(event.id)}
//                   style={{
//                     height: "32px",
//                     padding: "0 12px",
//                     display: "flex",
//                     alignItems: "center",
//                     border: "1px solid #bfdbfe",
//                     borderRadius: "8px",
//                     background: "#eff6ff",
//                     color: "#1d4ed8",
//                     fontSize: "12px",
//                     fontWeight: 600,
//                     textDecoration: "none",
//                   }}
//                 >
//                   Edit
//                 </Link>
//               </div>
//             </div>
//           );
//         })}
//         {events.length === 0 && (
//           <div
//             style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}
//           >
//             No events found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import {
  EVENT_STATUS_CONFIG,
  EVENT_MODE_COLORS,
  formatEventDate,
  formatEventPrice,
} from "@/lib/event-utils";

export const metadata = { title: "Events — Admin" };

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { status, q } = await searchParams;
  const filter = status ?? "ALL";
  const query = q?.trim() ?? "";

  const where = {
    ...(filter !== "ALL" ? { status: filter as any } : {}),
    ...(query
      ? { title: { contains: query, mode: "insensitive" as const } }
      : {}),
  };

  const events = await db.event.findMany({
    where,
    orderBy: [{ status: "asc" }, { startDate: "asc" }],
    select: {
      id: true,
      title: true,
      status: true,
      mode: true,
      pricingType: true,
      price: true,
      startDate: true,
      capacity: true,
      registeredCount: true,
      isFeatured: true,
      coverImage: true,
      author: { select: { name: true, email: true } },
      _count: { select: { registrations: true } },
    },
  });

  const counts = await db.event.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const countMap = counts.reduce(
    (acc, c) => ({ ...acc, [c.status]: c._count._all }),
    {} as Record<string, number>,
  );
  const totalCount = Object.values(countMap).reduce((a, b) => a + b, 0);

  const tabs = [
    { key: "ALL", label: "All", count: totalCount },
    { key: "PUBLISHED", label: "Published", count: countMap.PUBLISHED ?? 0 },
    { key: "DRAFT", label: "Drafts", count: countMap.DRAFT ?? 0 },
    { key: "CANCELLED", label: "Cancelled", count: countMap.CANCELLED ?? 0 },
    { key: "ARCHIVED", label: "Archived", count: countMap.ARCHIVED ?? 0 },
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "1100px",
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
          Events
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Platform-wide overview of all events and their registrations
        </p>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1.25rem",
          background: "#f8fafc",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
        }}
      >
        {tabs.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <Link
              key={tab.key}
              href={`${ROUTES.adminEvents}?status=${tab.key}${query ? `&q=${query}` : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "9px",
                fontSize: "12.5px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#1d4ed8" : "#64748b",
                background: isActive ? "#fff" : "transparent",
                textDecoration: "none",
                border: isActive
                  ? "1px solid #bfdbfe"
                  : "1px solid transparent",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "20px",
                  background: isActive ? "#dbeafe" : "#e2e8f0",
                  color: isActive ? "#1d4ed8" : "#64748b",
                }}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <form method="GET" style={{ marginBottom: "1.25rem" }}>
        {filter !== "ALL" && (
          <input type="hidden" name="status" value={filter} />
        )}
        <input
          name="q"
          defaultValue={query}
          placeholder="Search events…"
          style={{
            height: "38px",
            padding: "0 14px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            width: "280px",
          }}
        />
      </form>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {events.map((event) => {
          const cfg = EVENT_STATUS_CONFIG[event.status];
          const modeCfg = EVENT_MODE_COLORS[event.mode];
          const isFull =
            event.capacity !== null && event.registeredCount >= event.capacity;

          return (
            <div
              key={event.id}
              style={{
                background: "#fff",
                border: "1px solid #e8edf2",
                borderRadius: "14px",
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
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
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: cfg.bg,
                      color: cfg.color,
                    }}
                  >
                    {cfg.label}
                  </span>
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: modeCfg.bg,
                      color: modeCfg.color,
                    }}
                  >
                    {event.mode === "ONLINE"
                      ? "Online"
                      : event.mode === "OFFLINE"
                        ? "In Person"
                        : "Hybrid"}
                  </span>
                  {event.isFeatured && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: "#fef9c3",
                        color: "#854d0e",
                      }}
                    >
                      ★ Featured
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: "0 0 4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {event.title}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    fontSize: "11.5px",
                    color: "#94a3b8",
                  }}
                >
                  <span>By {event.author.name ?? event.author.email}</span>
                  <span>· {formatEventDate(event.startDate)}</span>
                  <span>
                    · {formatEventPrice(event.pricingType, event.price)}
                  </span>
                  <span>
                    · {event.registeredCount}
                    {event.capacity ? `/${event.capacity}` : ""} registered
                    {isFull && " (Full)"}
                  </span>
                </div>
              </div>

              {/* ── Sirf View Registrations — Edit hata diya ── */}
              <Link
                href={ROUTES.adminEventRegistrations(event.id)}
                style={{
                  height: "34px",
                  padding: "0 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid #bfdbfe",
                  borderRadius: "9px",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  textDecoration: "none",
                  flexShrink: 0,
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
                {event._count.registrations} Registrations
              </Link>
            </div>
          );
        })}
        {events.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}
          >
            No events found.
          </div>
        )}
      </div>
    </div>
  );
}
