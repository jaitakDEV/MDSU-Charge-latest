// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";
// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import { CertificateCard } from "@/features/dashboard/components/certificate-card";
// import { Link } from "lucide-react";

// export const metadata = { title: "Certificates — MDSSC" };

// export default async function CertificatesPage() {
//   const session = await auth();
//   if (!session?.user) redirect(ROUTES.login);

//   const certificates = await db.certificate.findMany({
//     where: { userId: session.user.id },
//     orderBy: { issuedAt: "desc" },
//     select: {
//       id: true,
//       certificateNumber: true,
//       courseTitle: true,
//       studentName: true,
//       issuedAt: true,
//       pdfUrl: true,
//       course: {
//         select: {
//           slug: true,
//           thumbnail: true,
//           totalLectures: true,
//           category: { select: { name: true } },
//         },
//       },
//     },
//   });

//   return (
//     <div
//       style={{
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           paddingBottom: "1.5rem",
//           borderBottom: "1px solid #f1f5f9",
//           marginBottom: "1.75rem",
//         }}
//       >
//         <p
//           style={{
//             fontSize: "11px",
//             fontWeight: 600,
//             color: "#94a3b8",
//             margin: "0 0 4px",
//             letterSpacing: "0.08em",
//             textTransform: "uppercase",
//           }}
//         >
//           Student Dashboard
//         </p>
//         <h1
//           style={{
//             fontSize: "22px",
//             fontWeight: 700,
//             color: "#0f172a",
//             margin: 0,
//             letterSpacing: "-0.5px",
//           }}
//         >
//           My Certificates
//         </h1>
//       </div>

//       {/* Certificates count */}
//       {certificates.length > 0 && (
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//             marginBottom: "1.5rem",
//           }}
//         >
//           <div
//             style={{
//               width: "36px",
//               height: "36px",
//               borderRadius: "10px",
//               background: "#fffbeb",
//               border: "1px solid #fde68a",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <svg
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#f59e0b"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="12" cy="8" r="6" />
//               <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
//             </svg>
//           </div>
//           <p style={{ fontSize: "13.5px", color: "#475569", margin: 0 }}>
//             You have earned{" "}
//             <strong style={{ color: "#0f172a" }}>{certificates.length}</strong>{" "}
//             certificate{certificates.length !== 1 ? "s" : ""}
//           </p>
//         </div>
//       )}

//       {/* Important note */}
//       {certificates.length > 0 && (
//         <div
//           style={{
//             padding: "10px 14px",
//             background: "#f0fdf4",
//             border: "1px solid #bbf7d0",
//             borderRadius: "10px",
//             marginBottom: "1.5rem",
//             fontSize: "12.5px",
//             color: "#166534",
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//           }}
//         >
//           <svg
//             width="14"
//             height="14"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
//             <polyline points="22 4 12 14.01 9 11.01" />
//           </svg>
//           Certificates are permanently accessible. expires.
//         </div>
//       )}

//       {/* Certificate grid */}
//       {certificates.length === 0 ? (
//         <EmptyState />
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
//             gap: "16px",
//           }}
//         >
//           {certificates.map((cert) => (
//             <CertificateCard key={cert.id} cert={cert} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function EmptyState() {
//   return (
//     <div
//       style={{
//         textAlign: "center",
//         padding: "3.5rem 2rem",
//         background: "#fff",
//         border: "1px dashed #fde68a",
//         borderRadius: "16px",
//       }}
//     >
//       <div
//         style={{
//           width: "64px",
//           height: "64px",
//           borderRadius: "50%",
//           background: "#fffbeb",
//           border: "2px solid #fde68a",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           margin: "0 auto 1rem",
//         }}
//       >
//         <svg
//           width="28"
//           height="28"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="#f59e0b"
//           strokeWidth="1.8"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <circle cx="12" cy="8" r="6" />
//           <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
//         </svg>
//       </div>
//       <p
//         style={{
//           fontSize: "15px",
//           fontWeight: 700,
//           color: "#0f172a",
//           margin: "0 0 6px",
//         }}
//       >
//         No certificates yet
//       </p>
//       <p
//         style={{
//           fontSize: "13px",
//           color: "#64748b",
//           margin: "0 0 1.5rem",
//           lineHeight: 1.6,
//         }}
//       >
//         Complete all lectures in a course to earn your certificate of
//         completion.
//       </p>
//       <Link
//         href={ROUTES.myCourses}
//         style={{
//           display: "inline-flex",
//           alignItems: "center",
//           gap: "6px",
//           height: "38px",
//           padding: "0 18px",
//           border: "none",
//           borderRadius: "10px",
//           background: "#1d4ed8",
//           color: "#fff",
//           fontSize: "13px",
//           fontWeight: 600,
//           textDecoration: "none",
//         }}
//       >
//         Go to My Courses →
//       </Link>
//     </div>
//   );
// }

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { CertificateCard } from "@/features/dashboard/components/certificate-card";

export const metadata = { title: "Certificates — MDSSC" };

export default async function CertificatesPage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const certificates = await db.certificate.findMany({
    where: { userId: session.user.id },
    orderBy: { issuedAt: "desc" },
    select: {
      id: true,
      courseId: true, // ✅ add kiya
      certificateNumber: true,
      courseTitle: true,
      studentName: true,
      issuedAt: true,
      pdfUrl: true,
      course: {
        select: {
          slug: true,
          thumbnail: true,
          totalLectures: true,
          category: { select: { name: true } },
        },
      },
    },
  });

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #f1f5f9",
          marginBottom: "1.75rem",
        }}
      >
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
          Student Dashboard
        </p>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          My Certificates
        </h1>
      </div>

      {/* ── Count ── */}
      {certificates.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>
          <p style={{ fontSize: "13.5px", color: "#475569", margin: 0 }}>
            You have earned{" "}
            <strong style={{ color: "#0f172a" }}>{certificates.length}</strong>{" "}
            certificate{certificates.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* ── Note ── */}
      {certificates.length > 0 && (
        <div
          style={{
            padding: "10px 14px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "10px",
            marginBottom: "1.5rem",
            fontSize: "12.5px",
            color: "#166534",
            display: "flex",
            alignItems: "center",
            gap: "8px",
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Certificates are permanently accessible — even after course access
          expires.
        </div>
      )}

      {/* ── Grid ── */}
      {certificates.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {certificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              userId={session.user.id} // ✅ real userId pass kiya
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3.5rem 2rem",
        background: "#fff",
        border: "1px dashed #fde68a",
        borderRadius: "16px",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "#fffbeb",
          border: "2px solid #fde68a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1rem",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      </div>
      <p
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 6px",
        }}
      >
        No certificates yet
      </p>
      <p
        style={{
          fontSize: "13px",
          color: "#64748b",
          margin: "0 0 1.5rem",
          lineHeight: 1.6,
        }}
      >
        Complete all lectures in a course to earn your certificate of
        completion.
      </p>
      <Link
        href={ROUTES.myCourses}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          height: "38px",
          padding: "0 18px",
          border: "none",
          borderRadius: "10px",
          background: "#1d4ed8",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Go to My Courses →
      </Link>
    </div>
  );
}
