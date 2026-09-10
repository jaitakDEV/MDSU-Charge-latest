// "use client";

// import { useState } from "react";
// import { ROUTES } from "@/config/app";
// import Link from "next/link";

// type Cert = {
//   id: string;
//   certificateNumber: string;
//   courseTitle: string;
//   studentName: string;
//   issuedAt: Date;
//   pdfUrl: string | null;
//   course: {
//     slug: string;
//     thumbnail: string | null;
//     totalLectures: number;
//     category: { name: string } | null;
//   };
// };

// export function CertificateCard({ cert }: { cert: Cert }) {
//   const [generating, setGenerating] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(cert.pdfUrl);
//   const [error, setError] = useState("");

//   async function handleDownload() {
//     if (pdfUrl) {
//       window.open(pdfUrl, "_blank");
//       return;
//     }

//     // PDF nahi bana abhi — generate karo
//     setGenerating(true);
//     setError("");
//     try {
//       const res = await fetch("/api/certificates/generate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: cert.id, // will be resolved server-side from session
//           courseId: cert.course.slug,
//         }),
//       });
//       const json = await res.json();
//       if (!json.success) throw new Error(json.error);
//       setPdfUrl(json.data.url);
//       window.open(json.data.url, "_blank");
//     } catch (e) {
//       setError("Failed to generate PDF. Please try again.");
//     } finally {
//       setGenerating(false);
//     }
//   }

//   const issuedStr = cert.issuedAt.toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   return (
//     <div
//       style={{
//         background: "#fff",
//         border: "1px solid #e8edf2",
//         borderRadius: "16px",
//         overflow: "hidden",
//         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//       }}
//     >
//       {/* Top accent + thumbnail */}
//       <div
//         style={{
//           position: "relative",
//           height: "100px",
//           background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
//           overflow: "hidden",
//         }}
//       >
//         {cert.course.thumbnail && (
//           <img
//             src={cert.course.thumbnail}
//             alt={cert.courseTitle}
//             style={{
//               position: "absolute",
//               inset: 0,
//               width: "100%",
//               height: "100%",
//               objectFit: "cover",
//               opacity: 0.2,
//             }}
//           />
//         )}

//         {/* Certificate badge overlay */}
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <div
//             style={{
//               width: "52px",
//               height: "52px",
//               borderRadius: "50%",
//               background: "rgba(255,255,255,0.15)",
//               border: "2px solid rgba(255,255,255,0.4)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               backdropFilter: "blur(4px)",
//             }}
//           >
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#fbbf24"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="12" cy="8" r="6" />
//               <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
//             </svg>
//           </div>
//         </div>

//         {/* Category badge */}
//         {cert.course.category && (
//           <span
//             style={{
//               position: "absolute",
//               top: "10px",
//               left: "12px",
//               fontSize: "10px",
//               fontWeight: 700,
//               padding: "2px 8px",
//               borderRadius: "20px",
//               background: "rgba(255,255,255,0.2)",
//               color: "#fff",
//               backdropFilter: "blur(4px)",
//             }}
//           >
//             {cert.course.category.name}
//           </span>
//         )}
//       </div>

//       {/* Content */}
//       <div style={{ padding: "1.25rem" }}>
//         {/* Course title */}
//         <p
//           style={{
//             fontSize: "14.5px",
//             fontWeight: 700,
//             color: "#0f172a",
//             margin: "0 0 4px",
//             lineHeight: 1.35,
//             letterSpacing: "-0.2px",
//             display: "-webkit-box",
//             WebkitLineClamp: 2,
//             WebkitBoxOrient: "vertical",
//             overflow: "hidden",
//           }}
//         >
//           {cert.courseTitle}
//         </p>

//         <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 14px" }}>
//           Awarded to{" "}
//           <strong style={{ color: "#475569" }}>{cert.studentName}</strong>
//         </p>

//         {/* Meta info */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "6px",
//             marginBottom: "14px",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               fontSize: "12px",
//             }}
//           >
//             <span style={{ color: "#94a3b8" }}>Issued on</span>
//             <span style={{ color: "#475569", fontWeight: 600 }}>
//               {issuedStr}
//             </span>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               fontSize: "12px",
//             }}
//           >
//             <span style={{ color: "#94a3b8" }}>Certificate No.</span>
//             <code
//               style={{
//                 fontSize: "10.5px",
//                 color: "#64748b",
//                 background: "#f8fafc",
//                 padding: "1px 6px",
//                 borderRadius: "5px",
//               }}
//             >
//               {cert.certificateNumber.slice(-10)}
//             </code>
//           </div>
//         </div>

//         {error && (
//           <p
//             style={{ fontSize: "11.5px", color: "#dc2626", margin: "0 0 8px" }}
//           >
//             {error}
//           </p>
//         )}

