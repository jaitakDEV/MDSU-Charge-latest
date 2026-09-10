// import { auth } from "@/server/auth";
// import { notFound } from "next/navigation";
// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import Link from "next/link";
// import {
//   formatEventDateTime,
//   formatEventDuration,
//   formatEventPrice,
//   getCapacityPercent,
//   getRegistrationCTA,
//   EVENT_MODE_LABELS,
// } from "@/lib/event-utils";
// import { EventRegistrationClient } from "@/features/public/components/EventRegistrationClient";

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;
//   const event = await db.event.findUnique({
//     where: { slug, status: "PUBLISHED" },
//     select: {
//       title: true,
//       description: true,
//       metaTitle: true,
//       metaDescription: true,
//       coverImage: true,
//     },
//   });
//   if (!event) return { title: "Event Not Found" };
//   return {
//     title: event.metaTitle ?? `${event.title} — MDSSC`,
//     description: event.metaDescription ?? event.description ?? "",
//     openGraph: { images: event.coverImage ? [event.coverImage] : [] },
//   };
// }

// export default async function EventDetailPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const session = await auth();
//   const { slug } = await params;

//   const event = await db.event.findUnique({
//     where: { slug, status: "PUBLISHED" },
//     select: {
//       id: true,
//       title: true,
//       description: true,
//       content: true,
//       coverImage: true,
//       eventType: true,
//       mode: true,
//       status: true,
//       slug: true,
//       venue: true,
//       startDate: true,
//       endDate: true,
//       timezone: true,
//       capacity: true,
//       registeredCount: true,
//       waitlistEnabled: true,
//       pricingType: true,
//       price: true,
//       refundPolicy: true,
//       cancellationDeadline: true,
//       tags: true,
//       // joinLink is NEVER selected here — only exposed after confirmed registration
//     },
//   });

//   if (!event) notFound();

//   // Check registration status for this user
//   let isRegistered = false;
//   let isWaitlisted = false;
//   let joinLink: string | null = null;

//   if (session?.user) {
//     const registration = await db.eventRegistration.findUnique({
//       where: { eventId_userId: { eventId: event.id, userId: session.user.id } },
//       select: { status: true },
//     });
//     isRegistered = registration?.status === "CONFIRMED";

//     if (isRegistered) {
//       const fullEvent = await db.event.findUnique({
//         where: { id: event.id },
//         select: { joinLink: true },
//       });
//       joinLink = fullEvent?.joinLink ?? null;
//     }

//     const waitlistEntry = await db.eventWaitlist.findUnique({
//       where: { eventId_userId: { eventId: event.id, userId: session.user.id } },
//       select: { id: true },
//     });
//     isWaitlisted = !!waitlistEntry;
//   }

//   const cta = getRegistrationCTA({
//     event: {
//       startDate: event.startDate,
//       endDate: event.endDate,
//       capacity: event.capacity,
//       registeredCount: event.registeredCount,
//       waitlistEnabled: event.waitlistEnabled,
//       waitlistCount: 0,
//       status: event.status,
//       pricingType: event.pricingType,
//       price: event.price,
//     },
//     isRegistered,
//     isWaitlisted,
//   });

//   const capacityPct = getCapacityPercent(event.capacity, event.registeredCount);

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, sans-serif",
//         minHeight: "100vh",
//         background: "#f8fafc",
//       }}
//     >
//       {/* Hero */}
//       <div
//         style={{
//           background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
//           color: "#fff",
//           padding: "2.5rem 1.5rem",
//         }}
//       >
//         <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//               marginBottom: "1rem",
//               fontSize: "12.5px",
//             }}
//           >
//             <Link
//               href={ROUTES.events}
//               style={{ color: "#94a3b8", textDecoration: "none" }}
//             >
//               Events
//             </Link>
//             <span style={{ color: "#475569" }}>/</span>
//             <span style={{ color: "#cbd5e1" }}>{event.title}</span>
//           </div>

//           <h1
//             style={{
//               fontSize: "clamp(22px, 4vw, 32px)",
//               fontWeight: 800,
//               color: "#fff",
//               margin: "0 0 12px",
//               lineHeight: 1.25,
//               letterSpacing: "-0.6px",
//             }}
//           >
//             {event.title}
//           </h1>

