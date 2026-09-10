// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";
// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import { FacultyActions } from "@/features/admin/components/faculty-actions";

// import Link from "next/link";

// import { Users, UserCheck, UserX, Phone, Building2 } from "lucide-react";

// export const metadata = { title: "Admin — Faculty" };

// function initials(name: string | null) {
//   if (!name) return "?";
//   return name
//     .split(" ")
//     .map((w) => w[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();
// }

// const avatarPalette = [
//   { bg: "#eff6ff", color: "#1d4ed8" },
//   { bg: "#f0fdf4", color: "#16a34a" },
//   { bg: "#fdf4ff", color: "#9333ea" },
//   { bg: "#fff7ed", color: "#ea580c" },
//   { bg: "#fef2f2", color: "#dc2626" },
//   { bg: "#f0f9ff", color: "#0284c7" },
// ];

// function avatarColor(seed: string) {
//   return avatarPalette[seed.charCodeAt(0) % avatarPalette.length];
// }

// export default async function AdminFacultyPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ q?: string }>;
// }) {
//   const session = await auth();
//   if (!session?.user || session.user.role !== "ADMIN")
//     redirect(ROUTES.dashboard);

//   const { q } = await searchParams;
//   const query = q?.trim() ?? "";

//   const where = {
//     role: "FACULTY" as const,
//     ...(query
//       ? {
//           OR: [
//             { name: { contains: query, mode: "insensitive" as const } },
//             { email: { contains: query, mode: "insensitive" as const } },
//           ],
//         }
//       : {}),
//   };

//   const faculty = await db.user.findMany({
//     where,
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       phoneNumber: true,
//       isActive: true,
//       emailVerified: true,
//       createdAt: true,
//       college: { select: { id: true, name: true, city: true } },
//     },
//   });

//   const activeCount = faculty.filter((f) => f.isActive).length;
//   const inactiveCount = faculty.length - activeCount;

//   const stats = [
//     {
//       label: "Total Faculty",
//       value: faculty.length,
//       Icon: Users,
//       iconBg: "#eff6ff",
//       iconColor: "#1d4ed8",
//       bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
//       border: "#e2e8f0",
//       valueColor: "#0f172a",
//     },
//     {
//       label: "Active",
//       value: activeCount,
//       Icon: UserCheck,
//       iconBg: "#f0fdf4",
//       iconColor: "#16a34a",
//       bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
//       border: "#bbf7d0",
//       valueColor: "#15803d",
//     },
//     {
//       label: "Inactive",
//       value: inactiveCount,
//       Icon: UserX,
//       iconBg: "#fef2f2",
//       iconColor: "#dc2626",
//       bg: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
//       border: "#fecaca",
//       valueColor: "#dc2626",
//     },
//   ];

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           alignItems: "flex-end",
//           justifyContent: "space-between",
//           gap: "16px",
//           marginBottom: "2rem",
//           paddingBottom: "1.5rem",
//           borderBottom: "1px solid #f1f5f9",
//         }}
//       >
//         <div>
//           <p
//             style={{
//               fontSize: "11px",
//               fontWeight: 600,
//               color: "#94a3b8",
//               margin: "0 0 6px",
//               letterSpacing: "0.08em",
//               textTransform: "uppercase",
//             }}
//           >
//             Admin Console
//           </p>
//           <h1
//             style={{
//               fontSize: "24px",
//               fontWeight: 700,
//               color: "#0f172a",
//               margin: "0 0 4px",
//               letterSpacing: "-0.6px",
//               lineHeight: 1.2,
//             }}
//           >
//             Faculty
//             <span
//               style={{
//                 fontSize: "16px",
//                 fontWeight: 500,
//                 color: "#94a3b8",
//                 marginLeft: "10px",
//               }}
//             >
//               ({faculty.length})
//             </span>
//           </h1>
//           <p
//             style={{
//               fontSize: "13.5px",
//               color: "#94a3b8",
//               margin: 0,
//               fontWeight: 400,
//             }}
//           >
//             Manage faculty accounts across all colleges.
//           </p>
//         </div>

