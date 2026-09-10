// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";
// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import Link from "next/link";

// export const metadata = { title: "CMS Dashboard" };

// export default async function CmsDashboardPage() {
//   const session = await auth();
//   if (!session?.user) redirect(ROUTES.login);
//   if (session.user.role !== "CMS_EDITOR") redirect(ROUTES.login);

//   const userId = session.user.id;
//   const firstName = session.user.name?.split(" ")[0] ?? "Editor";
//   const initials = session.user.name
//     ? session.user.name
//         .split(" ")
//         .map((n: string) => n[0])
//         .join("")
//         .toUpperCase()
//         .slice(0, 2)
//     : "ED";

//   // ── Data fetch ──────────────────────────────────────────────
//   const [
//     totalCourses,
//     draftCourses,
//     reviewCourses,
//     publishedCourses,
//     recentCourses,
//     totalBanners,
//     activeBanners,
//     totalAnnouncements,
//     activeAnnouncements,
//     totalBlogPosts,
//     publishedBlogPosts,
//     staticPages,
//   ] = await Promise.all([
//     db.course.count({ where: { authorId: userId } }),
//     db.course.count({ where: { authorId: userId, status: "DRAFT" } }),
//     db.course.count({ where: { authorId: userId, status: "REVIEW" } }),
//     db.course.count({ where: { authorId: userId, status: "PUBLISHED" } }),
//     db.course.findMany({
//       where: { authorId: userId },
//       orderBy: { updatedAt: "desc" },
//       take: 5,
//       select: {
//         id: true,
//         title: true,
//         status: true,
//         updatedAt: true,
//         totalLectures: true,
//       },
//     }),
//     db.banner.count(),
//     db.banner.count({ where: { isActive: true } }),
//     db.announcement.count(),
//     db.announcement.count({ where: { isActive: true } }),
//     db.blogPost.count({ where: { authorId: userId } }),
//     db.blogPost.count({ where: { authorId: userId, status: "PUBLISHED" } }),
//     db.staticPage.findMany({
//       orderBy: { title: "asc" },
//       select: {
//         id: true,
//         title: true,
//         slug: true,
//         isPublished: true,
//         updatedAt: true,
//       },
//     }),
//   ]);

//   const STATUS_CONFIG = {
//     DRAFT: { label: "Draft", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
//     REVIEW: {
//       label: "In Review",
//       bg: "#fefce8",
//       color: "#854d0e",
//       dot: "#eab308",
//     },
//     PUBLISHED: {
//       label: "Published",
//       bg: "#f0fdf4",
//       color: "#166534",
//       dot: "#16a34a",
//     },
//     ARCHIVED: {
//       label: "Archived",
//       bg: "#fef2f2",
//       color: "#991b1b",
//       dot: "#ef4444",
//     },
//   } as const;

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       {/* ── Header ── */}
//       <div
//         style={{
//           paddingBottom: "1.5rem",
//           borderBottom: "1px solid #f1f5f9",
//           marginBottom: "2rem",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           flexWrap: "wrap",
//           gap: "12px",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
//           <div
//             style={{
//               width: "48px",
//               height: "48px",
//               borderRadius: "14px",
//               background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "16px",
//               fontWeight: 700,
//               color: "#fff",
//               flexShrink: 0,
//               letterSpacing: "-0.5px",
//               boxShadow: "0 2px 8px rgba(29,78,216,0.25)",
//             }}
//           >
//             {initials}
//           </div>
//           <div>
//             <p
//               style={{
//                 fontSize: "11px",
//                 fontWeight: 600,
//                 color: "#94a3b8",
//                 margin: "0 0 4px",
//                 letterSpacing: "0.08em",
//                 textTransform: "uppercase",
//               }}
//             >
//               CMS Panel
//             </p>
//             <h1
//               style={{
//                 fontSize: "22px",
//                 fontWeight: 700,
//                 color: "#0f172a",
//                 margin: 0,
//                 letterSpacing: "-0.5px",
//                 lineHeight: 1.2,
//               }}
//             >
//               Welcome back, {firstName} 👋
//             </h1>
//           </div>
//         </div>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "6px",
//             background: "#f8fafc",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             padding: "8px 14px",
//             fontSize: "12px",
//             color: "#64748b",
//             fontWeight: 500,
//           }}
//         >
//           <span
//             style={{
//               display: "inline-block",
//               width: "7px",
//               height: "7px",
//               borderRadius: "50%",
//               background: "#10b981",
//               boxShadow: "0 0 0 2px #d1fae5",
//             }}
//           />
//           Active session
//         </div>
//       </div>

