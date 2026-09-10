// // import { auth } from "@/server/auth";
// // import { redirect } from "next/navigation";
// // import { db } from "@/server/db";
// // import { ROUTES } from "@/config/app";
// // import { formatDate } from "@/lib/utils";
// // import Link from "next/link";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// // export const metadata = { title: "Dashboard — MDSSC" };

// // export default async function DashboardHomePage() {
// //   const session = await auth();
// //   if (!session?.user) redirect(ROUTES.login);

// //   const user = await db.user.findUnique({
// //     where: { id: session.user.id },
// //     select: { name: true, email: true, createdAt: true, role: true },
// //   });

// //   if (!user) redirect(ROUTES.login);

// //   const stats = [
// //     {
// //       label: "Account status",
// //       value: "Active",
// //       valueColor: "#16a34a",
// //       bg: "#f0fdf4",
// //       border: "#bbf7d0",
// //     },
// //     {
// //       label: "Role",
// //       value: user.role,
// //       valueColor: "#1d4ed8",
// //       bg: "#eff6ff",
// //       border: "#bfdbfe",
// //     },
// //     {
// //       label: "Member since",
// //       value: formatDate(user.createdAt),
// //       valueColor: "#0f172a",
// //       bg: "#f8fafc",
// //       border: "#e2e8f0",
// //     },
// //   ];

// //   return (
// //     <div>
// //       <div style={{ marginBottom: "2rem" }}>
// //         <h1
// //           style={{
// //             fontSize: "22px",
// //             fontWeight: 800,
// //             color: "#0f172a",
// //             margin: "0 0 6px",
// //             letterSpacing: "-0.5px",
// //           }}
// //         >
// //           Good to see you, {user.name?.split(" ")[0] ?? "there"} 👋
// //         </h1>
// //         <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
// //           Here&apos;s an overview of your MDSSC account.
// //         </p>
// //       </div>

// //       <div
// //         style={{
// //           display: "grid",
// //           gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
// //           gap: "1rem",
// //           marginBottom: "2rem",
// //         }}
// //       >
// //         {stats.map((stat) => (
// //           <div
// //             key={stat.label}
// //             style={{
// //               background: stat.bg,
// //               border: `1px solid ${stat.border}`,
// //               borderRadius: "12px",
// //               padding: "1.25rem",
// //             }}
// //           >
// //             <p
// //               style={{
// //                 fontSize: "12px",
// //                 color: "#64748b",
// //                 margin: "0 0 8px",
// //                 fontWeight: 500,
// //                 textTransform: "uppercase",
// //                 letterSpacing: "0.05em",
// //               }}
// //             >
// //               {stat.label}
// //             </p>
// //             <p
// //               style={{
// //                 fontSize: "20px",
// //                 fontWeight: 700,
// //                 margin: 0,
// //                 color: stat.valueColor,
// //               }}
// //             >
// //               {stat.value}
// //             </p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Quick Actions */}
// //       <Card>
// //         <CardHeader>
// //           <CardTitle
// //             style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}
// //           >
// //             Quick actions
// //           </CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
// //             <Link
// //               href={ROUTES.profile}
// //               style={{
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "6px",
// //                 padding: "8px 16px",
// //                 background: "#fff",
// //                 border: "1px solid #e2e8f0",
// //                 borderRadius: "8px",
// //                 fontSize: "13px",
// //                 fontWeight: 500,
// //                 color: "#374151",
// //                 textDecoration: "none",
// //                 transition: "all 0.15s",
// //               }}
// //             >
// //               👤 Edit profile
// //             </Link>
// //             <Link
// //               href={ROUTES.settings}
// //               style={{
// //                 display: "inline-flex",
// //                 alignItems: "center",
// //                 gap: "6px",
// //                 padding: "8px 16px",
// //                 background: "#fff",
// //                 border: "1px solid #e2e8f0",
// //                 borderRadius: "8px",
// //                 fontSize: "13px",
// //                 fontWeight: 500,
// //                 color: "#374151",
// //                 textDecoration: "none",
// //                 transition: "all 0.15s",
// //               }}
// //             >
// //               ⚙️ Settings
// //             </Link>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }

// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";
// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import { formatDate } from "@/lib/utils";
// import Link from "next/link";

// export const metadata = { title: "Dashboard — MDSSC" };

// export default async function DashboardHomePage() {
//   const session = await auth();
//   if (!session?.user) redirect(ROUTES.login);

//   const user = await db.user.findUnique({
//     where: { id: session.user.id },
//     select: { name: true, email: true, createdAt: true, role: true },
//   });

//   if (!user) redirect(ROUTES.login);

//   const firstName = user.name?.split(" ")[0] ?? "there";
//   const initials = user.name
//     ? user.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase()
//         .slice(0, 2)
//     : "U";

//   const stats = [
//     {
//       label: "Account Status",
//       value: "Active",
//       valueColor: "#15803d",
//       iconColor: "#16a34a",
//       iconBg: "#f0fdf4",
//       bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
//       border: "#bbf7d0",
//       icon: (
//         <svg
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//           <polyline points="22 4 12 14.01 9 11.01" />
//         </svg>
//       ),
//     },
//     {
//       label: "Role",
//       value: user.role,
//       valueColor: "#1d4ed8",
//       iconColor: "#1d4ed8",
//       iconBg: "#eff6ff",
//       bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
//       border: "#bfdbfe",
//       icon: (
//         <svg
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//         </svg>
//       ),
//     },
//     {
//       label: "Member Since",
//       value: formatDate(user.createdAt),
//       valueColor: "#0f172a",
//       iconColor: "#ea580c",
//       iconBg: "#fff7ed",
//       bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
//       border: "#e2e8f0",
//       icon: (
//         <svg
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//           <line x1="16" y1="2" x2="16" y2="6" />
//           <line x1="8" y1="2" x2="8" y2="6" />
//           <line x1="3" y1="10" x2="21" y2="10" />
//         </svg>
//       ),
//     },
//   ];

//   const quickActions = [
//     {
//       label: "Edit Profile",
//       href: ROUTES.profile,
//       icon: (
//         <svg
//           width="14"
//           height="14"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//           <circle cx="12" cy="7" r="4" />
//         </svg>
//       ),
//     },
//     {
//       label: "Settings",
//       href: ROUTES.settings,
//       icon: (
//         <svg
//           width="14"
//           height="14"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <circle cx="12" cy="12" r="3" />
//           <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       {/* Page Header */}
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
//               Dashboard
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
//               Good to see you, {firstName} 👋
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

//       {/* Stat Cards */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//           gap: "1rem",
//           marginBottom: "2rem",
//         }}
//       >
//         {stats.map((s) => (
//           <div
//             key={s.label}
//             style={{
//               background: s.bg,
//               border: `1px solid ${s.border}`,
//               borderRadius: "14px",
//               padding: "1.25rem 1.4rem",
//               display: "flex",
//               alignItems: "center",
//               gap: "16px",
//               position: "relative",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               style={{
//                 position: "absolute",
//                 top: "-18px",
//                 right: "-18px",
//                 width: "70px",
//                 height: "70px",
//                 borderRadius: "50%",
//                 background: s.iconColor,
//                 opacity: 0.07,
//               }}
//             />
//             <div
//               style={{
//                 width: "42px",
//                 height: "42px",
//                 borderRadius: "11px",
//                 background: s.iconBg,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//                 color: s.iconColor,
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//               }}
//             >
//               {s.icon}
//             </div>
//             <div>
//               <p
//                 style={{
//                   fontSize: "10.5px",
//                   color: "#94a3b8",
//                   margin: "0 0 4px",
//                   fontWeight: 600,
//                   textTransform: "uppercase",
//                   letterSpacing: "0.07em",
//                 }}
//               >
//                 {s.label}
//               </p>
//               <p
//                 style={{
//                   fontSize: "16px",
//                   fontWeight: 700,
//                   margin: 0,
//                   color: s.valueColor,
//                   letterSpacing: "-0.3px",
//                   lineHeight: 1.2,
//                 }}
//               >
//                 {s.value}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Quick Actions */}
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "14px",
//           border: "1px solid #e2e8f0",
//           overflow: "hidden",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//             padding: "1rem 1.5rem",
//             borderBottom: "1px solid #f1f5f9",
//             background: "#fafafa",
//           }}
//         >
//           <div
//             style={{
//               width: "30px",
//               height: "30px",
//               borderRadius: "8px",
//               background: "#f1f5f9",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#64748b"
//               strokeWidth="2.2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//             </svg>
//           </div>
//           <p
//             style={{
//               margin: 0,
//               fontSize: "13.5px",
//               fontWeight: 700,
//               color: "#0f172a",
//               letterSpacing: "-0.2px",
//             }}
//           >
//             Quick Actions
//           </p>
//         </div>