//         <form
//           method="GET"
//           style={{ display: "flex", alignItems: "center", gap: "8px" }}
//         >
//           <div style={{ position: "relative" }}>
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#94a3b8"
//               strokeWidth="2.2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               style={{
//                 position: "absolute",
//                 left: "10px",
//                 top: "50%",
//                 transform: "translateY(-50%)",
//                 pointerEvents: "none",
//               }}
//             >
//               <circle cx="11" cy="11" r="8" />
//               <path d="m21 21-4.35-4.35" />
//             </svg>
//             <input
//               name="q"
//               defaultValue={query}
//               placeholder="Search name or email…"
//               style={{
//                 fontSize: "13px",
//                 padding: "8px 12px 8px 32px",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "9px",
//                 background: "#fff",
//                 color: "#0f172a",
//                 width: "230px",
//                 outline: "none",
//                 boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//                 transition: "border-color 0.15s",
//               }}
//             />
//           </div>
//           <button
//             type="submit"
//             style={{
//               fontSize: "13px",
//               padding: "8px 18px",
//               border: "none",
//               borderRadius: "9px",
//               background: "#1d4ed8",
//               color: "#fff",
//               cursor: "pointer",
//               fontWeight: 600,
//               letterSpacing: "0.01em",
//               boxShadow: "0 1px 3px rgba(29,78,216,0.25)",
//               transition: "background 0.15s",
//             }}
//           >
//             Search
//           </button>
//           {query && (
//             <Link
//               href={ROUTES.adminFaculty}
//               style={{
//                 fontSize: "13px",
//                 padding: "8px 14px",
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "9px",
//                 color: "#64748b",
//                 textDecoration: "none",
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: "5px",
//                 background: "#fff",
//                 fontWeight: 500,
//                 boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//               }}
//             >
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M18 6 6 18" />
//                 <path d="m6 6 12 12" />
//               </svg>
//               Clear
//             </Link>
//           )}
//         </form>
//       </div>

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
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
//               }}
//             >
//               <s.Icon size={18} color={s.iconColor} />
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
//                   fontSize: "28px",
//                   fontWeight: 800,
//                   margin: 0,
//                   color: s.valueColor,
//                   letterSpacing: "-1px",
//                   lineHeight: 1,
//                 }}
//               >
//                 {s.value}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "14px",
//           border: "1px solid #e2e8f0",
//           overflow: "hidden",
//           boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "1rem 1.5rem",
//             borderBottom: "1px solid #f1f5f9",
//             background: "#fafafa",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <div
//               style={{
//                 width: "30px",
//                 height: "30px",
//                 borderRadius: "8px",
//                 background: "#f1f5f9",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Users size={14} color="#64748b" />
//             </div>
//             <div>
//               <p
//                 style={{
//                   margin: 0,
//                   fontSize: "13.5px",
//                   fontWeight: 700,
//                   color: "#0f172a",
//                   letterSpacing: "-0.2px",
//                 }}
//               >
//                 Faculty Members
//               </p>
//               {query && (
//                 <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
//                   Results for "{query}"
//                 </p>
//               )}
//             </div>
//           </div>
//           <span
//             style={{
//               fontSize: "11px",
//               fontWeight: 600,
//               color: "#64748b",
//               background: "#f1f5f9",
//               padding: "4px 10px",
//               borderRadius: "20px",
//               border: "1px solid #e2e8f0",
//             }}
//           >
//             {faculty.length} {faculty.length === 1 ? "member" : "members"}
//           </span>
//         </div>