//       {/* ── Stat Cards ── */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
//           gap: "12px",
//           marginBottom: "1.75rem",
//         }}
//       >
//         {[
//           {
//             label: "Total Courses",
//             value: totalCourses,
//             color: "#1d4ed8",
//             bg: "#eff6ff",
//             border: "#bfdbfe",
//             href: ROUTES.cmsCourses,
//           },
//           {
//             label: "Published",
//             value: publishedCourses,
//             color: "#16a34a",
//             bg: "#f0fdf4",
//             border: "#bbf7d0",
//             href: `${ROUTES.cmsCourses}?status=PUBLISHED`,
//           },
//           {
//             label: "In Review",
//             value: reviewCourses,
//             color: "#854d0e",
//             bg: "#fefce8",
//             border: "#fde68a",
//             href: `${ROUTES.cmsCourses}?status=REVIEW`,
//           },
//           {
//             label: "Drafts",
//             value: draftCourses,
//             color: "#64748b",
//             bg: "#f8fafc",
//             border: "#e2e8f0",
//             href: `${ROUTES.cmsCourses}?status=DRAFT`,
//           },
//           {
//             label: "Active Banners",
//             value: activeBanners,
//             color: "#7c3aed",
//             bg: "#faf5ff",
//             border: "#e9d5ff",
//             href: ROUTES.cmsBanners,
//           },
//           {
//             label: "Announcements",
//             value: activeAnnouncements,
//             color: "#0f766e",
//             bg: "#f0fdfa",
//             border: "#99f6e4",
//             href: ROUTES.cmsAnnouncements,
//           },
//         ].map(({ label, value, color, bg, border, href }) => (
//           <Link
//             key={label}
//             href={href}
//             style={{
//               background: bg,
//               border: `1px solid ${border}`,
//               borderRadius: "14px",
//               padding: "1rem 1.25rem",
//               textDecoration: "none",
//               display: "block",
//               transition: "box-shadow 0.14s",
//             }}
//           >
//             <p
//               style={{
//                 fontSize: "10.5px",
//                 color,
//                 margin: "0 0 6px",
//                 fontWeight: 700,
//                 textTransform: "uppercase",
//                 letterSpacing: "0.07em",
//               }}
//             >
//               {label}
//             </p>
//             <p
//               style={{
//                 fontSize: "26px",
//                 fontWeight: 800,
//                 color: "#0f172a",
//                 margin: 0,
//                 letterSpacing: "-0.6px",
//               }}
//             >
//               {value}
//             </p>
//           </Link>
//         ))}
//       </div>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 1fr",
//           gap: "1rem",
//           marginBottom: "1rem",
//         }}
//       >
//         {/* ── Recent Courses ── */}
//         <div
//           style={{
//             background: "#fff",
//             border: "1px solid #e8edf2",
//             borderRadius: "16px",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "1rem 1.25rem",
//               borderBottom: "1px solid #f1f5f9",
//               background: "#fafafa",
//             }}
//           >
//             <p
//               style={{
//                 fontSize: "13.5px",
//                 fontWeight: 700,
//                 color: "#0f172a",
//                 margin: 0,
//               }}
//             >
//               My Courses
//             </p>
//             <Link
//               href={ROUTES.cmsCourses}
//               style={{
//                 fontSize: "12px",
//                 color: "#1d4ed8",
//                 fontWeight: 600,
//                 textDecoration: "none",
//               }}
//             >
//               View all →
//             </Link>
//           </div>
//           <div style={{ padding: "8px 0" }}>
//             {recentCourses.length === 0 ? (
//               <div style={{ padding: "1.5rem", textAlign: "center" }}>
//                 <p
//                   style={{
//                     fontSize: "13px",
//                     color: "#94a3b8",
//                     margin: "0 0 10px",
//                   }}
//                 >
//                   No courses yet
//                 </p>
//                 <Link
//                   href={ROUTES.cmsCoursesNew}
//                   style={{
//                     fontSize: "12.5px",
//                     color: "#1d4ed8",
//                     fontWeight: 600,
//                     textDecoration: "none",
//                   }}
//                 >
//                   + Create your first course
//                 </Link>
//               </div>
//             ) : (
//               recentCourses.map((course) => {
//                 const cfg =
//                   STATUS_CONFIG[course.status as keyof typeof STATUS_CONFIG];
//                 return (
//                   <Link
//                     key={course.id}
//                     href={ROUTES.cmsCourseEdit(course.id)}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       padding: "9px 1.25rem",
//                       textDecoration: "none",
//                       borderBottom: "1px solid #f8fafc",
//                     }}
//                   >
//                     <span
//                       style={{
//                         width: "6px",
//                         height: "6px",
//                         borderRadius: "50%",
//                         background: cfg.dot,
//                         flexShrink: 0,
//                       }}
//                     />
//                     <p
//                       style={{
//                         flex: 1,
//                         fontSize: "13px",
//                         fontWeight: 500,
//                         color: "#0f172a",
//                         margin: 0,
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {course.title}
//                     </p>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "8px",
//                         flexShrink: 0,
//                       }}
//                     >
//                       <span style={{ fontSize: "10.5px", color: "#94a3b8" }}>
//                         {course.totalLectures} lec
//                       </span>
//                       <span
//                         style={{
//                           fontSize: "10.5px",
//                           fontWeight: 700,
//                           padding: "1px 7px",
//                           borderRadius: "20px",
//                           background: cfg.bg,
//                           color: cfg.color,
//                         }}
//                       >
//                         {cfg.label}
//                       </span>
//                     </div>
//                   </Link>
//                 );
//               })
//             )}
//           </div>
//           <div
//             style={{ padding: "10px 1.25rem", borderTop: "1px solid #f1f5f9" }}
//           >
//             <Link
//               href={ROUTES.cmsCoursesNew}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 fontSize: "12.5px",
//                 color: "#1d4ed8",
//                 fontWeight: 600,
//                 textDecoration: "none",
//               }}
//             >
//               <svg
//                 width="13"
//                 height="13"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <line x1="12" y1="5" x2="12" y2="19" />
//                 <line x1="5" y1="12" x2="19" y2="12" />
//               </svg>
//               New Course
//             </Link>
//           </div>
//         </div>

