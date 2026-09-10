// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { revokeCmsEditorAction } from "@/features/admin/actions/cms-editor-actions";

// export function RevokeCmsEditorButton({ userId }: { userId: string }) {
//   const router = useRouter();
//   const [confirm, setConfirm] = useState(false);
//   const [loading, setLoading] = useState(false);

//   async function handleRevoke() {
//     setLoading(true);
//     const res = await revokeCmsEditorAction(userId);
//     setLoading(false);
//     if (res.success) router.refresh();
//   }

//   if (!confirm) {
//     return (
//       <button
//         onClick={() => setConfirm(true)}
//         style={{
//           fontSize: "12px",
//           padding: "5px 12px",
//           border: "0.5px solid var(--color-border-danger)",
//           borderRadius: "var(--border-radius-md)",
//           background: "none",
//           cursor: "pointer",
//           color: "var(--color-text-danger)",
//         }}
//       >
//         Revoke
//       </button>
//     );
//   }

//   return (
//     <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
//       <span style={{ fontSize: "12px", color: "var(--color-text-danger)" }}>
//         Sure?
//       </span>
//       <button
//         onClick={handleRevoke}
//         disabled={loading}
//         style={{
//           fontSize: "12px",
//           padding: "4px 10px",
//           border: "0.5px solid var(--color-border-danger)",
//           borderRadius: "var(--border-radius-md)",
//           background: "none",
//           cursor: "pointer",
//           color: "var(--color-text-danger)",
//         }}
//       >
//         {loading ? "…" : "Yes"}
//       </button>
//       <button
//         onClick={() => setConfirm(false)}
//         style={{
//           fontSize: "12px",
//           padding: "4px 10px",
//           border: "0.5px solid var(--color-border-secondary)",
//           borderRadius: "var(--border-radius-md)",
//           background: "none",
//           cursor: "pointer",
//           color: "var(--color-text-secondary)",
//         }}
//       >
//         Cancel
//       </button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revokeCmsEditorAction } from "@/features/admin/actions/cms-editor-actions";

export function RevokeCmsEditorButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRevoke() {
    setLoading(true);
    const res = await revokeCmsEditorAction(userId);
    setLoading(false);
    if (res.success) router.refresh();
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        style={{
          fontSize: "12px",
          padding: "5px 12px",
          border: "1px solid #fecaca",
          borderRadius: "7px",
          background: "#fff",
          cursor: "pointer",
          color: "#dc2626",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          boxShadow: "0 1px 2px rgba(220,38,38,0.06)",
          transition: "all 0.14s ease",
        }}
      >
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
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        Revoke
      </button>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 6px 4px 10px",
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "9px",
      }}
    >
      {/* Sure? label */}
      <span
        style={{
          fontSize: "11.5px",
          color: "#dc2626",
          fontWeight: 600,
          whiteSpace: "nowrap",
          letterSpacing: "-0.1px",
        }}
      >
        Revoke?
      </span>

      {/* Confirm Yes */}
      <button
        onClick={handleRevoke}
        disabled={loading}
        style={{
          fontSize: "11.5px",
          padding: "4px 10px",
          border: "1px solid #fca5a5",
          borderRadius: "6px",
          background: loading ? "#fca5a5" : "#dc2626",
          cursor: loading ? "not-allowed" : "pointer",
          color: "#fff",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          transition: "background 0.14s",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: "spin 0.8s linear infinite" }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </>
        ) : (
          <>
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
            Yes
          </>
        )}
      </button>

      {/* Cancel */}
      <button
        onClick={() => setConfirm(false)}
        disabled={loading}
        style={{
          fontSize: "11.5px",
          padding: "4px 10px",
          border: "1px solid #fecaca",
          borderRadius: "6px",
          background: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          color: "#94a3b8",
          fontWeight: 600,
          transition: "all 0.14s",
          opacity: loading ? 0.5 : 1,
        }}
      >
        Cancel
      </button>
    </div>
  );
}