//         <div style={{ overflowX: "auto" }}>
//           <table
//             style={{
//               width: "100%",
//               borderCollapse: "collapse",
//               fontSize: "13px",
//             }}
//           >
//             <thead>
//               <tr style={{ background: "#f8fafc" }}>
//                 {[
//                   "Faculty",
//                   "Phone",
//                   "College",
//                   "Status",
//                   "Verified",
//                   "Joined",
//                   "Actions",
//                 ].map((h) => (
//                   <th
//                     key={h}
//                     style={{
//                       padding: "10px 18px",
//                       textAlign: h === "Actions" ? "right" : "left",
//                       fontWeight: 600,
//                       color: "#94a3b8",
//                       fontSize: "10.5px",
//                       textTransform: "uppercase",
//                       letterSpacing: "0.08em",
//                       whiteSpace: "nowrap",
//                       borderBottom: "1px solid #f1f5f9",
//                     }}
//                   >
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {faculty.map((f, i) => {
//                 const palette = avatarColor(f.email);
//                 return (
//                   <tr
//                     key={f.id}
//                     style={{
//                       borderBottom:
//                         i < faculty.length - 1 ? "1px solid #f8fafc" : "none",
//                     }}
//                   >
//                     <td style={{ padding: "13px 18px" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "11px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "36px",
//                             height: "36px",
//                             borderRadius: "10px",
//                             background: palette.bg,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: "12.5px",
//                             fontWeight: 700,
//                             color: palette.color,
//                             flexShrink: 0,
//                             letterSpacing: "-0.3px",
//                           }}
//                         >
//                           {initials(f.name)}
//                         </div>
//                         <div>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontWeight: 600,
//                               color: "#0f172a",
//                               lineHeight: 1.3,
//                             }}
//                           >
//                             {f.name ?? "—"}
//                           </p>
//                           <p
//                             style={{
//                               margin: 0,
//                               fontSize: "11.5px",
//                               color: "#94a3b8",
//                               lineHeight: 1.3,
//                             }}
//                           >
//                             {f.email}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     <td style={{ padding: "13px 18px" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "6px",
//                           color: "#64748b",
//                         }}
//                       >
//                         <Phone size={13} color="#cbd5e1" />
//                         {f.phoneNumber ?? (
//                           <span style={{ color: "#cbd5e1" }}>—</span>
//                         )}
//                       </div>
//                     </td>

//                     <td style={{ padding: "13px 18px" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "6px",
//                           color: "#475569",
//                         }}
//                       >
//                         <Building2
//                           size={13}
//                           color="#cbd5e1"
//                           style={{ flexShrink: 0 }}
//                         />
//                         <span
//                           style={{
//                             maxWidth: "200px",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {f.college ? (
//                             `${f.college.name}${f.college.city ? ` — ${f.college.city}` : ""}`
//                           ) : (
//                             <span style={{ color: "#cbd5e1" }}>—</span>
//                           )}
//                         </span>
//                       </div>
//                     </td>

//                     <td style={{ padding: "13px 18px" }}>
//                       <span
//                         style={{
//                           display: "inline-flex",
//                           alignItems: "center",
//                           gap: "5px",
//                           fontSize: "11px",
//                           padding: "3px 10px",
//                           borderRadius: "6px",
//                           fontWeight: 600,
//                           background: f.isActive ? "#f0fdf4" : "#fef2f2",
//                           color: f.isActive ? "#16a34a" : "#dc2626",
//                           border: `1px solid ${f.isActive ? "#bbf7d0" : "#fecaca"}`,
//                         }}
//                       >
//                         <span
//                           style={{
//                             width: "6px",
//                             height: "6px",
//                             borderRadius: "50%",
//                             background: f.isActive ? "#16a34a" : "#dc2626",
//                             flexShrink: 0,
//                           }}
//                         />
//                         {f.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </td>

//                     <td style={{ padding: "13px 18px" }}>
//                       <span
//                         style={{
//                           display: "inline-flex",
//                           alignItems: "center",
//                           gap: "5px",
//                           fontSize: "11px",
//                           padding: "3px 10px",
//                           borderRadius: "6px",
//                           fontWeight: 600,
//                           background: f.emailVerified ? "#f0fdf4" : "#fffbeb",
//                           color: f.emailVerified ? "#16a34a" : "#d97706",
//                           border: `1px solid ${f.emailVerified ? "#bbf7d0" : "#fde68a"}`,
//                         }}
//                       >
//                         {f.emailVerified ? (
//                           <svg
//                             width="10"
//                             height="10"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="3"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <polyline points="20 6 9 17 4 12" />
//                           </svg>
//                         ) : (
//                           <svg
//                             width="10"
//                             height="10"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="3"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <circle cx="12" cy="12" r="10" />
//                             <line x1="12" y1="8" x2="12" y2="12" />
//                             <line x1="12" y1="16" x2="12.01" y2="16" />
//                           </svg>
//                         )}
//                         {f.emailVerified ? "Verified" : "Pending"}
//                       </span>
//                     </td>

//                     <td
//                       style={{
//                         padding: "13px 18px",
//                         color: "#94a3b8",
//                         fontSize: "12.5px",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {f.createdAt.toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </td>

//                     <td style={{ padding: "13px 18px", textAlign: "right" }}>
//                       <FacultyActions facultyId={f.id} isActive={f.isActive} />
//                     </td>
//                   </tr>
//                 );
//               })}

//               {faculty.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     style={{ padding: "4rem 2rem", textAlign: "center" }}
//                   >
//                     <div
//                       style={{
//                         width: "48px",
//                         height: "48px",
//                         borderRadius: "14px",
//                         background: "#f8fafc",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         margin: "0 auto 12px",
//                         border: "1px solid #f1f5f9",
//                       }}
//                     >
//                       <Users size={22} color="#cbd5e1" />
//                     </div>
//                     <p
//                       style={{
//                         margin: "0 0 4px",
//                         fontSize: "14px",
//                         fontWeight: 600,
//                         color: "#475569",
//                       }}
//                     >
//                       No faculty members found
//                     </p>
//                     <p
//                       style={{
//                         margin: 0,
//                         fontSize: "12.5px",
//                         color: "#94a3b8",
//                       }}
//                     >
//                       {query
//                         ? `No results for "${query}". Try a different search term.`
//                         : "No faculty accounts have been created yet."}
//                     </p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {faculty.length > 0 && (
//           <div
//             style={{
//               padding: "12px 20px",
//               borderTop: "1px solid #f1f5f9",
//               background: "#fafafa",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
//               Showing {faculty.length}{" "}
//               {faculty.length === 1 ? "faculty member" : "faculty members"}
//               {query && ` matching "${query}"`}
//             </p>
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "12px",
//                 fontSize: "12px",
//                 color: "#94a3b8",
//               }}
//             >
//               <span
//                 style={{ display: "flex", alignItems: "center", gap: "5px" }}
//               >
//                 <span
//                   style={{
//                     width: "6px",
//                     height: "6px",
//                     borderRadius: "50%",
//                     background: "#16a34a",
//                     display: "inline-block",
//                   }}
//                 />
//                 {activeCount} active
//               </span>
//               <span
//                 style={{ display: "flex", alignItems: "center", gap: "5px" }}
//               >
//                 <span
//                   style={{
//                     width: "6px",
//                     height: "6px",
//                     borderRadius: "50%",
//                     background: "#dc2626",
//                     display: "inline-block",
//                   }}
//                 />
//                 {inactiveCount} inactive
//               </span>
//             </div>
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
import { FacultyActions } from "@/features/admin/components/faculty-actions";
import Link from "next/link";
import { Users, UserCheck, UserX, Phone, Building2 } from "lucide-react";

export const metadata = { title: "Admin — Faculty" };

function initials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const avatarPalette = [
  { bg: "#eff6ff", color: "#1d4ed8" },
  { bg: "#f0fdf4", color: "#16a34a" },
  { bg: "#fdf4ff", color: "#9333ea" },
  { bg: "#fff7ed", color: "#ea580c" },
  { bg: "#fef2f2", color: "#dc2626" },
  { bg: "#f0f9ff", color: "#0284c7" },
];

function avatarColor(seed: string) {
  return avatarPalette[seed.charCodeAt(0) % avatarPalette.length];
}

export default async function AdminFacultyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const where = {
    role: "FACULTY" as const,
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { email: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const faculty = await db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      isActive: true,
      emailVerified: true,
      createdAt: true,
      college: { select: { id: true, name: true, city: true } },
    },
  });

  const activeCount = faculty.filter((f) => f.isActive).length;
  const inactiveCount = faculty.length - activeCount;

  const stats = [
    {
      label: "Total Faculty",
      value: faculty.length,
      Icon: Users,
      iconBg: "#eff6ff",
      iconColor: "#1d4ed8",
      bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      border: "#e2e8f0",
      valueColor: "#0f172a",
    },
    {
      label: "Active",
      value: activeCount,
      Icon: UserCheck,
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
      bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      border: "#bbf7d0",
      valueColor: "#15803d",
    },
    {
      label: "Inactive",
      value: inactiveCount,
      Icon: UserX,
      iconBg: "#fef2f2",
      iconColor: "#dc2626",
      bg: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
      border: "#fecaca",
      valueColor: "#dc2626",
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "2rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#94a3b8",
              margin: "0 0 6px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Admin Console
          </p>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px",
              letterSpacing: "-0.6px",
              lineHeight: 1.2,
            }}
          >
            Faculty
            <span
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#94a3b8",
                marginLeft: "10px",
              }}
            >
              ({faculty.length})
            </span>
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "#94a3b8",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Manage faculty accounts across all colleges.
          </p>
        </div>

        <form
          method="GET"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div style={{ position: "relative" }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              name="q"
              defaultValue={query}
              placeholder="Search name or email…"
              style={{
                fontSize: "13px",
                padding: "8px 12px 8px 32px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                background: "#fff",
                color: "#0f172a",
                width: "230px",
                outline: "none",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                transition: "border-color 0.15s",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              fontSize: "13px",
              padding: "8px 18px",
              border: "none",
              borderRadius: "9px",
              background: "#1d4ed8",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              letterSpacing: "0.01em",
              boxShadow: "0 1px 3px rgba(29,78,216,0.25)",
              transition: "background 0.15s",
            }}
          >
            Search
          </button>
          {query && (
            <Link
              href={ROUTES.adminFaculty}
              style={{
                fontSize: "13px",
                padding: "8px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                color: "#64748b",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "#fff",
                fontWeight: 500,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* Stat Cards */}
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
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <s.Icon size={18} color={s.iconColor} />
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
                  fontSize: "28px",
                  fontWeight: 800,
                  margin: 0,
                  color: s.valueColor,
                  letterSpacing: "-1px",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
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
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={14} color="#64748b" />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.2px",
                }}
              >
                Faculty Members
              </p>
              {query && (
                <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
                  Results for "{query}"
                </p>
              )}
            </div>
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#64748b",
              background: "#f1f5f9",
              padding: "4px 10px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
            }}
          >
            {faculty.length} {faculty.length === 1 ? "member" : "members"}
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {[
                  "Faculty",
                  "Phone",
                  "College",
                  "Status",
                  "Verified",
                  "Joined",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 18px",
                      textAlign: h === "Actions" ? "right" : "left",
                      fontWeight: 600,
                      color: "#94a3b8",
                      fontSize: "10.5px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      whiteSpace: "nowrap",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {faculty.map((f, i) => {
                const palette = avatarColor(f.email);
                return (
                  <tr
                    key={f.id}
                    style={{
                      borderBottom:
                        i < faculty.length - 1 ? "1px solid #f8fafc" : "none",
                    }}
                  >
                    {/* Faculty */}
                    <td style={{ padding: "13px 18px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "11px",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: palette.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12.5px",
                            fontWeight: 700,
                            color: palette.color,
                            flexShrink: 0,
                            letterSpacing: "-0.3px",
                          }}
                        >
                          {initials(f.name)}
                        </div>
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              color: "#0f172a",
                              lineHeight: 1.3,
                            }}
                          >
                            {f.name ?? "—"}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "11.5px",
                              color: "#94a3b8",
                              lineHeight: 1.3,
                            }}
                          >
                            {f.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td style={{ padding: "13px 18px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#64748b",
                        }}
                      >
                        <Phone size={13} color="#cbd5e1" />
                        {f.phoneNumber ?? (
                          <span style={{ color: "#cbd5e1" }}>—</span>
                        )}
                      </div>
                    </td>

                    {/* College — wraps instead of truncates */}
                    <td style={{ padding: "13px 18px", maxWidth: "200px" }}>
                      {f.college ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "6px",
                          }}
                        >
                          <Building2
                            size={13}
                            color="#cbd5e1"
                            style={{ flexShrink: 0, marginTop: "2px" }}
                          />
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "12.5px",
                                fontWeight: 600,
                                color: "#334155",
                                lineHeight: 1.4,
                                wordBreak: "break-word",
                              }}
                            >
                              {f.college.name}
                            </p>
                            {f.college.city && (
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "11px",
                                  color: "#94a3b8",
                                  lineHeight: 1.3,
                                }}
                              >
                                {f.college.city}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "13px 18px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontWeight: 600,
                          background: f.isActive ? "#f0fdf4" : "#fef2f2",
                          color: f.isActive ? "#16a34a" : "#dc2626",
                          border: `1px solid ${f.isActive ? "#bbf7d0" : "#fecaca"}`,
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: f.isActive ? "#16a34a" : "#dc2626",
                            flexShrink: 0,
                          }}
                        />
                        {f.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Verified */}
                    <td style={{ padding: "13px 18px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontWeight: 600,
                          background: f.emailVerified ? "#f0fdf4" : "#fffbeb",
                          color: f.emailVerified ? "#16a34a" : "#d97706",
                          border: `1px solid ${f.emailVerified ? "#bbf7d0" : "#fde68a"}`,
                        }}
                      >
                        {f.emailVerified ? (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                        )}
                        {f.emailVerified ? "Verified" : "Pending"}
                      </span>
                    </td>

                    {/* Joined */}
                    <td
                      style={{
                        padding: "13px 18px",
                        color: "#94a3b8",
                        fontSize: "12.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.createdAt.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "13px 18px", textAlign: "right" }}>
                      <FacultyActions facultyId={f.id} isActive={f.isActive} />
                    </td>
                  </tr>
                );
              })}

              {faculty.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: "4rem 2rem", textAlign: "center" }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                        background: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <Users size={22} color="#cbd5e1" />
                    </div>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#475569",
                      }}
                    >
                      No faculty members found
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12.5px",
                        color: "#94a3b8",
                      }}
                    >
                      {query
                        ? `No results for "${query}". Try a different search term.`
                        : "No faculty accounts have been created yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {faculty.length > 0 && (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid #f1f5f9",
              background: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              Showing {faculty.length}{" "}
              {faculty.length === 1 ? "faculty member" : "faculty members"}
              {query && ` matching "${query}"`}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#16a34a",
                    display: "inline-block",
                  }}
                />
                {activeCount} active
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#dc2626",
                    display: "inline-block",
                  }}
                />
                {inactiveCount} inactive
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
