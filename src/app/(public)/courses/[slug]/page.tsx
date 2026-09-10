// import { auth } from "@/server/auth";
// import { notFound } from "next/navigation";
// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import Link from "next/link";
// import { AccessDurationBadge } from "@/features/courses/components/access-duration-badge";
// import { EnrolButton } from "@/features/courses/components/enrol-button";
// import { getCheckoutExpiryPreview } from "@/lib/access-utils";
// import type { AccessDuration } from "@prisma/client";

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await params;
//   const course = await db.course.findUnique({
//     where: { slug, status: "PUBLISHED" },
//     select: { title: true, description: true, thumbnail: true },
//   });
//   if (!course) return { title: "Course not found" };
//   return {
//     title: `${course.title} — MDSSU Charge`,
//     description: course.description ?? "",
//     openGraph: {
//       title: course.title,
//       description: course.description ?? "",
//       images: course.thumbnail ? [course.thumbnail] : [],
//     },
//   };
// }

// export default async function CourseDetailPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   const session = await auth();
//   const { slug } = await params;

//   const course = await db.course.findUnique({
//     where: { slug, status: "PUBLISHED" },
//     select: {
//       id: true,
//       title: true,
//       slug: true,
//       description: true,
//       about: true,
//       thumbnail: true,
//       previewVideoUrl: true,
//       price: true,
//       mrp: true,
//       accessDuration: true,
//       level: true,
//       language: true,
//       totalLectures: true,
//       totalDuration: true,
//       isFeatured: true,
//       author: { select: { name: true } },
//       category: { select: { name: true, slug: true } },
//       sections: {
//         orderBy: { displayOrder: "asc" },
//         select: {
//           id: true,
//           title: true,
//           lectures: {
//             where: { isPublished: true },
//             orderBy: { displayOrder: "asc" },
//             select: {
//               id: true,
//               title: true,
//               type: true,
//               duration: true,
//               isPreview: true,
//             },
//           },
//         },
//       },
//       faqs: {
//         orderBy: { displayOrder: "asc" },
//         select: { id: true, question: true, answer: true },
//       },
//     },
//   });

//   if (!course) notFound();

//   let isEnrolled = false;
//   if (session?.user?.role === "STUDENT") {
//     const enrolment = await db.enrolment.findUnique({
//       where: {
//         userId_courseId: { userId: session.user.id, courseId: course.id },
//       },
//       select: { id: true },
//     });
//     isEnrolled = !!enrolment;
//   }

//   const previewLectures = course.sections.flatMap((s) =>
//     s.lectures.filter((l) => l.isPreview),
//   );
//   const discountPct =
//     course.mrp > course.price
//       ? Math.round(((course.mrp - course.price) / course.mrp) * 100)
//       : 0;
//   const expiryPreview = getCheckoutExpiryPreview(
//     course.accessDuration as AccessDuration,
//   );
//   const totalPublishedLectures = course.sections.reduce(
//     (a, s) => a + s.lectures.length,
//     0,
//   );

//   const LEVEL_LABELS: Record<string, string> = {
//     BEGINNER: "Beginner",
//     INTERMEDIATE: "Intermediate",
//     ADVANCED: "Advanced",
//   };

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
//           background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
//           color: "#fff",
//           padding: "3.8rem 1.5rem",
//         }}
//       >
//         <div
//           style={{
//             maxWidth: "1100px",
//             margin: "0 auto",
//             display: "flex",
//             gap: "2.5rem",
//             alignItems: "flex-start",
//           }}
//         >
//           {/* Left — course info */}
//           <div style={{ flex: 1 }}>
//             {/* Breadcrumb */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 marginBottom: "1rem",
//                 fontSize: "12.5px",
//               }}
//             >
//               <Link
//                 href={ROUTES.courses}
//                 style={{ color: "#94a3b8", textDecoration: "none" }}
//               >
//                 Courses
//               </Link>
//               <span style={{ color: "#475569" }}>/</span>
//               {course.category && (
//                 <>
//                   <Link
//                     href={`/categories/${course.category.slug}`}
//                     style={{ color: "#94a3b8", textDecoration: "none" }}
//                   >
//                     {course.category.name}
//                   </Link>
//                   <span style={{ color: "#475569" }}>/</span>
//                 </>
//               )}
//               <span style={{ color: "#cbd5e1" }}>{course.title}</span>
//             </div>