//         {/* Actions */}
//         <div style={{ display: "flex", gap: "8px" }}>
//           <button
//             onClick={handleDownload}
//             disabled={generating}
//             style={{
//               flex: 1,
//               height: "38px",
//               border: "none",
//               borderRadius: "10px",
//               background: generating
//                 ? "#f1f5f9"
//                 : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
//               color: generating ? "#94a3b8" : "#fff",
//               fontSize: "12.5px",
//               fontWeight: 700,
//               cursor: generating ? "not-allowed" : "pointer",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "6px",
//               boxShadow: generating ? "none" : "0 2px 6px rgba(245,158,11,0.3)",
//             }}
//           >
//             {generating ? (
//               <>
//                 <span style={{ fontSize: "11px" }}>Generating…</span>
//               </>
//             ) : pdfUrl ? (
//               <>
//                 <svg
//                   width="13"
//                   height="13"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//                   <polyline points="7 10 12 15 17 10" />
//                   <line x1="12" y1="15" x2="12" y2="3" />
//                 </svg>
//                 Download PDF
//               </>
//             ) : (
//               <>
//                 <svg
//                   width="13"
//                   height="13"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <circle cx="12" cy="12" r="10" />
//                   <polyline points="12 8 12 12 14 14" />
//                 </svg>
//                 Generate PDF
//               </>
//             )}
//           </button>

//           <Link
//             href={ROUTES.coursePlayer(cert.course.slug)}
//             style={{
//               height: "38px",
//               padding: "0 14px",
//               display: "flex",
//               alignItems: "center",
//               border: "1px solid #e2e8f0",
//               borderRadius: "10px",
//               background: "#fff",
//               color: "#475569",
//               fontSize: "12.5px",
//               fontWeight: 600,
//               textDecoration: "none",
//             }}
//           >
//             Revisit
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { ROUTES } from "@/config/app";
import Link from "next/link";

type Cert = {
  id: string;
  courseId: string;
  certificateNumber: string;
  courseTitle: string;
  studentName: string;
  issuedAt: Date;
  pdfUrl: string | null;
  course: {
    slug: string;
    thumbnail: string | null;
    totalLectures: number;
    category: { name: string } | null;
  };
};

export function CertificateCard({
  cert,
  userId,
}: {
  cert: Cert;
  userId: string;
}) {
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(cert.pdfUrl);
  const [error, setError] = useState("");

  async function handleDownload() {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId, // ✅ real user id from session
          courseId: cert.courseId, // ✅ real course id
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setPdfUrl(json.data.url);
      window.open(json.data.url, "_blank");
    } catch {
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  const issuedStr = cert.issuedAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8edf2",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* ── Top banner ── */}
      <div
        style={{
          position: "relative",
          height: "100px",
          background: "linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)",
          overflow: "hidden",
        }}
      >
        {cert.course.thumbnail && (
          <img
            src={cert.course.thumbnail}
            alt={cert.courseTitle}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.2,
            }}
          />
        )}

        {/* Certificate icon */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>
        </div>

        {/* Category badge */}
        {cert.course.category && (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "12px",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              backdropFilter: "blur(4px)",
            }}
          >
            {cert.course.category.name}
          </span>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "1.25rem" }}>
        {/* Course title */}
        <p
          style={{
            fontSize: "14.5px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
            lineHeight: 1.35,
            letterSpacing: "-0.2px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {cert.courseTitle}
        </p>

        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 14px" }}>
          Awarded to{" "}
          <strong style={{ color: "#475569" }}>{cert.studentName}</strong>
        </p>

        {/* Meta */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
            }}
          >
            <span style={{ color: "#94a3b8" }}>Issued on</span>
            <span style={{ color: "#475569", fontWeight: 600 }}>
              {issuedStr}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
            }}
          >
            <span style={{ color: "#94a3b8" }}>Certificate No.</span>
            <code
              style={{
                fontSize: "10.5px",
                color: "#64748b",
                background: "#f8fafc",
                padding: "1px 6px",
                borderRadius: "5px",
              }}
            >
              {cert.certificateNumber.slice(-10)}
            </code>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p
            style={{ fontSize: "11.5px", color: "#dc2626", margin: "0 0 8px" }}
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleDownload}
            disabled={generating}
            style={{
              flex: 1,
              height: "38px",
              border: "none",
              borderRadius: "10px",
              background: generating
                ? "#f1f5f9"
                : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: generating ? "#94a3b8" : "#fff",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: generating ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: generating ? "none" : "0 2px 6px rgba(245,158,11,0.3)",
            }}
          >
            {generating ? (
              <span style={{ fontSize: "11px" }}>Generating…</span>
            ) : pdfUrl ? (
              <>
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </>
            ) : (
              <>
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
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 8 12 12 14 14" />
                </svg>
                Generate PDF
              </>
            )}
          </button>

          <Link
            href={ROUTES.coursePlayer(cert.course.slug)}
            style={{
              height: "38px",
              padding: "0 14px",
              display: "flex",
              alignItems: "center",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              background: "#fff",
              color: "#475569",
              fontSize: "12.5px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Revisit
          </Link>
        </div>
      </div>
    </div>
  );
}