//           <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//             <span
//               style={{
//                 fontSize: "11.5px",
//                 fontWeight: 600,
//                 padding: "3px 10px",
//                 borderRadius: "20px",
//                 background: "rgba(255,255,255,0.1)",
//                 color: "#cbd5e1",
//                 border: "1px solid rgba(255,255,255,0.15)",
//               }}
//             >
//               {EVENT_MODE_LABELS[event.mode]}
//             </span>
//             <span
//               style={{
//                 fontSize: "11.5px",
//                 fontWeight: 700,
//                 padding: "3px 10px",
//                 borderRadius: "20px",
//                 background:
//                   event.pricingType === "FREE"
//                     ? "#16a34a"
//                     : "rgba(255,255,255,0.1)",
//                 color: "#fff",
//               }}
//             >
//               {formatEventPrice(event.pricingType, event.price)}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div
//         style={{
//           maxWidth: "1100px",
//           margin: "0 auto",
//           padding: "2rem 1.5rem",
//           display: "flex",
//           gap: "2rem",
//           alignItems: "flex-start",
//           flexWrap: "wrap",
//         }}
//       >
//         {/* Left column */}
//         <div style={{ flex: 1, minWidth: "280px" }}>
//           {event.coverImage && (
//             <div
//               style={{
//                 borderRadius: "16px",
//                 overflow: "hidden",
//                 marginBottom: "1.5rem",
//                 aspectRatio: "16/8",
//               }}
//             >
//               <img
//                 src={event.coverImage}
//                 alt={event.title}
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             </div>
//           )}

//           {event.description && (
//             <div
//               style={{
//                 background: "#fff",
//                 border: "1px solid #e8edf2",
//                 borderRadius: "16px",
//                 padding: "1.25rem",
//                 marginBottom: "1.25rem",
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: "14px",
//                   color: "#334155",
//                   margin: 0,
//                   lineHeight: 1.7,
//                 }}
//               >
//                 {event.description}
//               </p>
//             </div>
//           )}

//           {event.content && (
//             <div
//               style={{
//                 background: "#fff",
//                 border: "1px solid #e8edf2",
//                 borderRadius: "16px",
//                 padding: "1.25rem",
//                 marginBottom: "1.25rem",
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: 700,
//                   color: "#0f172a",
//                   margin: "0 0 12px",
//                 }}
//               >
//                 Event Details
//               </p>
//               <div
//                 style={{
//                   fontSize: "13.5px",
//                   color: "#475569",
//                   lineHeight: 1.75,
//                 }}
//                 dangerouslySetInnerHTML={{ __html: event.content }}
//               />
//             </div>
//           )}

//           {event.tags?.length > 0 && (
//             <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
//               {event.tags.map((t) => (
//                 <span
//                   key={t}
//                   style={{
//                     fontSize: "11px",
//                     fontWeight: 600,
//                     padding: "3px 10px",
//                     borderRadius: "20px",
//                     background: "#eff6ff",
//                     color: "#1d4ed8",
//                     border: "1px solid #bfdbfe",
//                   }}
//                 >
//                   #{t}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Right — Registration card */}
//         <div style={{ width: "320px", flexShrink: 0 }}>
//           <div
//             style={{
//               background: "#fff",
//               border: "1px solid #e8edf2",
//               borderRadius: "18px",
//               padding: "1.5rem",
//               position: "sticky",
//               top: "80px",
//               boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//             }}
//           >
//             {/* Date/time */}
//             <div style={{ marginBottom: "1.25rem" }}>
//               <p
//                 style={{
//                   fontSize: "11px",
//                   fontWeight: 700,
//                   color: "#94a3b8",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.07em",
//                   margin: "0 0 6px",
//                 }}
//               >
//                 Date & Time
//               </p>
//               <p
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: 700,
//                   color: "#0f172a",
//                   margin: "0 0 3px",
//                 }}
//               >
//                 {formatEventDateTime(event.startDate, event.timezone)}
//               </p>
//               {formatEventDuration(event.startDate, event.endDate) && (
//                 <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: 0 }}>
//                   Duration:{" "}
//                   {formatEventDuration(event.startDate, event.endDate)}
//                 </p>
//               )}
//             </div>