//         {/* ── Right column ── */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
//           {/* Content modules */}
//           <div
//             style={{
//               background: "#fff",
//               border: "1px solid #e8edf2",
//               borderRadius: "16px",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 padding: "1rem 1.25rem",
//                 borderBottom: "1px solid #f1f5f9",
//                 background: "#fafafa",
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: "13.5px",
//                   fontWeight: 700,
//                   color: "#0f172a",
//                   margin: 0,
//                 }}
//               >
//                 Content Modules
//               </p>
//             </div>
//             <div style={{ padding: "8px 0" }}>
//               {[
//                 {
//                   label: "Banners",
//                   sub: `${activeBanners} active / ${totalBanners} total`,
//                   href: ROUTES.cmsBanners,
//                   color: "#7c3aed",
//                   icon: (
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <rect x="3" y="3" width="18" height="18" rx="2" />
//                       <path d="M3 9h18" />
//                     </svg>
//                   ),
//                 },
//                 {
//                   label: "Announcements",
//                   sub: `${activeAnnouncements} active / ${totalAnnouncements} total`,
//                   href: ROUTES.cmsAnnouncements,
//                   color: "#0f766e",
//                   icon: (
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//                       <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//                     </svg>
//                   ),
//                 },
//                 {
//                   label: "Blog Posts",
//                   sub: `${publishedBlogPosts} published / ${totalBlogPosts} total`,
//                   href: ROUTES.cmsBlog,
//                   color: "#ea580c",
//                   icon: (
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M12 20h9" />
//                       <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
//                     </svg>
//                   ),
//                 },
//                 {
//                   label: "SEO Settings",
//                   sub: "Meta tags, OG image, GA",
//                   href: ROUTES.cmsSeo,
//                   color: "#64748b",
//                   icon: (
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <circle cx="11" cy="11" r="8" />
//                       <line x1="21" y1="21" x2="16.65" y2="16.65" />
//                     </svg>
//                   ),
//                 },
//               ].map(({ label, sub, href, color, icon }) => (
//                 <Link
//                   key={label}
//                   href={href}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "10px",
//                     padding: "9px 1.25rem",
//                     textDecoration: "none",
//                     borderBottom: "1px solid #f8fafc",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: "28px",
//                       height: "28px",
//                       borderRadius: "8px",
//                       background: "#f8fafc",
//                       border: "1px solid #f1f5f9",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       color,
//                       flexShrink: 0,
//                     }}
//                   >
//                     {icon}
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <p
//                       style={{
//                         fontSize: "13px",
//                         fontWeight: 600,
//                         color: "#0f172a",
//                         margin: "0 0 1px",
//                       }}
//                     >
//                       {label}
//                     </p>
//                     <p
//                       style={{
//                         fontSize: "11.5px",
//                         color: "#94a3b8",
//                         margin: 0,
//                       }}
//                     >
//                       {sub}
//                     </p>
//                   </div>
//                   <svg
//                     width="13"
//                     height="13"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="#cbd5e1"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <polyline points="9 18 15 12 9 6" />
//                   </svg>
//                 </Link>
//               ))}
//             </div>
//           </div>
//           Static Pages
//           <div
//             style={{
//               background: "#fff",
//               border: "1px solid #e8edf2",
//               borderRadius: "16px",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 padding: "1rem 1.25rem",
//                 borderBottom: "1px solid #f1f5f9",
//                 background: "#fafafa",
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: "13.5px",
//                   fontWeight: 700,
//                   color: "#0f172a",
//                   margin: 0,
//                 }}
//               >
//                 Static Pages
//               </p>
//               <Link
//                 href={ROUTES.cmsPages}
//                 style={{
//                   fontSize: "12px",
//                   color: "#1d4ed8",
//                   fontWeight: 600,
//                   textDecoration: "none",
//                 }}
//               >
//                 Edit →
//               </Link>
//             </div>
//             <div style={{ padding: "8px 0" }}>
//               {staticPages.map((page) => (
//                 <div
//                   key={page.id}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "10px",
//                     padding: "8px 1.25rem",
//                     borderBottom: "1px solid #f8fafc",
//                   }}
//                 >
//                   <span
//                     style={{
//                       width: "6px",
//                       height: "6px",
//                       borderRadius: "50%",
//                       background: page.isPublished ? "#16a34a" : "#e2e8f0",
//                       flexShrink: 0,
//                     }}
//                   />
//                   <p
//                     style={{
//                       flex: 1,
//                       fontSize: "12.5px",
//                       fontWeight: 500,
//                       color: "#475569",
//                       margin: 0,
//                     }}
//                   >
//                     {page.title}
//                   </p>
//                   <span
//                     style={{
//                       fontSize: "10.5px",
//                       color: page.isPublished ? "#16a34a" : "#94a3b8",
//                       fontWeight: 600,
//                     }}
//                   >
//                     {page.isPublished ? "Live" : "Draft"}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Quick Actions ── */}
//       <div
//         style={{
//           background: "#fff",
//           border: "1px solid #e8edf2",
//           borderRadius: "16px",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             padding: "1rem 1.25rem",
//             borderBottom: "1px solid #f1f5f9",
//             background: "#fafafa",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "13.5px",
//               fontWeight: 700,
//               color: "#0f172a",
//               margin: 0,
//             }}
//           >
//             Quick Actions
//           </p>
//         </div>
//         <div
//           style={{
//             padding: "1rem 1.25rem",
//             display: "flex",
//             gap: "8px",
//             flexWrap: "wrap",
//           }}
//         >
//           {[
//             {
//               label: "New Course",
//               href: ROUTES.cmsCoursesNew,
//               color: "#1d4ed8",
//               bg: "#eff6ff",
//               border: "#bfdbfe",
//             },
//             {
//               label: "Manage Banners",
//               href: ROUTES.cmsBanners,
//               color: "#7c3aed",
//               bg: "#faf5ff",
//               border: "#e9d5ff",
//             },
//             {
//               label: "Announcements",
//               href: ROUTES.cmsAnnouncements,
//               color: "#0f766e",
//               bg: "#f0fdfa",
//               border: "#99f6e4",
//             },
//             {
//               label: "Edit Pages",
//               href: ROUTES.cmsPages,
//               color: "#ea580c",
//               bg: "#fff7ed",
//               border: "#fed7aa",
//             },
//             {
//               label: "Blog",
//               href: ROUTES.cmsBlog,
//               color: "#854d0e",
//               bg: "#fefce8",
//               border: "#fde68a",
//             },
//           ].map(({ label, href, color, bg, border }) => (
//             <Link
//               key={label}
//               href={href}
//               style={{
//                 fontSize: "12.5px",
//                 padding: "7px 14px",
//                 borderRadius: "9px",
//                 border: `1px solid ${border}`,
//                 color,
//                 textDecoration: "none",
//                 background: bg,
//                 fontWeight: 600,
//               }}
//             >
//               {label}
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";