//         <div
//           style={{
//             padding: "1.25rem 1.5rem",
//             display: "flex",
//             gap: "8px",
//             flexWrap: "wrap",
//           }}
//         >
//           {quickActions.map((action) => (
//             <Link
//               key={action.href}
//               href={action.href}
//               style={{
//                 fontSize: "13px",
//                 padding: "8px 16px",
//                 borderRadius: "9px",
//                 border: "1px solid #e2e8f0",
//                 color: "#334155",
//                 textDecoration: "none",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: "7px",
//                 background: "#fff",
//                 fontWeight: 600,
//                 boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//                 transition: "all 0.14s",
//               }}
//             >
//               {action.icon}
//               {action.label}
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
import { formatDate } from "@/lib/utils";
import {
  getAccessStatus,
  getDaysRemaining,
  formatExpiryDate,
} from "@/lib/access-utils";
import { ExpiryBadge } from "@/features/enrolments/components/expiry-badge";
import Link from "next/link";

export const metadata = { title: "Dashboard — MDSSC" };

export default async function DashboardHomePage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, createdAt: true, role: true },
  });

  if (!user) redirect(ROUTES.login);

  // ── V3: Enrolled courses with expiry ──────────────────────
  const enrolments = await db.enrolment.findMany({
    where: { userId: session.user.id },
    orderBy: { accessGrantedAt: "desc" },
    take: 4,
    select: {
      id: true,
      accessDuration: true,
      accessGrantedAt: true,
      accessExpiresAt: true,
      completionPercent: true,
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          totalLectures: true,
          totalDuration: true,
          category: { select: { name: true } },
        },
      },
    },
  });

  const totalEnrolments = await db.enrolment.count({
    where: { userId: session.user.id },
  });

  const activeEnrolments = enrolments.filter(
    (e) => getAccessStatus(e.accessExpiresAt) !== "EXPIRED",
  ).length;

  const firstName = user.name?.split(" ")[0] ?? "there";
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const stats = [
    {
      label: "Account Status",
      value: "Active",
      valueColor: "#15803d",
      iconColor: "#16a34a",
      iconBg: "#f0fdf4",
      bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      border: "#bbf7d0",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Enrolled Courses",
      value: String(totalEnrolments),
      valueColor: "#1d4ed8",
      iconColor: "#1d4ed8",
      iconBg: "#eff6ff",
      bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      border: "#bfdbfe",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      label: "Member Since",
      value: formatDate(user.createdAt),
      valueColor: "#0f172a",
      iconColor: "#ea580c",
      iconBg: "#fff7ed",
      bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      border: "#e2e8f0",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    {
      label: "My Courses",
      href: ROUTES.myCourses,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      label: "Certificates",
      href: ROUTES.certificates,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
    },
    {
      label: "Edit Profile",
      href: ROUTES.profile,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: "Settings",
      href: ROUTES.settings,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ── Page Header ── */}
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
              Dashboard
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
              Good to see you, {firstName} 👋
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
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: "14px",
              padding: "1.25rem 1.4rem",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-18px",
                right: "-18px",
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: s.iconColor,
                opacity: 0.07,
              }}
            />
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "11px",
                background: s.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: s.iconColor,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {s.icon}
            </div>
            <div>
              <p
                style={{
                  fontSize: "10.5px",
                  color: "#94a3b8",
                  margin: "0 0 4px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  margin: 0,
                  color: s.valueColor,
                  letterSpacing: "-0.3px",
                  lineHeight: 1.2,
                }}
              >
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── V3: Enrolled Courses ── */}
      {enrolments.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.5rem",
              borderBottom: "1px solid #f1f5f9",
              background: "#fafafa",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.2px",
                }}
              >
                My Courses
              </p>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "1px 7px",
                  borderRadius: "20px",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                }}
              >
                {activeEnrolments} active
              </span>
            </div>
            <Link
              href={ROUTES.myCourses}
              style={{
                fontSize: "12.5px",
                color: "#1d4ed8",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>

          <div
            style={{
              padding: "1rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {enrolments.map((enrolment) => {
              const status = getAccessStatus(enrolment.accessExpiresAt);
              const days = getDaysRemaining(enrolment.accessExpiresAt);
              const isExpired = status === "EXPIRED";
              const course = enrolment.course;

              return (
                <Link
                  key={enrolment.id}
                  href={
                    isExpired
                      ? ROUTES.myCourses
                      : ROUTES.coursePlayer(course.slug)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: `1px solid ${isExpired ? "#fecaca" : "#f1f5f9"}`,
                    background: isExpired ? "#fef9f9" : "#fafbfc",
                    textDecoration: "none",
                    opacity: isExpired ? 0.75 : 1,
                    transition: "all 0.14s",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: "60px",
                      height: "40px",
                      borderRadius: "7px",
                      background: "#e2e8f0",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 600,
                        color: "#0f172a",
                        margin: "0 0 3px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {course.title}
                    </p>
                    {/* Progress bar */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "4px",
                          background: "#f1f5f9",
                          borderRadius: "99px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "4px",
                            borderRadius: "99px",
                            background: isExpired ? "#fca5a5" : "#1d4ed8",
                            width: `${enrolment.completionPercent}%`,
                            transition: "width 0.3s",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {enrolment.completionPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Expiry badge */}
                  <div style={{ flexShrink: 0 }}>
                    <ExpiryBadge
                      accessExpiresAt={enrolment.accessExpiresAt}
                      size="sm"
                    />
                  </div>

                  {/* Lock icon for expired */}
                  {isExpired ? (
                    <span style={{ fontSize: "14px", flexShrink: 0 }}>🔒</span>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flexShrink: 0 }}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>

          {totalEnrolments > 4 && (
            <div
              style={{
                padding: "10px 1.5rem",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
              }}
            >
              <Link
                href={ROUTES.myCourses}
                style={{
                  fontSize: "12.5px",
                  color: "#64748b",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                +{totalEnrolments - 4} more courses → View all
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Empty state — no courses yet */}
      {enrolments.length === 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px dashed #bfdbfe",
            padding: "2rem",
            textAlign: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1d4ed8"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            No courses yet
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 1rem" }}>
            Explore our course catalogue to start learning
          </p>
          <Link
            href={ROUTES.courses}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: "36px",
              padding: "0 16px",
              borderRadius: "9px",
              background: "#1d4ed8",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Browse Courses →
          </Link>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #f1f5f9",
            background: "#fafafa",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.2px",
            }}
          >
            Quick Actions
          </p>
        </div>

        <div
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              style={{
                fontSize: "13px",
                padding: "8px 16px",
                borderRadius: "9px",
                border: "1px solid #e2e8f0",
                color: "#334155",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                background: "#fff",
                fontWeight: 600,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