//             {/* Location */}
//             <div style={{ marginBottom: "1.25rem" }}>
//               <p
//                 style={{
//                   fontSize: "11px",
//                   fontWeight: 700,
//                   color: "#94a3b8",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.07em",
//                   margin: "0 0 6px",
//                 }}
//               >
//                 Location
//               </p>
//               {event.mode === "OFFLINE" && (
//                 <p style={{ fontSize: "13.5px", color: "#334155", margin: 0 }}>
//                   {event.venue ?? "Venue TBD"}
//                 </p>
//               )}
//               {event.mode === "ONLINE" &&
//                 (joinLink ? (
//                   <a
//                     href={joinLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{
//                       fontSize: "13.5px",
//                       color: "#1d4ed8",
//                       fontWeight: 600,
//                     }}
//                   >
//                     Join Meeting →
//                   </a>
//                 ) : (
//                   <p
//                     style={{ fontSize: "13.5px", color: "#94a3b8", margin: 0 }}
//                   >
//                     Online — link shared after registration
//                   </p>
//                 ))}
//               {event.mode === "HYBRID" && (
//                 <>
//                   <p
//                     style={{
//                       fontSize: "13.5px",
//                       color: "#334155",
//                       margin: "0 0 4px",
//                     }}
//                   >
//                     {event.venue ?? "Venue TBD"}
//                   </p>
//                   {joinLink && (
//                     <a
//                       href={joinLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       style={{
//                         fontSize: "12.5px",
//                         color: "#1d4ed8",
//                         fontWeight: 600,
//                       }}
//                     >
//                       + Join Online →
//                     </a>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Capacity */}
//             {event.capacity !== null && (
//               <div style={{ marginBottom: "1.25rem" }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     fontSize: "12px",
//                     color: "#64748b",
//                     marginBottom: "4px",
//                   }}
//                 >
//                   <span>Spots filled</span>
//                   <span style={{ fontWeight: 700, color: "#0f172a" }}>
//                     {event.registeredCount}/{event.capacity}
//                   </span>
//                 </div>
//                 <div
//                   style={{
//                     height: "6px",
//                     background: "#f1f5f9",
//                     borderRadius: "99px",
//                     overflow: "hidden",
//                   }}
//                 >
//                   <div
//                     style={{
//                       height: "6px",
//                       borderRadius: "99px",
//                       background: capacityPct >= 100 ? "#ef4444" : "#1d4ed8",
//                       width: `${capacityPct}%`,
//                     }}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Registration CTA */}
//             <EventRegistrationClient
//               eventId={event.id}
//               eventSlug={event.slug}
//               cta={cta}
//               pricingType={event.pricingType}
//               price={event.price}
//               isLoggedIn={!!session?.user}
//               userName={session?.user?.name ?? ""}
//               userEmail={session?.user?.email ?? ""}
//               userId={session?.user?.id ?? ""}
//             />