//             <h1
//               style={{
//                 fontSize: "clamp(22px, 4vw, 32px)",
//                 fontWeight: 800,
//                 color: "#fff",
//                 margin: "0 0 12px",
//                 lineHeight: 1.25,
//                 letterSpacing: "-0.6px",
//               }}
//             >
//               {course.title}
//             </h1>

//             {course.description && (
//               <p
//                 style={{
//                   fontSize: "15px",
//                   color: "#94a3b8",
//                   margin: "0 0 16px",
//                   lineHeight: 1.6,
//                 }}
//               >
//                 {course.description}
//               </p>
//             )}

//             {/* Meta badges */}
//             <div
//               style={{
//                 display: "flex",
//                 gap: "8px",
//                 flexWrap: "wrap",
//                 marginBottom: "12px",
//               }}
//             >
//               <AccessDurationBadge
//                 duration={course.accessDuration as AccessDuration}
//                 variant="full"
//               />
//               <span
//                 style={{
//                   fontSize: "11.5px",
//                   fontWeight: 600,
//                   padding: "3px 10px",
//                   borderRadius: "20px",
//                   background: "rgba(255,255,255,0.1)",
//                   color: "#cbd5e1",
//                   border: "1px solid rgba(255,255,255,0.15)",
//                 }}
//               >
//                 {LEVEL_LABELS[course.level] ?? course.level}
//               </span>
//               <span
//                 style={{
//                   fontSize: "11.5px",
//                   fontWeight: 600,
//                   padding: "3px 10px",
//                   borderRadius: "20px",
//                   background: "rgba(255,255,255,0.1)",
//                   color: "#cbd5e1",
//                   border: "1px solid rgba(255,255,255,0.15)",
//                 }}
//               >
//                 {course.language}
//               </span>
//             </div>

//             {/* Stats */}
//             <div
//               style={{
//                 display: "flex",
//                 gap: "16px",
//                 fontSize: "12.5px",
//                 color: "#94a3b8",
//               }}
//             >
//               <span>{totalPublishedLectures} lectures</span>
//               {course.totalDuration > 0 && (
//                 <span>· {course.totalDuration} min</span>
//               )}
//               {course.author.name && <span>· By {course.author.name}</span>}
//             </div>
//           </div>

//           {/* Right — Pricing card (desktop) */}
//           <div
//             style={{ width: "320px", flexShrink: 0, display: "none" }}
//             className="pricing-card-desktop"
//           />
//         </div>
//       </div>

//       {/* ── Main Content ── */}
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
//           {/* Preview video */}
//           {course.previewVideoUrl && (
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
//                   fontSize: "13px",
//                   fontWeight: 700,
//                   color: "#0f172a",
//                   margin: "0 0 10px",
//                 }}
//               >
//                 Course Preview
//               </p>
//               <video
//                 src={course.previewVideoUrl}
//                 controls
//                 style={{
//                   width: "100%",
//                   borderRadius: "10px",
//                   background: "#000",
//                 }}
//               />
//             </div>
//           )}

//           {/* About */}
//           {course.about && (
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
//                   margin: "0 0 10px",
//                 }}
//               >
//                 About this course
//               </p>
//               <p
//                 style={{
//                   fontSize: "13.5px",
//                   color: "#475569",
//                   margin: 0,
//                   lineHeight: 1.75,
//                 }}
//               >
//                 {course.about}
//               </p>
//             </div>
//           )}

//           {/* Curriculum */}
//           <div
//             style={{
//               background: "#fff",
//               border: "1px solid #e8edf2",
//               borderRadius: "16px",
//               padding: "1.25rem",
//               marginBottom: "1.25rem",
//             }}
//           >
//             <p
//               style={{
//                 fontSize: "14px",
//                 fontWeight: 700,
//                 color: "#0f172a",
//                 margin: "0 0 4px",
//               }}
//             >
//               Curriculum
//             </p>
//             <p
//               style={{
//                 fontSize: "12.5px",
//                 color: "#94a3b8",
//                 margin: "0 0 14px",
//               }}
//             >
//               {totalPublishedLectures} lectures ·{" "}
//               {course.totalDuration > 0
//                 ? `${course.totalDuration} min`
//                 : "Self-paced"}
//             </p>

