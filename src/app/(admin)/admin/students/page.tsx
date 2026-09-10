// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";
// import { db } from "@/server/db";
// import { Prisma } from "@prisma/client";
// import { ROUTES } from "@/config/app";
// import Link from "next/link";
// import { ToggleUserStatusButton } from "@/features/admin/components/toggle-user-status-button";

// export const metadata = { title: "Admin — Students" };

// const PAGE_SIZE = 20;

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

// function getPageNumbers(
//   currentPage: number,
//   totalPages: number,
// ): (number | "...")[] {
//   const pages: (number | "...")[] = [];
//   if (totalPages <= 7) {
//     for (let i = 1; i <= totalPages; i++) pages.push(i);
//   } else {
//     pages.push(1);
//     if (currentPage > 3) pages.push("...");
//     const start = Math.max(2, currentPage - 1);
//     const end = Math.min(totalPages - 1, currentPage + 1);
//     for (let i = start; i <= end; i++) pages.push(i);
//     if (currentPage < totalPages - 2) pages.push("...");
//     pages.push(totalPages);
//   }
//   return pages;
// }

// export default async function AdminStudentsPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ q?: string; page?: string }>;
// }) {
//   const session = await auth();
//   if (!session?.user || session.user.role !== "ADMIN")
//     redirect(ROUTES.dashboard);

//   const { q, page: pageParam } = await searchParams;
//   const query = q?.trim() ?? "";
//   const page = Math.max(1, Number(pageParam ?? 1));
//   const skip = (page - 1) * PAGE_SIZE;

//   const where: Prisma.UserWhereInput = {
//     role: "STUDENT",
//     ...(query
//       ? {
//           OR: [
//             { name: { contains: query, mode: "insensitive" } },
//             { email: { contains: query, mode: "insensitive" } },
//           ],
//         }
//       : {}),
//   };

//   const [students, total] = await Promise.all([
//     db.user.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//       skip,
//       take: PAGE_SIZE,
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         phoneNumber: true,
//         isActive: true,
//         emailVerified: true,
//         createdAt: true,
//         registrationNumber: true,
//         rollNumber: true,
//         college: { select: { name: true, city: true } },
//       },
//     }),
//     db.user.count({ where }),
//   ]);

//   const totalPages = Math.ceil(total / PAGE_SIZE);
//   const activeCount = students.filter((s) => s.isActive).length;

