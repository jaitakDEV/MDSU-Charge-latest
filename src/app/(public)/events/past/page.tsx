// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import Link from "next/link";
// import { EventCard } from "@/features/public/components/EventCard";

// export const metadata = {
//   title: "Past Events — MDSSC",
//   description: "Browse past events at MDSU-CHARGE",
// };

// export default async function PastEventsPage() {
//   const events = await db.event.findMany({
//     where: {
//       status: "PUBLISHED",
//       // OR: [{ eventType: "PAST" }, { startDate: { lt: new Date() } }],
//       startDate: { lt: new Date() },
//     },
//     orderBy: { startDate: "desc" },
//     take: 24,
//     select: {
//       id: true,
//       title: true,
//       slug: true,
//       description: true,
//       coverImage: true,
//       mode: true,
//       startDate: true,
//       pricingType: true,
//       price: true,
//       capacity: true,
//       registeredCount: true,
//       isFeatured: true,
//       tags: true,
//     },
//   });

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, sans-serif",
//         minHeight: "100vh",
//         background: "#f8fafc",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "1180px",
//           margin: "0 auto",
//           padding: "2.5rem 1.5rem",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "flex-end",
//             justifyContent: "space-between",
//             marginBottom: "2rem",
//             flexWrap: "wrap",
//             gap: "12px",
//           }}
//         >
//           <div>
//             <p
//               style={{
//                 fontSize: "11px",
//                 fontWeight: 700,
//                 color: "#64748b",
//                 textTransform: "uppercase",
//                 letterSpacing: "0.1em",
//                 margin: "0 0 8px",
//               }}
//             >
//               Events Archive
//             </p>
//             <h1
//               style={{
//                 fontSize: "clamp(24px, 4vw, 34px)",
//                 fontWeight: 800,
//                 color: "#0f172a",
//                 margin: 0,
//                 letterSpacing: "-0.6px",
//               }}
//             >
//               Past Events
//             </h1>
//             <p
//               style={{ fontSize: "14px", color: "#64748b", margin: "8px 0 0" }}
//             >
//               A look back at our institution's activities
//             </p>
//           </div>
//           <Link
//             href={ROUTES.events}
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "6px",
//               height: "38px",
//               padding: "0 18px",
//               border: "1.5px solid #1d4ed8",
//               borderRadius: "10px",
//               background: "#fff",
//               color: "#1d4ed8",
//               fontSize: "13px",
//               fontWeight: 700,
//               textDecoration: "none",
//             }}
//           >
//             ← Upcoming Events
//           </Link>
//         </div>

//         {events.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "4rem",
//               background: "#fff",
//               borderRadius: "16px",
//               border: "1px solid #e8edf2",
//             }}
//           >
//             <p style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>
//               No past events yet
//             </p>
//           </div>
//         ) : (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//               gap: "20px",
//             }}
//           >
//             {events.map((event) => (
//               <EventCard key={event.id} event={event} isPast />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { EventCard } from "@/features/public/components/EventCard";

export const metadata = {
  title: "Past Events — MDSSC",
  description: "Browse past events at MDSU-CHARGE",
};

export default async function PastEventsPage() {
  const events = await db.event.findMany({
    where: {
      status: "PUBLISHED",
      // OR: [{ eventType: "PAST" }, { startDate: { lt: new Date() } }],
      startDate: { lt: new Date() },
    },
    orderBy: { startDate: "desc" },
    take: 24,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      mode: true,
      startDate: true,
      pricingType: true,
      price: true,
      capacity: true,
      registeredCount: true,
      isFeatured: true,
      tags: true,
    },
  });

  const earliestYear = events.length
    ? Math.min(...events.map((e) => e.startDate.getFullYear()))
    : null;

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #8a3d0e 0%, #d6641c 45%, #f57a22 80%, #ff9a56 100%)",
          padding: "2.5rem 1.5rem",
        }}
      >
        {/* decorative glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,122,34,0.35) 0%, rgba(245,122,34,0) 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: "1180px",
            margin: "0 auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ marginBottom: "10px" }}></div>
            <h1
              style={{
                fontSize: "clamp(24px, 4.2vw, 36px)",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 8px",
                letterSpacing: "-0.6px",
              }}
            >
              Past Events
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#f3dfcb",
                margin: 0,
                maxWidth: "480px",
                lineHeight: 1.6,
              }}
            >
              A look back at our institution&apos;s activities
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={ROUTES.events}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                height: "40px",
                padding: "0 18px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
                background: "#fff",
                color: "#c1570d",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Upcoming Events
            </Link>
          </div>
        </div>
      </section>

      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "1.75rem 1.5rem 4rem",
        }}
      >
        {events.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #e8edf2",
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 14px",
                borderRadius: "50%",
                background: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#0f172a",
                margin: "0 0 6px",
              }}
            >
              No past events yet
            </p>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
              Check back after our next event wraps up
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