//             {course.sections.map((section) => (
//               <CurriculumSection
//                 key={section.id}
//                 section={section}
//                 isEnrolled={isEnrolled}
//               />
//             ))}
//           </div>

//           {/* FAQs */}
//           {course.faqs.length > 0 && (
//             <div
//               style={{
//                 background: "#fff",
//                 border: "1px solid #e8edf2",
//                 borderRadius: "16px",
//                 padding: "1.25rem",
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: 700,
//                   color: "#0f172a",
//                   margin: "0 0 14px",
//                 }}
//               >
//                 FAQs
//               </p>
//               {course.faqs.map((faq) => (
//                 <div
//                   key={faq.id}
//                   style={{
//                     borderBottom: "1px solid #f1f5f9",
//                     paddingBottom: "12px",
//                     marginBottom: "12px",
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontSize: "13.5px",
//                       fontWeight: 600,
//                       color: "#0f172a",
//                       margin: "0 0 4px",
//                     }}
//                   >
//                     {faq.question}
//                   </p>
//                   <p
//                     style={{
//                       fontSize: "13px",
//                       color: "#64748b",
//                       margin: 0,
//                       lineHeight: 1.6,
//                     }}
//                   >
//                     {faq.answer}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ── Pricing Card (sticky) ── */}
//         <div style={{ width: "300px", flexShrink: 0 }}>
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
//             {/* Thumbnail */}
//             {course.thumbnail && (
//               <img
//                 src={course.thumbnail}
//                 alt={course.title}
//                 style={{
//                   width: "100%",
//                   aspectRatio: "16/9",
//                   objectFit: "cover",
//                   borderRadius: "12px",
//                   marginBottom: "1.25rem",
//                 }}
//               />
//             )}

//             {/* Price */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "baseline",
//                 gap: "10px",
//                 marginBottom: "6px",
//               }}
//             >
//               <span
//                 style={{
//                   fontSize: "28px",
//                   fontWeight: 800,
//                   color: course.price === 0 ? "#16a34a" : "#0f172a",
//                   letterSpacing: "-0.5px",
//                 }}
//               >
//                 {course.price === 0
//                   ? "Free"
//                   : `₹${(course.price / 100).toLocaleString("en-IN")}`}
//               </span>
//               {course.mrp > course.price && (
//                 <span
//                   style={{
//                     fontSize: "16px",
//                     color: "#94a3b8",
//                     textDecoration: "line-through",
//                   }}
//                 >
//                   ₹{(course.mrp / 100).toLocaleString("en-IN")}
//                 </span>
//               )}
//               {discountPct > 0 && (
//                 <span
//                   style={{
//                     fontSize: "12px",
//                     fontWeight: 700,
//                     padding: "2px 8px",
//                     borderRadius: "20px",
//                     background: "#dcfce7",
//                     color: "#166534",
//                   }}
//                 >
//                   {discountPct}% OFF
//                 </span>
//               )}
//             </div>

//             {/* Access duration info */}
//             <div
//               style={{
//                 padding: "10px 12px",
//                 background:
//                   course.accessDuration === "LIFETIME" ? "#fffbeb" : "#f0fdf4",
//                 border: `1px solid ${course.accessDuration === "LIFETIME" ? "#fde68a" : "#bbf7d0"}`,
//                 borderRadius: "10px",
//                 marginBottom: "14px",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <span style={{ fontSize: "12px", color: "#64748b" }}>
//                   Access duration
//                 </span>
//                 <AccessDurationBadge
//                   duration={course.accessDuration as AccessDuration}
//                   variant="card"
//                 />
//               </div>
//               <p
//                 style={{
//                   fontSize: "11.5px",
//                   color: "#64748b",
//                   margin: "6px 0 0",
//                 }}
//               >
//                 {course.accessDuration === "LIFETIME"
//                   ? "Lifetime access — no expiry ever"
//                   : `If enrolled today, access until ${expiryPreview}`}
//               </p>
//             </div>

