"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CourseApprovalActions({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function approve() {
    setLoading("approve");
    const res = await fetch(`/api/admin/courses/${courseId}/approve`, {
      method: "PATCH",
    });
    setLoading(null);
    if (res.ok) router.refresh();
  }

  async function reject() {
    if (!reason.trim()) return;
    setLoading("reject");
    const res = await fetch(`/api/admin/courses/${courseId}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setLoading(null);
    if (res.ok) router.refresh();
  }

  return (
    <div
      style={{
        background: "#fffbeb",
        border: "1.5px solid #fde68a",
        borderRadius: "14px",
        padding: "1.25rem",
      }}
    >
      <p
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#92400e",
          margin: "0 0 4px",
        }}
      >
        Review Required
      </p>
      <p style={{ fontSize: "12.5px", color: "#b45309", margin: "0 0 14px" }}>
        Approve to publish on the public catalogue, or reject with a reason.
      </p>

      {!showReject ? (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={approve}
            disabled={loading !== null}
            style={{
              height: "38px",
              padding: "0 20px",
              border: "none",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {loading === "approve" ? "Approving…" : "✓ Approve & Publish"}
          </button>
          <button
            onClick={() => setShowReject(true)}
            disabled={loading !== null}
            style={{
              height: "38px",
              padding: "0 20px",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              background: "#fef2f2",
              color: "#dc2626",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✕ Reject
          </button>
        </div>
      ) : (
        <div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this course is being rejected — the CMS Editor will receive this via email."
            style={{
              width: "100%",
              minHeight: "80px",
              padding: "10px 12px",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              fontSize: "13px",
              resize: "vertical",
              marginBottom: "10px",
            }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={reject}
              disabled={loading !== null || !reason.trim()}
              style={{
                height: "36px",
                padding: "0 18px",
                border: "none",
                borderRadius: "9px",
                background: "#dc2626",
                color: "#fff",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {loading === "reject" ? "Sending…" : "Confirm Rejection"}
            </button>
            <button
              onClick={() => {
                setShowReject(false);
                setReason("");
              }}
              style={{
                height: "36px",
                padding: "0 16px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                background: "#fff",
                fontSize: "12.5px",
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
