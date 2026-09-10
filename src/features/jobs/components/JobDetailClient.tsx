// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { ROUTES } from "@/config/app";

// export function JobDetailClient({
//   jobId,
//   isLoggedIn,
//   isStudent,
//   hasApplied,
//   hasSaved,
//   hasResume,
//   isExpired,
//   currentPath,
// }: {
//   jobId: string;
//   isLoggedIn: boolean;
//   isStudent: boolean;
//   hasApplied: boolean;
//   hasSaved: boolean;
//   hasResume: boolean;
//   isExpired: boolean;
//   jobSlug: string;
//   currentPath: string;
// }) {
//   const router = useRouter();
//   const [saved, setSaved] = useState(hasSaved);
//   const [saving, setSaving] = useState(false);

//   async function toggleSave() {
//     setSaving(true);
//     await fetch(`/api/jobs/${jobId}/save`, {
//       method: saved ? "DELETE" : "POST",
//     });
//     setSaved(!saved);
//     setSaving(false);
//   }

//   if (isExpired) {
//     return (
//       <div
//         style={{
//           padding: "14px",
//           background: "#fef2f2",
//           borderRadius: "12px",
//           textAlign: "center",
//         }}
//       >
//         <p
//           style={{
//             fontSize: "13px",
//             fontWeight: 700,
//             color: "#991b1b",
//             margin: 0,
//           }}
//         >
//           Applications Closed
//         </p>
//       </div>
//     );
//   }

//   if (!isLoggedIn) {
//     return (
//       <Link
//         href={`${ROUTES.login}?callbackUrl=${encodeURIComponent(currentPath)}`}
//         style={{
//           display: "block",
//           height: "46px",
//           lineHeight: "46px",
//           textAlign: "center",
//           borderRadius: "12px",
//           background: "#1d4ed8",
//           color: "#fff",
//           fontWeight: 700,
//           fontSize: "14px",
//           textDecoration: "none",
//         }}
//       >
//         Login to Apply
//       </Link>
//     );
//   }

//   if (!isStudent) return null;

//   if (hasApplied) {
//     return (
//       <div
//         style={{
//           padding: "14px",
//           background: "#f0fdf4",
//           border: "1.5px solid #86efac",
//           borderRadius: "12px",
//           textAlign: "center",
//         }}
//       >
//         <p
//           style={{
//             fontSize: "13.5px",
//             fontWeight: 700,
//             color: "#166534",
//             margin: 0,
//           }}
//         >
//           ✓ You've Applied
//         </p>
//       </div>
//     );
//   }

//   if (!hasResume) {
//     return (
//       <div>
//         <p
//           style={{
//             fontSize: "12.5px",
//             color: "#dc2626",
//             marginBottom: "8px",
//             textAlign: "center",
//           }}
//         >
//           Upload a resume to apply
//         </p>
//         <Link
//           href={ROUTES.careerResume}
//           style={{
//             display: "block",
//             height: "46px",
//             lineHeight: "46px",
//             textAlign: "center",
//             borderRadius: "12px",
//             background: "#1d4ed8",
//             color: "#fff",
//             fontWeight: 700,
//             fontSize: "14px",
//             textDecoration: "none",
//           }}
//         >
//           Upload Resume
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <button
//         onClick={() => router.push(`?apply=1`)}
//         style={{
//           width: "100%",
//           height: "46px",
//           border: "none",
//           borderRadius: "12px",
//           background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
//           color: "#fff",
//           fontWeight: 700,
//           fontSize: "14px",
//           cursor: "pointer",
//           marginBottom: "8px",
//         }}
//       >
//         Apply Now
//       </button>
//       <button
//         onClick={toggleSave}
//         disabled={saving}
//         style={{
//           width: "100%",
//           height: "40px",
//           border: "1px solid #e2e8f0",
//           borderRadius: "10px",
//           background: saved ? "#fef2f2" : "#fff",
//           color: saved ? "#dc2626" : "#64748b",
//           fontSize: "13px",
//           fontWeight: 600,
//           cursor: "pointer",
//         }}
//       >
//         {saved ? "★ Saved" : "☆ Save for later"}
//       </button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/app";
import { ApplyModal } from "./ApplyModal";

export function JobDetailClient({
  jobId,
  jobTitle,
  companyName,
  screeningQuestions,
  isLoggedIn,
  isStudent,
  hasApplied,
  hasSaved,
  hasResume,
  resumeUrl,
  isExpired,
  currentPath,
}: {
  jobId: string;
  jobTitle: string;
  companyName: string;
  screeningQuestions: any[];
  isLoggedIn: boolean;
  isStudent: boolean;
  hasApplied: boolean;
  hasSaved: boolean;
  hasResume: boolean;
  resumeUrl: string;
  isExpired: boolean;
  currentPath: string;
}) {
  const [saved, setSaved] = useState(hasSaved);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  async function toggleSave() {
    setSaving(true);
    await fetch(`/api/jobs/${jobId}/save`, {
      method: saved ? "DELETE" : "POST",
    });
    setSaved(!saved);
    setSaving(false);
  }

  if (isExpired)
    return (
      <div
        style={{
          padding: "14px",
          background: "#fef2f2",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#991b1b",
            margin: 0,
          }}
        >
          Applications Closed
        </p>
      </div>
    );

  if (!isLoggedIn)
    return (
      <Link
        href={`${ROUTES.login}?callbackUrl=${encodeURIComponent(currentPath)}`}
        style={{
          display: "block",
          height: "46px",
          lineHeight: "46px",
          textAlign: "center",
          borderRadius: "12px",
          background: "#1d4ed8",
          color: "#fff",
          fontWeight: 700,
          fontSize: "14px",
          textDecoration: "none",
        }}
      >
        Login to Apply
      </Link>
    );

  if (!isStudent) return null;

  if (hasApplied)
    return (
      <div
        style={{
          padding: "14px",
          background: "#f0fdf4",
          border: "1.5px solid #86efac",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "13.5px",
            fontWeight: 700,
            color: "#166534",
            margin: 0,
          }}
        >
          ✓ You've Applied
        </p>
      </div>
    );

  if (!hasResume) {
    return (
      <div>
        <p
          style={{
            fontSize: "12.5px",
            color: "#dc2626",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Upload a resume to apply
        </p>
        <Link
          href={ROUTES.careerResume}
          style={{
            display: "block",
            height: "46px",
            lineHeight: "46px",
            textAlign: "center",
            borderRadius: "12px",
            background: "#1d4ed8",
            color: "#fff",
            fontWeight: 700,
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          Upload Resume
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        style={{
          width: "100%",
          height: "46px",
          border: "none",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "14px",
          cursor: "pointer",
          marginBottom: "8px",
        }}
      >
        Apply Now
      </button>
      <button
        onClick={toggleSave}
        disabled={saving}
        style={{
          width: "100%",
          height: "40px",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          background: saved ? "#fef2f2" : "#fff",
          color: saved ? "#dc2626" : "#64748b",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {saved ? "★ Saved" : "☆ Save for later"}
      </button>

      {showModal && (
        <ApplyModal
          jobId={jobId}
          jobTitle={jobTitle}
          companyName={companyName}
          resumeUrl={resumeUrl}
          screeningQuestions={screeningQuestions}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