//             {/* CTA Button */}
//             {isEnrolled ? (
//               <Link
//                 href={ROUTES.coursePlayer(course.slug)}
//                 style={{
//                   display: "block",
//                   width: "100%",
//                   height: "46px",
//                   lineHeight: "46px",
//                   textAlign: "center",
//                   borderRadius: "12px",
//                   background:
//                     "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
//                   color: "#fff",
//                   fontWeight: 700,
//                   fontSize: "14px",
//                   textDecoration: "none",
//                   marginBottom: "10px",
//                 }}
//               >
//                 Continue Learning →
//               </Link>
//             ) : (
//               <EnrolButton
//                 courseId={course.id}
//                 courseSlug={course.slug}
//                 isLoggedIn={!!session?.user}
//                 isFree={course.price === 0}
//               />
//             )}

//             {/* What you get */}
//             <div
//               style={{
//                 marginTop: "14px",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "8px",
//               }}
//             >
//               {[
//                 { icon: "📚", text: `${totalPublishedLectures} lectures` },
//                 {
//                   icon: "🕐",
//                   text:
//                     course.totalDuration > 0
//                       ? `${course.totalDuration} min content`
//                       : "Self-paced",
//                 },
//                 { icon: "📱", text: "Access on all devices" },
//                 { icon: "📜", text: "Certificate on completion" },
//                 {
//                   icon: "⏰",
//                   text:
//                     course.accessDuration === "LIFETIME"
//                       ? "Lifetime access"
//                       : `${ACCESS_DURATION_LABELS_FULL[course.accessDuration as AccessDuration]} access`,
//                 },
//               ].map(({ icon, text }) => (
//                 <div
//                   key={text}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                     fontSize: "12.5px",
//                     color: "#475569",
//                   }}
//                 >
//                   <span>{icon}</span>
//                   <span>{text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const ACCESS_DURATION_LABELS_FULL: Record<string, string> = {
//   FIFTEEN_DAYS: "15-day",
//   ONE_MONTH: "1-month",
//   THREE_MONTHS: "3-month",
//   SIX_MONTHS: "6-month",
//   ONE_YEAR: "1-year",
// };

// // ── Curriculum Section Component ──────────────────────────────
// function CurriculumSection({
//   section,
//   isEnrolled,
// }: {
//   section: {
//     id: string;
//     title: string;
//     lectures: {
//       id: string;
//       title: string;
//       type: string;
//       duration: number;
//       isPreview: boolean;
//     }[];
//   };
//   isEnrolled: boolean;
// }) {
//   const TYPE_ICONS: Record<string, string> = {
//     VIDEO: "▶",
//     DOCUMENT: "📄",
//     TEXT: "📝",
//   };

//   return (
//     <div
//       style={{
//         marginBottom: "12px",
//         border: "1px solid #f1f5f9",
//         borderRadius: "12px",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         style={{
//           padding: "10px 14px",
//           background: "#f8fafc",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <p
//           style={{
//             fontSize: "13px",
//             fontWeight: 600,
//             color: "#0f172a",
//             margin: 0,
//           }}
//         >
//           {section.title}
//         </p>
//         <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
//           {section.lectures.length} lectures
//         </span>
//       </div>
//       {section.lectures.map((lecture) => {
//         const canView = lecture.isPreview || isEnrolled;
//         return (
//           <div
//             key={lecture.id}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               padding: "9px 14px",
//               borderTop: "1px solid #f8fafc",
//             }}
//           >
//             <span style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0 }}>
//               {TYPE_ICONS[lecture.type] ?? "▶"}
//             </span>
//             <span
//               style={{
//                 flex: 1,
//                 fontSize: "12.5px",
//                 color: canView ? "#334155" : "#94a3b8",
//               }}
//             >
//               {lecture.title}
//             </span>
//             {lecture.isPreview && (
//               <span
//                 style={{
//                   fontSize: "10px",
//                   fontWeight: 700,
//                   padding: "1px 6px",
//                   borderRadius: "6px",
//                   background: "#f0fdf4",
//                   color: "#16a34a",
//                   border: "1px solid #bbf7d0",
//                   flexShrink: 0,
//                 }}
//               >
//                 Free
//               </span>
//             )}
//             {!canView && (
//               <span
//                 style={{ fontSize: "11px", color: "#cbd5e1", flexShrink: 0 }}
//               >
//                 🔒
//               </span>
//             )}
//             {lecture.duration > 0 && (
//               <span
//                 style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0 }}
//               >
//                 {lecture.duration}m
//               </span>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