export const metadata = { title: "CMS Dashboard" };

export default async function CmsDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);
  if (session.user.role !== "CMS_EDITOR") redirect(ROUTES.login);

  const userId = session.user.id;
  const firstName = session.user.name?.split(" ")[0] ?? "Editor";
  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ED";

  const [
    totalCourses,
    draftCourses,
    reviewCourses,
    publishedCourses,
    recentCourses,
    totalBanners,
    activeBanners,
    totalAnnouncements,
    activeAnnouncements,
    totalBlogPosts,
    publishedBlogPosts,
  ] = await Promise.all([
    db.course.count({ where: { authorId: userId } }),
    db.course.count({ where: { authorId: userId, status: "DRAFT" } }),
    db.course.count({ where: { authorId: userId, status: "REVIEW" } }),
    db.course.count({ where: { authorId: userId, status: "PUBLISHED" } }),
    db.course.findMany({
      where: { authorId: userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        totalLectures: true,
      },
    }),
    db.banner.count(),
    db.banner.count({ where: { isActive: true } }),
    db.announcement.count(),
    db.announcement.count({ where: { isActive: true } }),
    db.blogPost.count({ where: { authorId: userId } }),
    db.blogPost.count({ where: { authorId: userId, status: "PUBLISHED" } }),
  ]);

  const STATUS_CONFIG = {
    DRAFT: { label: "Draft", bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
    REVIEW: {
      label: "In Review",
      bg: "#fefce8",
      color: "#854d0e",
      dot: "#eab308",
    },
    PUBLISHED: {
      label: "Published",
      bg: "#f0fdf4",
      color: "#166534",
      dot: "#16a34a",
    },
    ARCHIVED: {
      label: "Archived",
      bg: "#fef2f2",
      color: "#991b1b",
      dot: "#ef4444",
    },
  } as const;

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #f1f5f9",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              letterSpacing: "-0.5px",
              boxShadow: "0 2px 8px rgba(29,78,216,0.25)",
            }}
          >
            {initials}
          </div>
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#94a3b8",
                margin: "0 0 4px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              CMS Panel
            </p>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              Welcome back, {firstName} 👋
            </h1>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "12px",
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 0 2px #d1fae5",
            }}
          />
          Active session
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
          marginBottom: "1.75rem",
        }}
      >
        {[
          {
            label: "Total Courses",
            value: totalCourses,
            color: "#1d4ed8",
            bg: "#eff6ff",
            border: "#bfdbfe",
            href: ROUTES.cmsCourses,
          },
          {
            label: "Published",
            value: publishedCourses,
            color: "#16a34a",
            bg: "#f0fdf4",
            border: "#bbf7d0",
            href: `${ROUTES.cmsCourses}?status=PUBLISHED`,
          },
          {
            label: "In Review",
            value: reviewCourses,
            color: "#854d0e",
            bg: "#fefce8",
            border: "#fde68a",
            href: `${ROUTES.cmsCourses}?status=REVIEW`,
          },
          {
            label: "Drafts",
            value: draftCourses,
            color: "#64748b",
            bg: "#f8fafc",
            border: "#e2e8f0",
            href: `${ROUTES.cmsCourses}?status=DRAFT`,
          },
          {
            label: "Active Banners",
            value: activeBanners,
            color: "#7c3aed",
            bg: "#faf5ff",
            border: "#e9d5ff",
            href: ROUTES.cmsBanners,
          },
          {
            label: "Announcements",
            value: activeAnnouncements,
            color: "#0f766e",
            bg: "#f0fdfa",
            border: "#99f6e4",
            href: ROUTES.cmsAnnouncements,
          },
        ].map(({ label, value, color, bg, border, href }) => (
          <Link
            key={label}
            href={href}
            style={{
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: "14px",
              padding: "1rem 1.25rem",
              textDecoration: "none",
              display: "block",
              transition: "box-shadow 0.14s",
            }}
          >
            <p
              style={{
                fontSize: "10.5px",
                color,
                margin: "0 0 6px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "-0.6px",
              }}
            >
              {value}
            </p>
          </Link>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        {/* ── Recent Courses ── */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              borderBottom: "1px solid #f1f5f9",
              background: "#fafafa",
            }}
          >
            <p
              style={{
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              My Courses
            </p>
            <Link
              href={ROUTES.cmsCourses}
              style={{
                fontSize: "12px",
                color: "#1d4ed8",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>
          <div style={{ padding: "8px 0" }}>
            {recentCourses.length === 0 ? (
              <div style={{ padding: "1.5rem", textAlign: "center" }}>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#94a3b8",
                    margin: "0 0 10px",
                  }}
                >
                  No courses yet
                </p>
                <Link
                  href={ROUTES.cmsCoursesNew}
                  style={{
                    fontSize: "12.5px",
                    color: "#1d4ed8",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  + Create your first course
                </Link>
              </div>
            ) : (
              recentCourses.map((course) => {
                const cfg =
                  STATUS_CONFIG[course.status as keyof typeof STATUS_CONFIG];
                return (
                  <Link
                    key={course.id}
                    href={ROUTES.cmsCourseEdit(course.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 1.25rem",
                      textDecoration: "none",
                      borderBottom: "1px solid #f8fafc",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: cfg.dot,
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{
                        flex: 1,
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#0f172a",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {course.title}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: "10.5px", color: "#94a3b8" }}>
                        {course.totalLectures} lec
                      </span>
                      <span
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 700,
                          padding: "1px 7px",
                          borderRadius: "20px",
                          background: cfg.bg,
                          color: cfg.color,
                        }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
          <div
            style={{ padding: "10px 1.25rem", borderTop: "1px solid #f1f5f9" }}
          >
            <Link
              href={ROUTES.cmsCoursesNew}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12.5px",
                color: "#1d4ed8",
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
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Course
            </Link>
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Content modules */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8edf2",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid #f1f5f9",
                background: "#fafafa",
              }}
            >
              <p
                style={{
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Content Modules
              </p>
            </div>
            <div style={{ padding: "8px 0" }}>
              {[
                {
                  label: "Banners",
                  sub: `${activeBanners} active / ${totalBanners} total`,
                  href: ROUTES.cmsBanners,
                  color: "#7c3aed",
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18" />
                    </svg>
                  ),
                },
                {
                  label: "Announcements",
                  sub: `${activeAnnouncements} active / ${totalAnnouncements} total`,
                  href: ROUTES.cmsAnnouncements,
                  color: "#0f766e",
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  ),
                },
                {
                  label: "Blog Posts",
                  sub: `${publishedBlogPosts} published / ${totalBlogPosts} total`,
                  href: ROUTES.cmsBlog,
                  color: "#ea580c",
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  ),
                },
                {
                  label: "SEO Settings",
                  sub: "Meta tags, OG image, GA",
                  href: ROUTES.cmsSeo,
                  color: "#64748b",
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  ),
                },
              ].map(({ label, sub, href, color, icon }) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 1.25rem",
                    textDecoration: "none",
                    borderBottom: "1px solid #f8fafc",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      background: "#f8fafc",
                      border: "1px solid #f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color,
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#0f172a",
                        margin: "0 0 1px",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontSize: "11.5px",
                        color: "#94a3b8",
                        margin: 0,
                      }}
                    >
                      {sub}
                    </p>
                  </div>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid #f1f5f9",
            background: "#fafafa",
          }}
        >
          <p
            style={{
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
            }}
          >
            Quick Actions
          </p>
        </div>
        <div
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              label: "New Course",
              href: ROUTES.cmsCoursesNew,
              color: "#1d4ed8",
              bg: "#eff6ff",
              border: "#bfdbfe",
            },
            {
              label: "Manage Banners",
              href: ROUTES.cmsBanners,
              color: "#7c3aed",
              bg: "#faf5ff",
              border: "#e9d5ff",
            },
            {
              label: "Announcements",
              href: ROUTES.cmsAnnouncements,
              color: "#0f766e",
              bg: "#f0fdfa",
              border: "#99f6e4",
            },
            {
              label: "Blog",
              href: ROUTES.cmsBlog,
              color: "#854d0e",
              bg: "#fefce8",
              border: "#fde68a",
            },
          ].map(({ label, href, color, bg, border }) => (
            <Link
              key={label}
              href={href}
              style={{
                fontSize: "12.5px",
                padding: "7px 14px",
                borderRadius: "9px",
                border: `1px solid ${border}`,
                color,
                textDecoration: "none",
                background: bg,
                fontWeight: 600,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