//   function pageUrl(p: number) {
//     const params = new URLSearchParams();
//     if (query) params.set("q", query);
//     if (p > 1) params.set("page", String(p));
//     const qs = params.toString();
//     return `${ROUTES.adminStudents}${qs ? `?${qs}` : ""}`;
//   }

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
//             Students
//             <span
//               style={{
//                 fontSize: "16px",
//                 fontWeight: 500,
//                 color: "#94a3b8",
//                 marginLeft: "10px",
//               }}
//             >
//               ({total})
//             </span>
//           </h1>
//           <p style={{ fontSize: "13.5px", color: "#94a3b8", margin: 0 }}>
//             Manage all registered student accounts.
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
//               boxShadow: "0 1px 3px rgba(29,78,216,0.25)",
//             }}
//           >
//             Search
//           </button>
//           {query && (
//             <Link
//               href={ROUTES.adminStudents}
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
//         {[
//           {
//             label: "Total Students",
//             value: total,
//             iconColor: "#1d4ed8",
//             iconBg: "#eff6ff",
//             bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
//             border: "#e2e8f0",
//             valueColor: "#0f172a",
//             icon: (
//               <svg
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
//                 <path d="M6 12v5c3 3 9 3 12 0v-5" />
//               </svg>
//             ),
//           },
//           {
//             label: "Active",
//             value: activeCount,
//             iconColor: "#16a34a",
//             iconBg: "#f0fdf4",
//             bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
//             border: "#bbf7d0",
//             valueColor: "#15803d",
//             icon: (
//               <svg
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//                 <polyline points="22 4 12 14.01 9 11.01" />
//               </svg>
//             ),
//           },
//           {
//             label: "Inactive",
//             value: students.length - activeCount,
//             iconColor: "#dc2626",
//             iconBg: "#fef2f2",
//             bg: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
//             border: "#fecaca",
//             valueColor: "#dc2626",
//             icon: (
//               <svg
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
//               </svg>
//             ),
//           },
//         ].map((s) => (
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
//           boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
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
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#64748b"
//                 strokeWidth="2.2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
//                 <path d="M6 12v5c3 3 9 3 12 0v-5" />
//               </svg>
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
//                 All Students
//               </p>
//               <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
//                 {query ? `Results for "${query}" — ` : ""}Page {page} of{" "}
//                 {totalPages || 1}
//               </p>
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
//             {students.length} / {total}
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
//                   "Student",
//                   "Roll No",
//                   "Reg No",
//                   "Phone",
//                   "Email",
//                   "College",
//                   "Status",
//                   "Verified",
//                   "Actions",
//                   "Profile",
//                 ].map((h) => (
//                   <th
//                     key={h}
//                     style={{
//                       padding: "10px 18px",
//                       textAlign: "left",
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
//               {students.map((s, i) => {
//                 const palette = avatarColor(s.email);
//                 const initials = s.name
//                   ? s.name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")
//                       .toUpperCase()
//                       .slice(0, 2)
//                   : "?";
//                 return (
//                   <tr
//                     key={s.id}
//                     style={{
//                       borderBottom:
//                         i < students.length - 1 ? "1px solid #f8fafc" : "none",
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
//                             color: palette.color,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: "12.5px",
//                             fontWeight: 700,
//                             flexShrink: 0,
//                             letterSpacing: "-0.3px",
//                           }}
//                         >
//                           {initials}
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
//                             {s.name ?? (
//                               <span
//                                 style={{ color: "#cbd5e1", fontWeight: 400 }}
//                               >
//                                 No name
//                               </span>
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                       {s.rollNumber ? (
//                         <span
//                           style={{
//                             fontSize: "12px",
//                             fontWeight: 700,
//                             color: "#1d4ed8",
//                             background: "#eff6ff",
//                             border: "1px solid #bfdbfe",
//                             padding: "2px 8px",
//                             borderRadius: "6px",
//                             fontFamily:
//                               "'JetBrains Mono', 'Fira Code', monospace",
//                             letterSpacing: "0.02em",
//                           }}
//                         >
//                           {s.rollNumber}
//                         </span>
//                       ) : (
//                         <span style={{ color: "#cbd5e1" }}>—</span>
//                       )}
//                     </td>

//                     <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
//                       {s.registrationNumber ? (
//                         <span
//                           style={{
//                             fontSize: "11.5px",
//                             color: "#475569",
//                             fontFamily:
//                               "'JetBrains Mono', 'Fira Code', monospace",
//                             letterSpacing: "0.01em",
//                           }}
//                         >
//                           {s.registrationNumber}
//                         </span>
//                       ) : (
//                         <span style={{ color: "#cbd5e1" }}>—</span>
//                       )}
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
//                         <svg
//                           width="13"
//                           height="13"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="#cbd5e1"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.35a16 16 0 0 0 6.29 6.29l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
//                         </svg>
//                         {s.phoneNumber ?? (
//                           <span style={{ color: "#cbd5e1" }}>—</span>
//                         )}
//                       </div>
//                     </td>

//                     <td
//                       style={{
//                         padding: "13px 18px",
//                         fontSize: "12.5px",
//                         color: "#475569",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {s.email}
//                     </td>

//                     <td
//                       style={{
//                         padding: "13px 18px",
//                         minWidth: "160px",
//                         maxWidth: "240px",
//                       }}
//                     >
//                       {s.college ? (
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "flex-start",
//                             gap: "6px",
//                           }}
//                         >
//                           <svg
//                             width="13"
//                             height="13"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="#cbd5e1"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             style={{ flexShrink: 0, marginTop: "2px" }}
//                           >
//                             <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//                             <polyline points="9 22 9 12 15 12 15 22" />
//                           </svg>
//                           <div>
//                             <p
//                               style={{
//                                 margin: 0,
//                                 fontSize: "12.5px",
//                                 fontWeight: 600,
//                                 color: "#334155",
//                                 lineHeight: 1.4,
//                                 overflowWrap: "break-word",
//                               }}
//                             >
//                               {s.college.name}
//                             </p>
//                             {s.college.city && (
//                               <p
//                                 style={{
//                                   margin: 0,
//                                   fontSize: "11px",
//                                   color: "#94a3b8",
//                                   lineHeight: 1.3,
//                                 }}
//                               >
//                                 {s.college.city}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       ) : (
//                         <span style={{ color: "#cbd5e1" }}>—</span>
//                       )}
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
//                           background: s.isActive ? "#f0fdf4" : "#fef2f2",
//                           color: s.isActive ? "#16a34a" : "#dc2626",
//                           border: `1px solid ${s.isActive ? "#bbf7d0" : "#fecaca"}`,
//                         }}
//                       >
//                         <span
//                           style={{
//                             width: "6px",
//                             height: "6px",
//                             borderRadius: "50%",
//                             background: s.isActive ? "#16a34a" : "#dc2626",
//                             flexShrink: 0,
//                           }}
//                         />
//                         {s.isActive ? "Active" : "Inactive"}
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
//                           background: s.emailVerified ? "#f0fdf4" : "#fffbeb",
//                           color: s.emailVerified ? "#16a34a" : "#d97706",
//                           border: `1px solid ${s.emailVerified ? "#bbf7d0" : "#fde68a"}`,
//                         }}
//                       >
//                         {s.emailVerified ? (
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
//                         {s.emailVerified ? "Verified" : "Pending"}
//                       </span>
//                     </td>

//                     <td style={{ padding: "13px 18px" }}>
//                       <ToggleUserStatusButton
//                         userId={s.id}
//                         isActive={s.isActive}
//                         isSelf={false}
//                       />
//                     </td>

//                     <td style={{ padding: "13px 18px" }}>
//                       <Link
//                         href={`/admin/students/${s.id}`}
//                         style={{
//                           display: "inline-flex",
//                           alignItems: "center",
//                           gap: "5px",
//                           fontSize: "12px",
//                           fontWeight: 600,
//                           color: "#1d4ed8",
//                           background: "#eff6ff",
//                           border: "1px solid #bfdbfe",
//                           borderRadius: "8px",
//                           padding: "6px 12px",
//                           textDecoration: "none",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         View
//                       </Link>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {students.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={10}
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
//                       <svg
//                         width="22"
//                         height="22"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="#cbd5e1"
//                         strokeWidth="1.8"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       >
//                         <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
//                         <path d="M6 12v5c3 3 9 3 12 0v-5" />
//                       </svg>
//                     </div>
//                     <p
//                       style={{
//                         margin: "0 0 4px",
//                         fontSize: "14px",
//                         fontWeight: 600,
//                         color: "#475569",
//                       }}
//                     >
//                       No students found
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
//                         : "No student accounts registered yet."}
//                     </p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {total > 0 && (
//           <div
//             style={{
//               padding: "12px 20px",
//               borderTop: "1px solid #f1f5f9",
//               background: "#fafafa",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               flexWrap: "wrap",
//               gap: "12px",
//             }}
//           >
//             <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
//               Showing{" "}
//               <span style={{ fontWeight: 600, color: "#64748b" }}>
//                 {skip + 1}–{Math.min(skip + PAGE_SIZE, total)}
//               </span>{" "}
//               of{" "}
//               <span style={{ fontWeight: 600, color: "#64748b" }}>{total}</span>{" "}
//               students{query && ` matching "${query}"`}
//             </p>

//             {totalPages > 1 && (
//               <div
//                 style={{ display: "flex", alignItems: "center", gap: "4px" }}
//               >
//                 {page > 1 ? (
//                   <Link
//                     href={pageUrl(page - 1)}
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       width: "32px",
//                       height: "32px",
//                       borderRadius: "8px",
//                       border: "1px solid #e2e8f0",
//                       background: "#fff",
//                       color: "#64748b",
//                       textDecoration: "none",
//                       boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//                     }}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="m15 18-6-6 6-6" />
//                     </svg>
//                   </Link>
//                 ) : (
//                   <span
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       width: "32px",
//                       height: "32px",
//                       borderRadius: "8px",
//                       border: "1px solid #f1f5f9",
//                       background: "#f8fafc",
//                       color: "#cbd5e1",
//                     }}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="m15 18-6-6 6-6" />
//                     </svg>
//                   </span>
//                 )}

//                 {getPageNumbers(page, totalPages).map((p, idx) =>
//                   p === "..." ? (
//                     <span
//                       key={`e-${idx}`}
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: "32px",
//                         height: "32px",
//                         fontSize: "13px",
//                         color: "#94a3b8",
//                       }}
//                     >
//                       ···
//                     </span>
//                   ) : (
//                     <Link
//                       key={p}
//                       href={pageUrl(p as number)}
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: "32px",
//                         height: "32px",
//                         borderRadius: "8px",
//                         border:
//                           p === page
//                             ? "1px solid #bfdbfe"
//                             : "1px solid #e2e8f0",
//                         background:
//                           p === page
//                             ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
//                             : "#fff",
//                         color: p === page ? "#1d4ed8" : "#64748b",
//                         textDecoration: "none",
//                         fontSize: "12.5px",
//                         fontWeight: p === page ? 700 : 500,
//                         boxShadow:
//                           p === page ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
//                       }}
//                     >
//                       {p}
//                     </Link>
//                   ),
//                 )}

//                 {page < totalPages ? (
//                   <Link
//                     href={pageUrl(page + 1)}
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       width: "32px",
//                       height: "32px",
//                       borderRadius: "8px",
//                       border: "1px solid #e2e8f0",
//                       background: "#fff",
//                       color: "#64748b",
//                       textDecoration: "none",
//                       boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
//                     }}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="m9 18 6-6-6-6" />
//                     </svg>
//                   </Link>
//                 ) : (
//                   <span
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       width: "32px",
//                       height: "32px",
//                       borderRadius: "8px",
//                       border: "1px solid #f1f5f9",
//                       background: "#f8fafc",
//                       color: "#cbd5e1",
//                     }}
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="m9 18 6-6-6-6" />
//                     </svg>
//                   </span>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { ToggleUserStatusButton } from "@/features/admin/components/toggle-user-status-button";

export const metadata = { title: "Admin — Students" };

const PAGE_SIZE = 20;

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

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }
  return pages;
}

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, Number(pageParam ?? 1));
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.UserWhereInput = {
    role: "STUDENT",
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [students, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        registrationNumber: true,
        rollNumber: true,
        college: { select: { name: true, city: true } },
      },
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const activeCount = students.filter((s) => s.isActive).length;

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `${ROUTES.adminStudents}${qs ? `?${qs}` : ""}`;
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
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
            Students
            <span
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#94a3b8",
                marginLeft: "10px",
              }}
            >
              ({total})
            </span>
          </h1>
          <p style={{ fontSize: "13.5px", color: "#94a3b8", margin: 0 }}>
            Manage all registered student accounts.
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
              boxShadow: "0 1px 3px rgba(29,78,216,0.25)",
            }}
          >
            Search
          </button>
          {query && (
            <Link
              href={ROUTES.adminStudents}
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            label: "Total Students",
            value: total,
            iconColor: "#1d4ed8",
            iconBg: "#eff6ff",
            bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            border: "#e2e8f0",
            valueColor: "#0f172a",
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
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            ),
          },
          {
            label: "Active",
            value: activeCount,
            iconColor: "#16a34a",
            iconBg: "#f0fdf4",
            bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            border: "#bbf7d0",
            valueColor: "#15803d",
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
            label: "Inactive",
            value: students.length - activeCount,
            iconColor: "#dc2626",
            iconBg: "#fef2f2",
            bg: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
            border: "#fecaca",
            valueColor: "#dc2626",
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
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            ),
          },
        ].map((s) => (
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
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
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
                All Students
              </p>
              <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
                {query ? `Results for "${query}" — ` : ""}Page {page} of{" "}
                {totalPages || 1}
              </p>
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
            {students.length} / {total}
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
                  "Student",
                  "Roll No",
                  "Reg No",
                  "Phone",
                  "Email",
                  "College",
                  "Verified",
                  "Actions",
                  "Profile",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 18px",
                      textAlign: "left",
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
              {students.map((s, i) => {
                const palette = avatarColor(s.email);
                const initials = s.name
                  ? s.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?";
                return (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom:
                        i < students.length - 1 ? "1px solid #f8fafc" : "none",
                    }}
                  >
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
                            width: "38px",
                            height: "38px",
                            borderRadius: "10px",
                            background: palette.bg,
                            color: palette.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            fontWeight: 700,
                            flexShrink: 0,
                            letterSpacing: "-0.3px",
                            border: `1px solid ${palette.color}1f`,
                          }}
                        >
                          {initials}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              fontSize: "13.5px",
                              color: "#0f172a",
                              lineHeight: 1.35,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {s.name ?? (
                              <span
                                style={{ color: "#cbd5e1", fontWeight: 400 }}
                              >
                                No name
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
                      {s.rollNumber ? (
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#1d4ed8",
                            background: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            padding: "2px 8px",
                            borderRadius: "6px",
                            fontFamily:
                              "'JetBrains Mono', 'Fira Code', monospace",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {s.rollNumber}
                        </span>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

                    <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
                      {s.registrationNumber ? (
                        <span
                          style={{
                            fontSize: "11.5px",
                            color: "#475569",
                            fontFamily:
                              "'JetBrains Mono', 'Fira Code', monospace",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {s.registrationNumber}
                        </span>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

                    <td style={{ padding: "13px 18px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#64748b",
                        }}
                      >
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
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.35a16 16 0 0 0 6.29 6.29l.95-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {s.phoneNumber ?? (
                          <span style={{ color: "#cbd5e1" }}>—</span>
                        )}
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "13px 18px",
                        fontSize: "12.5px",
                        color: "#475569",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.email}
                    </td>

                    <td
                      style={{
                        padding: "13px 18px",
                        minWidth: "160px",
                        maxWidth: "240px",
                      }}
                    >
                      {s.college ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "6px",
                          }}
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#cbd5e1"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ flexShrink: 0, marginTop: "2px" }}
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontSize: "12.5px",
                                fontWeight: 600,
                                color: "#334155",
                                lineHeight: 1.4,
                                overflowWrap: "break-word",
                              }}
                            >
                              {s.college.name}
                            </p>
                            {s.college.city && (
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "11px",
                                  color: "#94a3b8",
                                  lineHeight: 1.3,
                                }}
                              >
                                {s.college.city}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

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
                          background: s.emailVerified ? "#f0fdf4" : "#fffbeb",
                          color: s.emailVerified ? "#16a34a" : "#d97706",
                          border: `1px solid ${s.emailVerified ? "#bbf7d0" : "#fde68a"}`,
                        }}
                      >
                        {s.emailVerified ? (
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
                        {s.emailVerified ? "Verified" : "Pending"}
                      </span>
                    </td>

                    <td style={{ padding: "13px 18px" }}>
                      <ToggleUserStatusButton
                        userId={s.id}
                        isActive={s.isActive}
                        isSelf={false}
                      />
                    </td>

                    <td style={{ padding: "13px 18px" }}>
                      <Link
                        href={`/admin/students/${s.id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#1d4ed8",
                          background: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
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
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </div>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#475569",
                      }}
                    >
                      No students found
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
                        : "No student accounts registered yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid #f1f5f9",
              background: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              Showing{" "}
              <span style={{ fontWeight: 600, color: "#64748b" }}>
                {skip + 1}–{Math.min(skip + PAGE_SIZE, total)}
              </span>{" "}
              of{" "}
              <span style={{ fontWeight: 600, color: "#64748b" }}>{total}</span>{" "}
              students{query && ` matching "${query}"`}
            </p>

            {totalPages > 1 && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {page > 1 ? (
                  <Link
                    href={pageUrl(page - 1)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      color: "#64748b",
                      textDecoration: "none",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
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
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Link>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1px solid #f1f5f9",
                      background: "#f8fafc",
                      color: "#cbd5e1",
                    }}
                  >
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
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </span>
                )}

                {getPageNumbers(page, totalPages).map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`e-${idx}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        fontSize: "13px",
                        color: "#94a3b8",
                      }}
                    >
                      ···
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={pageUrl(p as number)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border:
                          p === page
                            ? "1px solid #bfdbfe"
                            : "1px solid #e2e8f0",
                        background:
                          p === page
                            ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
                            : "#fff",
                        color: p === page ? "#1d4ed8" : "#64748b",
                        textDecoration: "none",
                        fontSize: "12.5px",
                        fontWeight: p === page ? 700 : 500,
                        boxShadow:
                          p === page ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
                      }}
                    >
                      {p}
                    </Link>
                  ),
                )}

                {page < totalPages ? (
                  <Link
                    href={pageUrl(page + 1)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      color: "#64748b",
                      textDecoration: "none",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
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
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1px solid #f1f5f9",
                      background: "#f8fafc",
                      color: "#cbd5e1",
                    }}
                  >
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
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