import { auth } from "@/server/auth";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { AccessDurationBadge } from "@/features/courses/components/access-duration-badge";
import { EnrolButton } from "@/features/courses/components/enrol-button";
import { getCheckoutExpiryPreview } from "@/lib/access-utils";
import type { AccessDuration } from "@prisma/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await db.course.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, description: true, thumbnail: true },
  });
  if (!course) return { title: "Course not found" };
  return {
    title: `${course.title} — MDSSU Charge`,
    description: course.description ?? "",
    openGraph: {
      title: course.title,
      description: course.description ?? "",
      images: course.thumbnail ? [course.thumbnail] : [],
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  const { slug } = await params;

  const course = await db.course.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      about: true,
      thumbnail: true,
      previewVideoUrl: true,
      price: true,
      mrp: true,
      accessDuration: true,
      level: true,
      language: true,
      totalLectures: true,
      totalDuration: true,
      isFeatured: true,
      author: { select: { name: true } },
      category: { select: { name: true, slug: true } },
      sections: {
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          title: true,
          lectures: {
            where: { isPublished: true },
            orderBy: { displayOrder: "asc" },
            select: {
              id: true,
              title: true,
              type: true,
              duration: true,
              isPreview: true,
            },
          },
        },
      },
      faqs: {
        orderBy: { displayOrder: "asc" },
        select: { id: true, question: true, answer: true },
      },
    },
  });

  if (!course) notFound();

  let isEnrolled = false;
  if (session?.user?.role === "STUDENT") {
    const enrolment = await db.enrolment.findUnique({
      where: {
        userId_courseId: { userId: session.user.id, courseId: course.id },
      },
      select: { id: true },
    });
    isEnrolled = !!enrolment;
  }

  const previewLectures = course.sections.flatMap((s) =>
    s.lectures.filter((l) => l.isPreview),
  );
  const discountPct =
    course.mrp > course.price
      ? Math.round(((course.mrp - course.price) / course.mrp) * 100)
      : 0;
  const expiryPreview = getCheckoutExpiryPreview(
    course.accessDuration as AccessDuration,
  );
  const totalPublishedLectures = course.sections.reduce(
    (a, s) => a + s.lectures.length,
    0,
  );

  const LEVEL_LABELS: Record<string, string> = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
  };

  // Brand accent
  const BRAND = "#f57a22";
  const BRAND_DARK = "#c9591a";
  const BRAND_LIGHT = "#ff9a56";

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, #8a3d0e 0%, #d6641c 45%, #f57a22 80%, #ff9a56 100%)",
          color: "#fff",
          padding: "3.8rem 1.5rem",
          position: "relative",
          overflow: "hidden",
          borderBottom: `2px solid ${BRAND}`,
        }}
      >
        {/* Ambient glow accent */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${BRAND}55 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            gap: "2.5rem",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          {/* Left — course info */}
          <div style={{ flex: 1 }}>
            {/* Breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "1rem",
                fontSize: "12.5px",
              }}
            >
              <Link
                href={ROUTES.courses}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Courses
              </Link>
              <span style={{ color: "#fff" }}>/</span>
              {course.category && (
                <>
                  <Link
                    href={`/categories/${course.category.slug}`}
                    style={{ color: "#fff", textDecoration: "none" }}
                  >
                    {course.category.name}
                  </Link>
                  <span style={{ color: "#fff" }}>/</span>
                </>
              )}
              <span style={{ color: BRAND_LIGHT }}>{course.title}</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(22px, 4vw, 32px)",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 12px",
                lineHeight: 1.25,
                letterSpacing: "-0.6px",
              }}
            >
              {course.title}
            </h1>

            {course.description && (
              <p
                style={{
                  fontSize: "15px",
                  color: "#fff",
                  margin: "0 0 16px",
                  lineHeight: 1.6,
                }}
              >
                {course.description}
              </p>
            )}

            {/* Meta badges */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "12px",
              }}
            >
              <AccessDurationBadge
                duration={course.accessDuration as AccessDuration}
                variant="full"
              />
              <span
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: `${BRAND}22`,
                  color: BRAND_LIGHT,
                  border: `1px solid ${BRAND}55`,
                }}
              >
                {LEVEL_LABELS[course.level] ?? course.level}
              </span>
              <span
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.08)",
                  color: "#e2d8cf",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {course.language}
              </span>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                fontSize: "12.5px",
                color: "#c8b8ab",
              }}
            >
              <span>{totalPublishedLectures} lectures</span>
              {course.totalDuration > 0 && (
                <span>· {course.totalDuration} min</span>
              )}
              {course.author.name && <span>· By {course.author.name}</span>}
            </div>
          </div>

          {/* Right — Pricing card (desktop) */}
          <div
            style={{ width: "320px", flexShrink: 0, display: "none" }}
            className="pricing-card-desktop"
          />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div
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
          {/* Preview video */}
          {course.previewVideoUrl && (
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
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#f57a22",
                  margin: "0 0 10px",
                }}
              >
                Course Preview
              </p>
              <video
                src={course.previewVideoUrl}
                controls
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  background: "#000",
                }}
              />
            </div>
          )}

          {/* About */}
          {course.about && (
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
                  margin: "0 0 10px",
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
                About this course
              </p>
              <p
                style={{
                  fontSize: "13.5px",
                  color: "#475569",
                  margin: 0,
                  lineHeight: 1.75,
                }}
              >
                {course.about}
              </p>
            </div>
          )}

          {/* Curriculum */}
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
                margin: "0 0 4px",
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
              Curriculum
            </p>
            <p
              style={{
                fontSize: "12.5px",
                color: "#94a3b8",
                margin: "0 0 14px",
              }}
            >
              {totalPublishedLectures} lectures ·{" "}
              {course.totalDuration > 0
                ? `${course.totalDuration} min`
                : "Self-paced"}
            </p>

            {course.sections.map((section) => (
              <CurriculumSection
                key={section.id}
                section={section}
                isEnrolled={isEnrolled}
                brand={BRAND}
              />
            ))}
          </div>

          {/* FAQs */}
          {course.faqs.length > 0 && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e8edf2",
                borderRadius: "16px",
                padding: "1.25rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 14px",
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
                FAQs
              </p>
              {course.faqs.map((faq) => (
                <div
                  key={faq.id}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    paddingBottom: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#0f172a",
                      margin: "0 0 4px",
                    }}
                  >
                    {faq.question}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      margin: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Pricing Card (sticky) ── */}
        <div style={{ width: "300px", flexShrink: 0 }}>
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8edf2",
              borderRadius: "18px",
              padding: "1.5rem",
              position: "sticky",
              top: "80px",
              boxShadow: "0 8px 28px rgba(245,122,34,0.12)",
              borderTop: `3px solid ${BRAND}`,
            }}
          >
            {/* Thumbnail */}
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.title}
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "1.25rem",
                }}
              />
            )}

            {/* Price */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: course.price === 0 ? "#16a34a" : BRAND_DARK,
                  letterSpacing: "-0.5px",
                }}
              >
                {course.price === 0
                  ? "Free"
                  : `₹${(course.price / 100).toLocaleString("en-IN")}`}
              </span>
              {course.mrp > course.price && (
                <span
                  style={{
                    fontSize: "16px",
                    color: "#94a3b8",
                    textDecoration: "line-through",
                  }}
                >
                  ₹{(course.mrp / 100).toLocaleString("en-IN")}
                </span>
              )}
              {discountPct > 0 && (
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "20px",
                    background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                    color: "#fff",
                  }}
                >
                  {discountPct}% OFF
                </span>
              )}
            </div>

            {/* Access duration info */}
            <div
              style={{
                padding: "10px 12px",
                background:
                  course.accessDuration === "LIFETIME"
                    ? "#fffbeb"
                    : `${BRAND}12`,
                border: `1px solid ${
                  course.accessDuration === "LIFETIME"
                    ? "#fde68a"
                    : `${BRAND}40`
                }`,
                borderRadius: "10px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Access duration
                </span>
                <AccessDurationBadge
                  duration={course.accessDuration as AccessDuration}
                  variant="card"
                />
              </div>
              <p
                style={{
                  fontSize: "11.5px",
                  color: "#64748b",
                  margin: "6px 0 0",
                }}
              >
                {course.accessDuration === "LIFETIME"
                  ? "Lifetime access — no expiry ever"
                  : `If enrolled today, access until ${expiryPreview}`}
              </p>
            </div>

            {/* CTA Button */}
            {isEnrolled ? (
              <Link
                href={ROUTES.coursePlayer(course.slug)}
                style={{
                  display: "block",
                  width: "100%",
                  height: "46px",
                  lineHeight: "46px",
                  textAlign: "center",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "14px",
                  textDecoration: "none",
                  marginBottom: "10px",
                  boxShadow: `0 4px 14px ${BRAND}55`,
                }}
              >
                Continue Learning →
              </Link>
            ) : (
              <EnrolButton
                courseId={course.id}
                courseSlug={course.slug}
                isLoggedIn={!!session?.user}
                isFree={course.price === 0}
              />
            )}

            {/* What you get */}
            <div
              style={{
                marginTop: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {[
                { icon: "📚", text: `${totalPublishedLectures} lectures` },
                {
                  icon: "🕐",
                  text:
                    course.totalDuration > 0
                      ? `${course.totalDuration} min content`
                      : "Self-paced",
                },
                { icon: "📱", text: "Access on all devices" },
                { icon: "📜", text: "Certificate on completion" },
                {
                  icon: "⏰",
                  text:
                    course.accessDuration === "LIFETIME"
                      ? "Lifetime access"
                      : `${ACCESS_DURATION_LABELS_FULL[course.accessDuration as AccessDuration]} access`,
                },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12.5px",
                    color: "#475569",
                  }}
                >
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ACCESS_DURATION_LABELS_FULL: Record<string, string> = {
  FIFTEEN_DAYS: "15-day",
  ONE_MONTH: "1-month",
  THREE_MONTHS: "3-month",
  SIX_MONTHS: "6-month",
  ONE_YEAR: "1-year",
};

// ── Curriculum Section Component ──────────────────────────────
function CurriculumSection({
  section,
  isEnrolled,
  brand,
}: {
  section: {
    id: string;
    title: string;
    lectures: {
      id: string;
      title: string;
      type: string;
      duration: number;
      isPreview: boolean;
    }[];
  };
  isEnrolled: boolean;
  brand: string;
}) {
  const TYPE_ICONS: Record<string, string> = {
    VIDEO: "▶",
    DOCUMENT: "📄",
    TEXT: "📝",
  };

  return (
    <div
      style={{
        marginBottom: "12px",
        border: "1px solid #f1f5f9",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderLeft: `3px solid ${brand}`,
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#0f172a",
            margin: 0,
          }}
        >
          {section.title}
        </p>
        <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
          {section.lectures.length} lectures
        </span>
      </div>
      {section.lectures.map((lecture) => {
        const canView = lecture.isPreview || isEnrolled;
        return (
          <div
            key={lecture.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 14px",
              borderTop: "1px solid #f8fafc",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: canView ? brand : "#94a3b8",
                flexShrink: 0,
              }}
            >
              {TYPE_ICONS[lecture.type] ?? "▶"}
            </span>
            <span
              style={{
                flex: 1,
                fontSize: "12.5px",
                color: canView ? "#334155" : "#94a3b8",
              }}
            >
              {lecture.title}
            </span>
            {lecture.isPreview && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "6px",
                  background: `linear-gradient(135deg, ${brand}22 0%, ${brand}33 100%)`,
                  color: brand,
                  border: `1px solid ${brand}55`,
                  flexShrink: 0,
                }}
              >
                Free
              </span>
            )}
            {!canView && (
              <span
                style={{ fontSize: "11px", color: "#cbd5e1", flexShrink: 0 }}
              >
                🔒
              </span>
            )}
            {lecture.duration > 0 && (
              <span
                style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0 }}
              >
                {lecture.duration}m
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
