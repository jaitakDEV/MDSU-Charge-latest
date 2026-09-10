// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ROUTES } from "@/config/app";

// type Status = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";

// export function CmsCourseActions({
//   courseId,
//   courseSlug,
//   status,
// }: {
//   courseId: string;
//   courseSlug: string;
//   status: Status;
// }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState<string | null>(null);

//   async function handleAction(action: string) {
//     setLoading(action);

//     if (action === "archive") {
//       const res = await fetch(`/api/cms/courses/${courseId}/archive`, {
//         method: "PATCH",
//       });
//       if (res.ok) router.refresh();
//     }

//     if (action === "unarchive") {
//       const res = await fetch(`/api/cms/courses/${courseId}/unarchive`, {
//         method: "PATCH",
//       });
//       if (res.ok) router.refresh();
//     }

//     setLoading(null);
//   }

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: "6px",
//         flexShrink: 0,
//       }}
//     >
//       {/* Edit — always available */}
//       <Link
//         href={ROUTES.cmsCourseEdit(courseId)}
//         style={{
//           height: "32px",
//           padding: "0 12px",
//           display: "flex",
//           alignItems: "center",
//           gap: "5px",
//           border: "1px solid #e2e8f0",
//           borderRadius: "8px",
//           fontSize: "12px",
//           fontWeight: 600,
//           color: "#475569",
//           textDecoration: "none",
//           background: "#fff",
//         }}
//       >
//         <svg
//           width="12"
//           height="12"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2.2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M12 20h9" />
//           <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
//         </svg>
//         Edit
//       </Link>

//       {/* Curriculum — DRAFT / REVIEW */}
//       {(status === "DRAFT" || status === "REVIEW") && (
//         <Link
//           href={ROUTES.cmsCurriculum(courseId)}
//           style={{
//             height: "32px",
//             padding: "0 12px",
//             display: "flex",
//             alignItems: "center",
//             gap: "5px",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             fontSize: "12px",
//             fontWeight: 600,
//             color: "#475569",
//             textDecoration: "none",
//             background: "#fff",
//           }}
//         >
//           <svg
//             width="12"
//             height="12"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <line x1="8" y1="6" x2="21" y2="6" />
//             <line x1="8" y1="12" x2="21" y2="12" />
//             <line x1="8" y1="18" x2="21" y2="18" />
//             <line x1="3" y1="6" x2="3.01" y2="6" />
//             <line x1="3" y1="12" x2="3.01" y2="12" />
//             <line x1="3" y1="18" x2="3.01" y2="18" />
//           </svg>
//           Curriculum
//         </Link>
//       )}

//       {/* Submit for Review — DRAFT only */}
//       {status === "DRAFT" && (
//         <Link
//           href={`${ROUTES.cmsCourseEdit(courseId)}?submit=1`}
//           style={{
//             height: "32px",
//             padding: "0 12px",
//             display: "flex",
//             alignItems: "center",
//             gap: "5px",
//             border: "1px solid #bfdbfe",
//             borderRadius: "8px",
//             fontSize: "12px",
//             fontWeight: 600,
//             color: "#1d4ed8",
//             textDecoration: "none",
//             background: "#eff6ff",
//           }}
//         >
//           <svg
//             width="12"
//             height="12"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <line x1="22" y1="2" x2="11" y2="13" />
//             <polygon points="22 2 15 22 11 13 2 9 22 2" />
//           </svg>
//           Submit
//         </Link>
//       )}

//       {/* Archive — PUBLISHED only */}
//       {status === "PUBLISHED" && (
//         <button
//           onClick={() => handleAction("archive")}
//           disabled={loading === "archive"}
//           style={{
//             height: "32px",
//             padding: "0 12px",
//             display: "flex",
//             alignItems: "center",
//             gap: "5px",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             fontSize: "12px",
//             fontWeight: 600,
//             color: "#94a3b8",
//             background: "#fff",
//             cursor: "pointer",
//           }}
//         >
//           {loading === "archive" ? "…" : "Archive"}
//         </button>
//       )}

//       {/* Unarchive — ARCHIVED only */}
//       {status === "ARCHIVED" && (
//         <button
//           onClick={() => handleAction("unarchive")}
//           disabled={loading === "unarchive"}
//           style={{
//             height: "32px",
//             padding: "0 12px",
//             display: "flex",
//             alignItems: "center",
//             gap: "5px",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             fontSize: "12px",
//             fontWeight: 600,
//             color: "#64748b",
//             background: "#fff",
//             cursor: "pointer",
//           }}
//         >
//           {loading === "unarchive" ? "…" : "Restore"}
//         </button>
//       )}
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";

type Status = "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";

export function CmsCourseActions({
  courseId,
  courseSlug,
  status,
}: {
  courseId: string;
  courseSlug: string;
  status: Status;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(action: string) {
    setLoading(action);
    if (action === "archive") {
      const res = await fetch(`/api/cms/courses/${courseId}/archive`, {
        method: "PATCH",
      });
      if (res.ok) router.refresh();
    }
    if (action === "unarchive") {
      const res = await fetch(`/api/cms/courses/${courseId}/unarchive`, {
        method: "PATCH",
      });
      if (res.ok) router.refresh();
    }
    setLoading(null);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        flexShrink: 0,
      }}
    >
      {/* Edit — always available */}
      <Link
        href={ROUTES.cmsCourseEdit(courseId)}
        style={{
          height: "32px",
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: 600,
          color: "#475569",
          textDecoration: "none",
          background: "#fff",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        Edit
      </Link>

      {/* Curriculum — DRAFT / REVIEW / PUBLISHED sab pe */}
      {(status === "DRAFT" ||
        status === "REVIEW" ||
        status === "PUBLISHED") && (
        <Link
          href={ROUTES.cmsCurriculum(courseId)}
          style={{
            height: "32px",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#475569",
            textDecoration: "none",
            background: "#fff",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          Curriculum
        </Link>
      )}

      {/* Archive — PUBLISHED only */}
      {status === "PUBLISHED" && (
        <button
          onClick={() => handleAction("archive")}
          disabled={loading === "archive"}
          style={{
            height: "32px",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#94a3b8",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          {loading === "archive" ? "…" : "Archive"}
        </button>
      )}

      {/* Unarchive — ARCHIVED only */}
      {status === "ARCHIVED" && (
        <button
          onClick={() => handleAction("unarchive")}
          disabled={loading === "unarchive"}
          style={{
            height: "32px",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#64748b",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          {loading === "unarchive" ? "…" : "Restore"}
        </button>
      )}
    </div>
  );
}
