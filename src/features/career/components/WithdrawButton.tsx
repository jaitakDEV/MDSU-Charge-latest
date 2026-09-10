"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function WithdrawButton({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleWithdraw() {
    setLoading(true);
    await fetch(`/api/applications/${applicationId}/withdraw`, {
      method: "PATCH",
    });
    setLoading(false);
    router.refresh();
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        style={{
          fontSize: "12.5px",
          color: "#dc2626",
          background: "none",
          border: "1px solid #fecaca",
          borderRadius: "9px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        Withdraw Application
      </button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "12.5px", color: "#dc2626" }}>
        Withdraw this application? This cannot be undone.
      </span>
      <button
        onClick={handleWithdraw}
        disabled={loading}
        style={{
          fontSize: "12px",
          padding: "6px 14px",
          border: "none",
          borderRadius: "8px",
          background: "#dc2626",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {loading ? "…" : "Yes, Withdraw"}
      </button>
      <button
        onClick={() => setConfirm(false)}
        style={{
          fontSize: "12px",
          padding: "6px 12px",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </div>
  );
}