//             {/* Refund policy */}
//             {event.refundPolicy && (
//               <div
//                 style={{
//                   marginTop: "1rem",
//                   padding: "10px 12px",
//                   background: "#fffbeb",
//                   border: "1px solid #fde68a",
//                   borderRadius: "10px",
//                 }}
//               >
//                 <p
//                   style={{
//                     fontSize: "11px",
//                     fontWeight: 700,
//                     color: "#92400e",
//                     margin: "0 0 4px",
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Refund Policy
//                 </p>
//                 <p
//                   style={{
//                     fontSize: "12px",
//                     color: "#b45309",
//                     margin: 0,
//                     lineHeight: 1.5,
//                   }}
//                 >
//                   {event.refundPolicy}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { auth } from "@/server/auth";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import {
  formatEventDateTime,
  formatEventDuration,
  formatEventPrice,
  getCapacityPercent,
  getRegistrationCTA,
  EVENT_MODE_LABELS,
} from "@/lib/event-utils";
import { EventRegistrationClient } from "@/features/public/components/EventRegistrationClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await db.event.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      description: true,
      metaTitle: true,
      metaDescription: true,
      coverImage: true,
    },
  });
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.metaTitle ?? `${event.title} — MDSSC`,
    description: event.metaDescription ?? event.description ?? "",
    openGraph: { images: event.coverImage ? [event.coverImage] : [] },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  const { slug } = await params;

  const event = await db.event.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      coverImage: true,
      eventType: true,
      mode: true,
      status: true,
      slug: true,
      venue: true,
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
      // joinLink is NEVER selected here — only exposed after confirmed registration
    },
  });

  if (!event) notFound();

  // Check registration status for this user
  let isRegistered = false;
  let isWaitlisted = false;
  let joinLink: string | null = null;

  if (session?.user) {
    const registration = await db.eventRegistration.findUnique({
      where: { eventId_userId: { eventId: event.id, userId: session.user.id } },
      select: { status: true },
    });
    isRegistered = registration?.status === "CONFIRMED";

    if (isRegistered) {
      const fullEvent = await db.event.findUnique({
        where: { id: event.id },
        select: { joinLink: true },
      });
      joinLink = fullEvent?.joinLink ?? null;
    }

    const waitlistEntry = await db.eventWaitlist.findUnique({
      where: { eventId_userId: { eventId: event.id, userId: session.user.id } },
      select: { id: true },
    });
    isWaitlisted = !!waitlistEntry;
  }

  const cta = getRegistrationCTA({
    event: {
      startDate: event.startDate,
      endDate: event.endDate,
      capacity: event.capacity,
      registeredCount: event.registeredCount,
      waitlistEnabled: event.waitlistEnabled,
      waitlistCount: 0,
      status: event.status,
      pricingType: event.pricingType,
      price: event.price,
    },
    isRegistered,
    isWaitlisted,
  });

  const capacityPct = getCapacityPercent(event.capacity, event.registeredCount);

  const BRAND = "#f57a22";
  const BRAND_DARK = "#c9591a";

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <style>{`
        .mdssc-event-main {
          box-sizing: border-box;
        }
        .mdssc-event-main * {
          box-sizing: border-box;
        }
        .mdssc-event-sidebar {
          width: 320px;
        }
        @media (max-width: 860px) {
          .mdssc-event-main {
            flex-direction: column !important;
          }
          .mdssc-event-sidebar {
            width: 100% !important;
            flex-shrink: 1 !important;
          }
          .mdssc-event-sidebar-inner {
            position: static !important;
            top: auto !important;
          }
        }
        @media (max-width: 480px) {
          .mdssc-hero-inner h1 {
            font-size: 22px !important;
          }
          .mdssc-hero-badges {
            flex-wrap: wrap !important;
          }
        }
      `}</style>

      <div
        style={{
          background:
            "linear-gradient(135deg, #8a3d0e 0%, #d6641c 45%, #f57a22 80%, #ff9a56 100%)",
          color: "#fff",
          padding: "4rem 1.5rem 2.5rem",
        }}
      >
        <div
          className="mdssc-hero-inner"
          style={{ maxWidth: "1100px", margin: "0 auto" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "1rem",
              fontSize: "12.5px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={ROUTES.events}
              style={{
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
              }}
            >
              Events
            </Link>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>/</span>
            <span style={{ color: "#fff", fontWeight: 600 }}>
              {event.title}
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: 800,
              color: "#fff",
              margin: "0 0 12px",
              lineHeight: 1.25,
              letterSpacing: "-0.6px",
              textShadow: "0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            {event.title}
          </h1>

          <div
            className="mdssc-hero-badges"
            style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
          >
            <span
              style={{
                fontSize: "11.5px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "20px",
                background: "rgba(15,23,42,0.25)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              {EVENT_MODE_LABELS[event.mode]}
            </span>
            <span
              style={{
                fontSize: "11.5px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "20px",
                background:
                  event.pricingType === "FREE"
                    ? "#16a34a"
                    : "rgba(15,23,42,0.3)",
                color: "#fff",
                border:
                  event.pricingType === "FREE"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.35)",
              }}
            >
              {formatEventPrice(event.pricingType, event.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className="mdssc-event-main"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Left column */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          {event.coverImage && (
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "1.5rem",
                aspectRatio: "16/8",
              }}
            >
              <img
                src={event.coverImage}
                alt={event.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          {event.description && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e8edf2",
                borderRadius: "16px",
                padding: "1.25rem",
                marginBottom: "1.25rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#334155",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {event.description}
              </p>
            </div>
          )}

          {event.content && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e8edf2",
                borderRadius: "16px",
                padding: "1.25rem",
                marginBottom: "1.25rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "4px",
                    height: "14px",
                    borderRadius: "3px",
                    background: `linear-gradient(180deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                    display: "inline-block",
                  }}
                />
                Event Details
              </p>
              <div
                style={{
                  fontSize: "13.5px",
                  color: "#475569",
                  lineHeight: 1.75,
                }}
                dangerouslySetInnerHTML={{ __html: event.content }}
              />
            </div>
          )}

          {event.tags?.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {event.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: `${BRAND}15`,
                    color: BRAND_DARK,
                    border: `1px solid ${BRAND}45`,
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right — Registration card */}
        <div className="mdssc-event-sidebar" style={{ flexShrink: 0 }}>
          <div
            className="mdssc-event-sidebar-inner"
            style={{
              background: "#fff",
              border: "1px solid #e8edf2",
              borderRadius: "18px",
              padding: "1.5rem",
              position: "sticky",
              top: "80px",
              boxShadow: "0 8px 28px rgba(245,122,34,0.14)",
              borderTop: `3px solid ${BRAND}`,
            }}
          >
            {/* Date/time */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: "0 0 6px",
                }}
              >
                Date & Time
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 3px",
                }}
              >
                {formatEventDateTime(event.startDate, event.timezone)}
              </p>
              {formatEventDuration(event.startDate, event.endDate) && (
                <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: 0 }}>
                  Duration:{" "}
                  {formatEventDuration(event.startDate, event.endDate)}
                </p>
              )}
            </div>

            {/* Location */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: "0 0 6px",
                }}
              >
                Location
              </p>
              {event.mode === "OFFLINE" && (
                <p style={{ fontSize: "13.5px", color: "#334155", margin: 0 }}>
                  {event.venue ?? "Venue TBD"}
                </p>
              )}
              {event.mode === "ONLINE" &&
                (joinLink ? (
                  <a
                    href={joinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "13.5px",
                      color: BRAND_DARK,
                      fontWeight: 600,
                    }}
                  >
                    Join Meeting →
                  </a>
                ) : (
                  <p
                    style={{ fontSize: "13.5px", color: "#94a3b8", margin: 0 }}
                  >
                    Online — link shared after registration
                  </p>
                ))}
              {event.mode === "HYBRID" && (
                <>
                  <p
                    style={{
                      fontSize: "13.5px",
                      color: "#334155",
                      margin: "0 0 4px",
                    }}
                  >
                    {event.venue ?? "Venue TBD"}
                  </p>
                  {joinLink && (
                    <a
                      href={joinLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "12.5px",
                        color: BRAND_DARK,
                        fontWeight: 600,
                      }}
                    >
                      + Join Online →
                    </a>
                  )}
                </>
              )}
            </div>

            {/* Capacity */}
            {event.capacity !== null && (
              <div style={{ marginBottom: "1.25rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  <span>Spots filled</span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>
                    {event.registeredCount}/{event.capacity}
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "#f1f5f9",
                    borderRadius: "99px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "6px",
                      borderRadius: "99px",
                      background:
                        capacityPct >= 100
                          ? "#ef4444"
                          : `linear-gradient(90deg, ${BRAND_DARK} 0%, ${BRAND} 100%)`,
                      width: `${capacityPct}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Registration CTA */}
            <EventRegistrationClient
              eventId={event.id}
              eventSlug={event.slug}
              cta={cta}
              pricingType={event.pricingType}
              price={event.price}
              isLoggedIn={!!session?.user}
              userName={session?.user?.name ?? ""}
              userEmail={session?.user?.email ?? ""}
              userId={session?.user?.id ?? ""}
            />

            {/* Refund policy */}
            {event.refundPolicy && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "10px 12px",
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "10px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#92400e",
                    margin: "0 0 4px",
                    textTransform: "uppercase",
                  }}
                >
                  Refund Policy
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#b45309",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {event.refundPolicy}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
